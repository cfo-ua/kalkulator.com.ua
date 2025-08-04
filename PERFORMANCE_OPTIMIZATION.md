# Performance Optimization Guide

This document outlines the performance optimizations implemented for kalkulator.com.ua.

## Optimizations Implemented

### 1. JavaScript Optimization (34% reduction)
- **Minification**: All JavaScript files are minified using Terser
- **Size reduction**: From 5.1MB to 3.4MB total JavaScript
- **Automated process**: Run `npm run optimize:js` to minify all calculator scripts
- **Lazy loading**: Calculator-specific scripts are loaded only when needed

### 2. CSS Optimization (22% reduction)
- **Minification**: CSS minified from 81KB to 63KB
- **Clean-CSS**: Used for optimal compression
- **Automated process**: Run `npm run optimize:css`

### 3. Caching Strategy
- **Service Worker**: Implements caching for static assets
- **HTTP Headers**: Added comprehensive caching headers in .htaccess
- **Cache Duration**: 1 year for static assets, 1 hour for HTML
- **Compression**: Gzip compression enabled for all text-based resources

### 4. Resource Loading Optimization
- **DNS Prefetch**: Added for external analytics domains
- **Asset Preloading**: Critical CSS preloaded for faster rendering
- **Script Deferring**: Non-critical JavaScript deferred
- **Resource Hints**: Optimized loading order

### 5. HTTP Headers Enhancement
- **Compression**: Gzip/deflate for all text resources
- **Security**: Enhanced security headers maintained
- **Performance**: Optimized cache-control headers
- **Browser Hints**: Added immutable flag for static assets

## Build Commands

```bash
# Install dependencies
npm install

# Run all optimizations
npm run optimize

# Individual optimizations
npm run optimize:css    # Minify CSS
npm run optimize:js     # Minify all calculator JS files
npm run optimize:main   # Minify main.js

# Jekyll commands
npm run build          # Build Jekyll site
npm run serve          # Serve development site
```

## File Structure

```
assets/
├── css/
│   ├── style.css      # Original CSS
│   └── style.min.css  # Minified CSS (22% smaller)
├── js/
│   ├── main.js        # Original main JS
│   ├── main.min.js    # Minified main JS
│   └── min/           # Minified calculator scripts (34% smaller)
└── img/
    └── logo.svg       # Optimized SVG logo

scripts/
└── optimize-js.js     # JavaScript optimization script

sw.js                  # Service worker for caching
```

## Performance Gains

1. **JavaScript**: 1.7MB saved (34% reduction)
2. **CSS**: 18KB saved (22% reduction)  
3. **Caching**: Static assets cached for 1 year
4. **Compression**: All text resources gzipped
5. **Loading**: Deferred non-critical resources

## Browser Support

- **Service Worker**: Modern browsers (IE not supported)
- **Preload**: Modern browsers with fallbacks
- **Compression**: All browsers with server support
- **Minified assets**: All browsers

## Monitoring

Monitor performance using:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Chrome DevTools Performance tab

## Future Improvements

1. **Image Optimization**: Implement WebP format with fallbacks
2. **Critical CSS**: Extract above-the-fold CSS
3. **Bundle Splitting**: Split JavaScript by calculator categories
4. **CDN**: Consider CDN for static assets
5. **HTTP/2**: Leverage HTTP/2 server push when available

## Maintenance

- Run `npm run optimize` after any CSS/JS changes
- Monitor service worker cache versions
- Update cache headers as needed
- Test performance regularly

The optimizations maintain full backward compatibility while significantly improving loading times and user experience.