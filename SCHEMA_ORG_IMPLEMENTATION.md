# Schema.org Structured Data Implementation

## Overview

This repository now implements comprehensive Schema.org structured data to improve SEO, search engine understanding, and rich snippet display. The implementation leverages Jekyll's templating system for consistent and maintainable structured data across all pages.

## Implementation Details

### 1. Enhanced `_includes/seo.html`

The core structured data is automatically generated for all pages through the enhanced `_includes/seo.html` file:

#### Organization Schema
- **Type**: `Organization`
- **Purpose**: Establishes brand identity and company information
- **Data**: Site title, description, URL, logo, founding date, area served

#### Website Schema  
- **Type**: `WebSite`
- **Purpose**: Defines the website and enables search functionality
- **Data**: Site name, description, URL, language, search action

#### WebApplication Schema (Calculator Pages)
- **Type**: `WebApplication` 
- **Purpose**: Describes calculator functionality and features
- **Conditional**: Only appears on pages using `calculator` layout
- **Dynamic Features**: Category-specific feature lists based on page categories

#### FAQ Schema
- **Type**: `FAQPage`
- **Purpose**: Structures FAQ content for rich snippets
- **Conditional**: Only appears when `page.faq` exists and has content
- **Auto-generated**: Creates Question/Answer pairs from page frontmatter

### 2. Category-Based ApplicationCategory

The structured data adapts to page categories:

- `financial` → `FinanceApplication`
- `health` → `HealthApplication` 
- `school` → `EducationalApplication`
- `construction` → `BusinessApplication`
- `salary-taxes` → `FinanceApplication`
- `business` → `BusinessApplication`
- Default → `CalculatorApplication`

### 3. Custom Structured Data

Individual calculator pages can include custom structured data via frontmatter:

```yaml
seo:
  structured_data: |
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Calculator Name",
      "description": "Calculator description",
      ...
    }
```

## Examples Implemented

### Homepage (`index.md`)
- **Schema**: `WebPage` with `CollectionPage` mainEntity
- **Purpose**: Describes the calculator collection

### Tax Calculator (`calculators/fop-taxes.md`)
- **Schema**: `WebApplication` with `FinanceApplication` category
- **Features**: Tax calculations, current rates, compliance
- **Target Audience**: Entrepreneurs (FOP)

### Health Calculator (`calculators/calorie-needs.md`)
- **Schema**: `WebApplication` with `HealthApplication` category
- **Features**: BMR/TDEE calculations, nutrition recommendations
- **Target Audience**: Health-conscious individuals

### Educational Calculator (`calculators/quadratic.md`)
- **Schema**: `WebApplication` with `EducationalApplication` category
- **Features**: Mathematical solutions, step-by-step guidance
- **Target Audience**: Students, teachers
- **Educational Properties**: Level and resource type

### Business Calculator (`calculators/business-plan-restaurant.md`)
- **Schema**: `WebApplication` with `BusinessApplication` category
- **Features**: ROI analysis, startup costs, profitability
- **Target Audience**: HoReCa entrepreneurs

## Benefits Achieved

### SEO Improvements
- **Rich Snippets**: Enhanced search result display
- **Knowledge Graph**: Better brand recognition
- **Featured Snippets**: FAQ content eligible for featured snippets
- **Voice Search**: Structured Q&A improves voice search results

### Technical Benefits
- **Search Engine Understanding**: Clear content classification
- **Crawling Efficiency**: Structured data helps search engines understand site hierarchy
- **International SEO**: Language and region specification
- **Mobile SEO**: Application category helps mobile search

### User Experience
- **Trust Signals**: Professional structured data builds credibility
- **Quick Access**: Rich snippets provide immediate information
- **Navigation**: Search functionality clearly defined

## Validation

All structured data has been validated for:
- ✅ Valid JSON-LD syntax
- ✅ Required Schema.org properties
- ✅ Proper context and types
- ✅ Category-specific adaptations
- ✅ FAQ schema generation

## Maintenance

The implementation is designed for minimal maintenance:
- **Automatic Generation**: Most structured data is template-based
- **Consistent Updates**: Changes to `_includes/seo.html` affect all pages
- **Custom Override**: Individual pages can still provide custom structured data
- **Backward Compatible**: Existing custom structured data is preserved

## Testing

Use these tools to validate the implementation:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Structured Data Testing Tool](https://developers.google.com/structured-data/testing-tool/)

## Next Steps

Consider expanding with:
- **Review Schema**: Customer reviews and ratings
- **Event Schema**: For calculators related to events
- **Product Schema**: For business plan calculators
- **Course Schema**: For educational calculator series