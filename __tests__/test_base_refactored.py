import pytest

@pytest.mark.parametrize(
    ("sample_file", "expected_result"),
    [
        (SAMPLE_DOCX, """# My Heading 1

This is a simple word document to test

### My Heading 3

This is bulleted list:

* Item 1
* Item 2"""),
        (SAMPLE_PDF, """My Heading 1
This is a simple PDF document to test.
My Heading 3
This is bulleted list:
- Item 1
- Item 2"""),
        (SAMPLE_CSV, """Name,Age,Department,Salary
Alice,30,HR,50000
Bob,24,Engineering,70000
Charlie,29,Marketing,60000
"""),
    ],
)
async def test_bytes_to_str_text_formats(sample_file: Path, expected_result: str) -> None:
    result = await bytes_to_str(sample_file.read_bytes(), sample_file.name)
    assert normalize_text(result) == normalize_text(expected_result)
