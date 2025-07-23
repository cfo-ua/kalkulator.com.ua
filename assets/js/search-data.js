---
---
window.calculatorSearchData = {
  "uk": [
    {%- assign uk_calculators = site.pages | where_exp: "page", "page.url contains '/calculators/'" | where_exp: "page", "page.url != '/calculators/'" -%}
    {%- assign uk_calculators = uk_calculators | where_exp: "page", "page.url contains '/en/' == false" -%}
    {%- assign uk_calculators = uk_calculators | where_exp: "page", "page.url contains '/categories/' == false" -%}
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