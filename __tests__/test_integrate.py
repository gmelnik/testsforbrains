import base64
from pathlib import Path

import pytest

from assistant.filesystem._convert import bytes_to_str


SAMPLE_FILE_DIR = Path(__file__).parent / "test_data"


def normalize_text(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.strip().splitlines())


@pytest.mark.parametrize(
    ("filename", "expected_filename"),
    [
        ("Formatting Test.docx", "expected_formatting_test.md"),
        ("simple_pdf.pdf", "expected_simple_pdf.txt"),
        ("sample_data.csv", "expected_sample_data.csv"),
        ("sample_data.xlsx", "expected_sample_data.md"),
        ("sample_page.html", "expected_sample_page.md"),
    ],
)
async def test_bytes_to_str_supported_document_formats(
    filename: str,
    expected_filename: str,
) -> None:
    sample_file = SAMPLE_FILE_DIR / filename
    expected_file = SAMPLE_FILE_DIR / expected_filename

    result = await bytes_to_str(sample_file.read_bytes(), sample_file.name)
    expected = expected_file.read_text()

    assert normalize_text(result) == normalize_text(expected)


async def test_image_bytes_to_str_returns_valid_data_uri() -> None:
    sample_file = SAMPLE_FILE_DIR / "blank_image.png"
    image_bytes = sample_file.read_bytes()

    result = await bytes_to_str(image_bytes, sample_file.name)

    prefix = "data:image/png;base64,"
    assert result.startswith(prefix)

    decoded = base64.b64decode(result.removeprefix(prefix), validate=True)
    assert decoded == image_bytes


async def test_bytes_to_str_handles_uppercase_extension() -> None:
    sample_file = SAMPLE_FILE_DIR / "sample_data.csv"

    result = await bytes_to_str(sample_file.read_bytes(), "SAMPLE_DATA.CSV")

    assert "Alice,30,HR,50000" in result


async def test_bytes_to_str_handles_utf8_unicode_csv() -> None:
    csv_bytes = "Name,City\nGrigori,Montréal\nOlga,Київ\n".encode("utf-8")

    result = await bytes_to_str(csv_bytes, "unicode.csv")

    assert "Montréal" in result
    assert "Київ" in result
