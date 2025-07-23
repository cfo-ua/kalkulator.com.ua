---
---
window.calculatorSearchData = {
  "uk": [
    {%- assign uk_calculators = "" | split: "," -%}
    {%- for page in site.pages -%}
      {%- if page.url contains '/calculators/' and page.url != '/calculators/' -%}
        {%- unless page.url contains '/en/' or page.url contains '/categories/' -%}
          {%- assign uk_calculators = uk_calculators | push: page -%}
        {%- endunless -%}
      {%- endif -%}
    {%- endfor -%}
    {%- for page in uk_calculators -%}
      {%- assign filename = page.url | remove: '/calculators/' | remove: '.html' -%}
    {
      "title": {{ page.title | jsonify }},
      "url": {{ page.url | jsonify }},
      "filename": {{ filename | jsonify }}
    }{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ],
  "en": [
    {%- assign en_calculators = site.pages | where_exp: "page", "page.url contains '/en/calculators/'" -%}
    {%- for page in en_calculators -%}
      {%- assign filename = page.url | remove: '/en/calculators/' | remove: '.html' -%}
    {
      "title": {{ page.title | jsonify }},
      "url": {{ page.url | jsonify }},
      "filename": {{ filename | jsonify }}
    }{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ]
};