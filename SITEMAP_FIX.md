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

### 5. Monitor sitemap in Google Search Console
- Check for parsing errors regularly
- Validate sitemap format using tools like XML validators
- Test sitemap URLs directly in browsers to check for script injection

## Files Modified
- `sitemap.xml` - Custom template with proper XML generation
- `_config.yml` - Disabled jekyll-sitemap plugin
- `.htaccess` - Added security headers for XML files

## Testing
To test the sitemap:
1. Build the site: `bundle exec jekyll build`
2. Check generated sitemap: `cat _site/sitemap.xml | head -20`
3. Verify no script tags: `grep -i script _site/sitemap.xml`
4. Validate XML format using online XML validators