# Sitemap Script Injection Prevention

## Issue
The sitemap.xml was experiencing script tag injection that caused Google Search Console errors:

```xml
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<script id="eppiocemhmnlbhjplcgkofciiegomcon"/>
<script/>
<script/>
<script/>
<script/>
<url>
<loc>https://kalkulator.com.ua/en/calculators/3d-printing-material-cost-calculator/</loc>
</url>
```

## Root Cause
Script injection in XML files can happen due to:
1. Browser extensions injecting scripts into all content (including XML)
2. CDN or hosting provider modifications
3. Analytics services that modify all page content
4. Improper content-type handling allowing HTML processing of XML files

## Solution Implemented
1. **Custom sitemap.xml template** with `layout: null` to prevent HTML layout processing
2. **Disabled jekyll-sitemap plugin** to avoid conflicts
3. **Added .htaccess rules** to ensure proper content-type and security headers
4. **Explicit XML escaping** of all content in the sitemap
5. **File filtering** to exclude binary files and scripts

## Prevention Measures
To prevent this issue in the future:

### 1. Always use `layout: null` for XML files
```yaml
---
layout: null
sitemap: false
permalink: /sitemap.xml
---
```

### 2. Serve XML with correct content type
```apache
<Files "sitemap.xml">
    Header set Content-Type "application/xml; charset=utf-8"
    Header set X-Content-Type-Options "nosniff"
</Files>
```

### 3. Use XML escaping for all dynamic content
```liquid
{{ variable | xml_escape }}
```

### 4. Set Content Security Policy for XML files
```apache
<FilesMatch "\.(xml)$">
    Header set Content-Security-Policy "default-src 'none'"
</FilesMatch>
```

### 5. Filter static files in sitemap
```liquid
{%- assign allowed_extensions = 'txt,pdf,xml' | split: ',' -%}
{%- for file in static_files -%}
  {%- assign file_ext = file.extname | remove: '.' -%}
  {%- if allowed_extensions contains file_ext -%}
    <!-- Include file in sitemap -->
  {%- endif -%}
{%- endfor -%}
```

## Monitoring & Testing
### Regular Checks
1. **Google Search Console**: Monitor for sitemap processing errors
2. **Direct testing**: Visit `https://kalkulator.com.ua/sitemap.xml` to check for script injection
3. **Build validation**: Run `grep -i script _site/sitemap.xml` after each build

### Automated Testing
Add this to your CI/CD pipeline:
```bash
# Build site
bundle exec jekyll build

# Check for script tags in sitemap
if grep -i script _site/sitemap.xml; then
  echo "❌ Script tags found in sitemap!"
  exit 1
else
  echo "✅ Sitemap is clean"
fi

# Validate XML structure
xmllint --noout _site/sitemap.xml && echo "✅ Valid XML"
```

## Files Modified
- `sitemap.xml` - Custom template with proper XML generation
- `_config.yml` - Disabled jekyll-sitemap plugin
- `.htaccess` - Added security headers for XML files

## Testing Results
```bash
$ grep -i script _site/sitemap.xml
# No output = no script tags ✅

$ wc -l _site/sitemap.xml
456 _site/sitemap.xml

$ grep -c "<url>" _site/sitemap.xml  
449  # URLs included in sitemap
```

## Why This Happened
The script injection likely occurred because:
1. The original sitemap was being processed as HTML content
2. Browser extensions were injecting scripts into all page content
3. No proper content-type headers were set for XML files
4. No Content Security Policy to prevent script execution

This fix ensures the sitemap is served as pure XML with proper security headers, preventing any script injection at the browser or server level.