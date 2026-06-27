import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from datetime import datetime
from difflib import SequenceMatcher
from typing import Optional
import uuid

# Import remediation engine
from remediation import (
    execute_remediation,
    get_job_status,
    get_all_jobs,
    get_dead_letter_queue,
    RemediationStatus,
    IntegrationPattern
)

app = FastAPI(title="Data Integration Service", version="2.0.0")

# Configuration
WAREHOUSE_CONFIG = {
    "host": os.getenv("WAREHOUSE_HOST", "localhost"),
    "port": os.getenv("WAREHOUSE_PORT", "5432"),
    "database": os.getenv("WAREHOUSE_DB", "analytics"),
    "user": os.getenv("WAREHOUSE_USER", "warehouse"),
    "password": os.getenv("WAREHOUSE_PASSWORD", "warehouse_secret"),
}

SERVICE_URLS = {
    "commerce": os.getenv("COMMERCE_URL", "http://localhost:8001"),
    "crm": os.getenv("CRM_URL", "http://localhost:8002"),
    "marketing": os.getenv("MARKETING_URL", "http://localhost:8003"),
    "support": os.getenv("SUPPORT_URL", "http://localhost:8004"),
    "agent_runtime": os.getenv("AGENT_RUNTIME_URL", "http://localhost:8005"),
    "catalog": os.getenv("CATALOG_URL", "http://localhost:8006"),
    "analytics": os.getenv("ANALYTICS_URL", "http://localhost:8007"),
}


def similarity(a: str, b: str) -> float:
    """Calculate string similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def match_company(crm_name: str, support_orgs: list) -> tuple:
    """Fuzzy match a CRM account name to support organizations."""
    best_match = None
    best_score = 0
    method = "none"

    for org in support_orgs:
        if crm_name.lower() == org["name"].lower():
            return org, 1.0, "exact"
        score = similarity(crm_name, org["name"])
        if score > best_score:
            best_score = score
            best_match = org
            method = "fuzzy"

    if best_score >= 0.6:
        return best_match, best_score, method
    return None, 0, "none"


@app.get("/health")
def health():
    return {"status": "healthy", "service": "integration"}


@app.get("/api/v1/questions")
async def get_questions():
    """Get list of available VP questions"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"{SERVICE_URLS['catalog']}/api/v1/summary")
        catalog = response.json()

    return {
        "questions": [
            {
                "id": "q1",
                "short_name": "At-Risk Deals",
                "question": "Which of our active deals are at risk because the prospect's team has open support issues?",
                "endpoint": "/api/v1/analysis/at-risk-deals"
            },
            {
                "id": "q2",
                "short_name": "Forecast Accuracy",
                "question": "Why did our forecast accuracy drop so dramatically last quarter?",
                "endpoint": "/api/v1/analysis/forecast-accuracy"
            },
            {
                "id": "q3",
                "short_name": "Discount Analysis",
                "question": "Which reps are discounting too aggressively and hurting our margins?",
                "endpoint": "/api/v1/analysis/discount-analysis"
            },
            {
                "id": "q4",
                "short_name": "Pipeline Discrepancy",
                "question": "Why do Sales and Marketing report different pipeline numbers?",
                "endpoint": "/api/v1/analysis/pipeline-discrepancy"
            },
            {
                "id": "q5",
                "short_name": "AI Agent Impact",
                "question": "Are our AI sales assistants helping or creating more problems?",
                "endpoint": "/api/v1/analysis/agent-impact"
            },
            {
                "id": "q6",
                "short_name": "Churn Prediction",
                "question": "Which accounts are most likely to churn before their renewal date?",
                "endpoint": "/api/v1/analysis/churn-prediction"
            }
        ]
    }


# =============================================================================
# Q1: At-Risk Deals (Support Issues)
# =============================================================================
@app.get("/api/v1/analysis/at-risk-deals")
async def analyze_at_risk_deals():
    """Q1: Which deals are at risk due to open support issues?"""
    run_id = f"run_{uuid.uuid4().hex[:8]}"
    results = []
    data_quality_warnings = []
    governance_violations = []

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Get CRM data
        crm_opps = await client.get(f"{SERVICE_URLS['crm']}/services/data/v58.0/query",
            params={"q": "SELECT * FROM Opportunity WHERE IsClosed=false"})
        opportunities = crm_opps.json().get("records", [])

        crm_accounts = await client.get(f"{SERVICE_URLS['crm']}/services/data/v58.0/sobjects/Account")
        accounts = {a["id"]: a for a in crm_accounts.json().get("records", [])}

        # Get support data
        support_orgs = await client.get(f"{SERVICE_URLS['support']}/api/v2/organizations.json")
        orgs = support_orgs.json().get("organizations", [])

        support_tickets = await client.get(f"{SERVICE_URLS['support']}/api/v2/tickets.json")
        tickets = support_tickets.json().get("tickets", [])

        # Get governance violations
        violations_resp = await client.get(f"{SERVICE_URLS['catalog']}/api/v1/governance/violations")
        all_violations = violations_resp.json().get("violations", [])
        governance_violations = [v for v in all_violations if "at_risk_deals" in v.get("question_relevance", []) or "agent_impact" in v.get("question_relevance", [])]

        # Get conflicts
        conflicts_resp = await client.get(f"{SERVICE_URLS['catalog']}/api/v1/quality/conflicts")
        conflicts = conflicts_resp.json().get("conflicts", [])

        for opp in opportunities:
            account = accounts.get(opp.get("account_id"), {})
            account_name = account.get("name", "Unknown")

            matched_org, confidence, method = match_company(account_name, orgs)

            if matched_org:
                org_tickets = [t for t in tickets if t["organization_id"] == matched_org["id"] and t["status"] in ["new", "open", "pending"]]

                if org_tickets:
                    warnings = []
                    if confidence < 0.9:
                        warnings.append(f"Fuzzy company match: '{account_name}' -> '{matched_org['name']}' ({confidence:.0%})")
                        data_quality_warnings.append(warnings[-1])

                    sla_breaches = [t for t in org_tickets if t.get("sla_breach")]
                    escalated = [t for t in org_tickets if t.get("priority") in ["high", "urgent"]]

                    # Check for multi-writer conflicts
                    for c in conflicts:
                        if c["field"] in ["customer_health_score", "deal_risk_score"]:
                            warnings.append(f"Multi-writer conflict on {c['field']} (correlation: {c['correlation']})")

                    results.append({
                        "deal_id": opp["id"],
                        "deal_name": opp.get("name"),
                        "account_name": account_name,
                        "amount": opp.get("amount"),
                        "stage": opp.get("stage_name"),
                        "close_date": opp.get("close_date"),
                        "risk_score": opp.get("deal_risk_score", 0.5),
                        "risk_source": opp.get("deal_risk_score_source"),
                        "open_tickets": len(org_tickets),
                        "escalated_tickets": len(escalated),
                        "sla_breaches": len(sla_breaches),
                        "ticket_subjects": [t["subject"][:50] for t in org_tickets[:3]],
                        "match_confidence": confidence,
                        "warnings": warnings
                    })

    results.sort(key=lambda x: (-x["risk_score"], -x["amount"]))

    return {
        "question": "Which of our active deals are at risk because the prospect's team has open support issues?",
        "answer": {
            "at_risk_deals": results,
            "total_at_risk": len(results),
            "total_pipeline_at_risk": sum(r["amount"] for r in results),
            "deals_with_sla_breach": len([r for r in results if r["sla_breaches"] > 0])
        },
        "data_quality": {
            "issues": ["Company name matching across systems", "Multi-writer conflicts on health scores", "Agent cascade modifications"],
            "warnings": list(set(data_quality_warnings)),
            "confidence": max(0.5, 1 - len(data_quality_warnings) * 0.1)
        },
        "governance_violations": governance_violations[:5],
        "metadata": {"run_id": run_id, "timestamp": datetime.utcnow().isoformat() + "Z"}
    }


# =============================================================================
# Q2: Forecast Accuracy
# =============================================================================
@app.get("/api/v1/analysis/forecast-accuracy")
async def analyze_forecast_accuracy():
    """Q2: Why did forecast accuracy drop?"""
    run_id = f"run_{uuid.uuid4().hex[:8]}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Get CRM data with history
        crm_opps = await client.get(f"{SERVICE_URLS['crm']}/services/data/v58.0/query",
            params={"q": "SELECT * FROM Opportunity"})
        all_opps = crm_opps.json()

        crm_history = await client.get(f"{SERVICE_URLS['crm']}/services/data/v58.0/sobjects/OpportunityFieldHistory")
        field_history = crm_history.json().get("records", [])

        # Get governance violations
        violations_resp = await client.get(f"{SERVICE_URLS['catalog']}/api/v1/governance/violations")
        all_violations = violations_resp.json().get("violations", [])
        governance_violations = [v for v in all_violations if "forecast_accuracy" in v.get("question_relevance", [])]

        opportunities = all_opps.get("records", [])
        closed_q4 = all_opps.get("closed_opportunities_q4", [])
        forecast_history = all_opps.get("forecast_history", [])

    # Analyze close date pushes
    deals_with_pushes = [o for o in opportunities if o.get("close_date_changes", 0) > 0]
    excessive_pushes = [o for o in opportunities if o.get("close_date_changes", 0) >= 3]

    # Analyze AI changes
    ai_changes = [h for h in field_history if h.get("changed_by") in ["sales_copilot", "pricing_agent", "warehouse_etl"]]
    probability_changes = [h for h in ai_changes if h.get("field_name") == "probability"]
    forecast_changes = [h for h in ai_changes if h.get("field_name") == "forecast_category"]

    # Q4 analysis
    q4_committed = [d for d in closed_q4 if d.get("forecast_at_start") == "Commit"]
    q4_committed_won = [d for d in q4_committed if d.get("is_won")]
    q4_accuracy = len(q4_committed_won) / len(q4_committed) if q4_committed else 0

    # Lost commits
    lost_commits = [d for d in q4_committed if not d.get("is_won")]

    return {
        "question": "Why did our forecast accuracy drop so dramatically last quarter?",
        "answer": {
            "q4_forecast_accuracy": f"{q4_accuracy:.1%}",
            "committed_deals": len(q4_committed),
            "committed_won": len(q4_committed_won),
            "committed_lost": len(lost_commits),
            "total_commit_value_lost": sum(d["amount"] for d in lost_commits),
            "root_causes": [
                {
                    "cause": "Close date manipulation",
                    "severity": "high",
                    "details": f"{len(deals_with_pushes)} deals had close dates pushed; {len(excessive_pushes)} exceeded 3-push limit",
                    "examples": [{"deal": o["name"], "pushes": o.get("close_date_changes"), "days_slipped": 30} for o in excessive_pushes[:3]]
                },
                {
                    "cause": "AI agents modifying probabilities",
                    "severity": "high",
                    "details": f"{len(probability_changes)} probability changes by AI agents without human review",
                    "examples": [{"deal": h.get("opportunity_id"), "old": h.get("old_value"), "new": h.get("new_value"), "agent": h.get("changed_by")} for h in probability_changes[:3]]
                },
                {
                    "cause": "Forecast category downgrades",
                    "severity": "medium",
                    "details": f"{len(forecast_changes)} forecast category changes by AI",
                    "impact": "Deals downgraded from Commit to Best Case without approval"
                },
                {
                    "cause": "Optimistic commit classification",
                    "severity": "medium",
                    "details": f"{len(lost_commits)} 'Commit' deals were lost in Q4",
                    "loss_reasons": list(set(d.get("loss_reason", "Unknown") for d in lost_commits))
                }
            ],
            "lost_deal_details": lost_commits
        },
        "data_quality": {
            "issues": ["Close date manipulation not tracked consistently", "AI probability changes lack audit trail", "Forecast methodology differs between systems"],
            "warnings": [f"{len(excessive_pushes)} deals exceeded close date push limit", f"{len(ai_changes)} AI modifications without human approval"],
            "confidence": 0.75
        },
        "governance_violations": governance_violations,
        "metadata": {"run_id": run_id, "timestamp": datetime.utcnow().isoformat() + "Z"}
    }

}
