async def test_html_bytes_to_str_excludes_script_and_style_content() -> None:
    html = b"""
    <html>
      <head>
        <style>.hidden { display: none; }</style>
        <script>alert("bad")</script>
      </head>
      <body>
        <h1>Hello</h1>
        <p>Visible text</p>
      </body>
    </html>
    """

    result = await bytes_to_str(html, "page.html")

    assert "Hello" in result
    assert "Visible text" in result
    assert "alert" not in result
    assert "display: none" not in result
