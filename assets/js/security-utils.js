// Security Utility Functions for kalkulator.com.ua
// Secure alternatives to dangerous DOM manipulation patterns

/**
 * Safe DOM manipulation utilities to prevent XSS attacks
 */
class SecurityUtils {
    
    /**
     * Safely set text content (prevents XSS)
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to set
     */
    static safeSetText(element, text) {
        if (!element || typeof text !== 'string') return;
        element.textContent = text;
    }
    
    /**
     * Safely set HTML content with sanitization
     * Requires DOMPurify library to be loaded
     * @param {HTMLElement} element - Target element  
     * @param {string} html - HTML content to set
     */
    static safeSetHTML(element, html) {
        if (!element || typeof html !== 'string') return;
        
        if (typeof DOMPurify !== 'undefined') {
            // Use DOMPurify if available
            element.innerHTML = DOMPurify.sanitize(html);
        } else {
            // Fallback: escape HTML and set as text
            console.warn('DOMPurify not loaded, falling back to text content');
            element.textContent = html;
        }
    }
    
    /**
     * Create element safely with text content
     * @param {string} tagName - HTML tag name
     * @param {string} textContent - Text content
     * @param {Object} attributes - Key-value pairs for attributes
     * @returns {HTMLElement} Created element
     */
    static createElement(tagName, textContent = '', attributes = {}) {
        const element = document.createElement(tagName);
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        // Set attributes safely
        Object.entries(attributes).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                element.setAttribute(key, value);
            }
        });
        
        return element;
    }
    
    /**
     * Validate and sanitize numeric input
     * @param {string|number} input - Input value
     * @param {Object} options - Validation options
     * @returns {number|null} Validated number or null if invalid
     */
    static validateNumber(input, options = {}) {
        const {
            min = -Infinity,
            max = Infinity,
            integer = false,
            positive = false
        } = options;
        
        const num = parseFloat(input);
        
        // Check if valid number
        if (isNaN(num) || !isFinite(num)) {
            return null;
        }
        
        // Check range
        if (num < min || num > max) {
            return null;
        }
        
        // Check if should be positive
        if (positive && num <= 0) {
            return null;
        }
        
        // Check if should be integer
        if (integer && !Number.isInteger(num)) {
            return null;
        }
        
        return num;
    }
    
    /**
     * Sanitize string input for safe display
     * @param {string} input - Input string
     * @param {Object} options - Sanitization options
     * @returns {string} Sanitized string
     */
    static sanitizeString(input, options = {}) {
        if (typeof input !== 'string') {
            return '';
        }
        
        const {
            maxLength = 1000,
            allowHTML = false,
            trimWhitespace = true
        } = options;
        
        let sanitized = input;
        
        // Trim whitespace if requested
        if (trimWhitespace) {
            sanitized = sanitized.trim();
        }
        
        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        // Remove HTML if not allowed
        if (!allowHTML) {
            sanitized = sanitized.replace(/<[^>]*>/g, '');
        }
        
        return sanitized;
    }
    
    /**
     * Generate cryptographically secure random number
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (exclusive) 
     * @returns {number} Secure random number
     */
    static secureRandom(min = 0, max = 1) {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            // Use cryptographically secure randomness
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            const random = array[0] / (0xffffffff + 1);
            return min + (random * (max - min));
        } else {
            // Fallback to Math.random (less secure)
            console.warn('Crypto API not available, using Math.random()');
            return min + (Math.random() * (max - min));
        }
    }
    
    /**
     * Generate secure random integer
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (inclusive)
     * @returns {number} Secure random integer
     */
    static secureRandomInt(min, max) {
        return Math.floor(this.secureRandom(min, max + 1));
    }
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email format
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Rate limiting helper
     * @param {string} key - Unique key for rate limiting
     * @param {number} maxRequests - Maximum requests allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {boolean} True if request is allowed
     */
    static rateLimit(key, maxRequests = 10, windowMs = 60000) {
        const now = Date.now();
        const storageKey = `rateLimit_${key}`;
        
        try {
            const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
            const requests = data.requests || [];
            
            // Remove expired requests
            const validRequests = requests.filter(time => now - time < windowMs);
            
            // Check if limit exceeded
            if (validRequests.length >= maxRequests) {
                return false;
            }
            
            // Add current request
            validRequests.push(now);
            
            // Save updated data
            localStorage.setItem(storageKey, JSON.stringify({
                requests: validRequests
            }));
            
            return true;
        } catch (error) {
            console.error('Rate limiting error:', error);
            return true; // Allow request if storage fails
        }
    }
    
    /**
     * Safe JSON parse with error handling
     * @param {string} jsonString - JSON string to parse
     * @param {*} defaultValue - Default value if parsing fails
     * @returns {*} Parsed object or default value
     */
    static safeJSONParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.warn('JSON parse failed:', error);
            return defaultValue;
        }
    }
    
    /**
     * Escape HTML for safe insertion
     * @param {string} text - Text to escape
     * @returns {string} HTML-escaped text
     */
    static escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Check if URL is safe for external requests
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL is considered safe
     */
    static isSafeURL(url) {
        try {
            const urlObj = new URL(url);
            
            // Allow only HTTPS for external URLs
            if (urlObj.protocol !== 'https:' && urlObj.hostname !== 'localhost') {
                return false;
            }
            
            // Block known malicious patterns
            const maliciousPatterns = [
                'javascript:',
                'data:',
                'vbscript:',
                'file:'
            ];
            
            return !maliciousPatterns.some(pattern => 
                url.toLowerCase().includes(pattern)
            );
        } catch (error) {
            return false;
        }
    }
}

// Export for use in calculator files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
} else if (typeof window !== 'undefined') {
    window.SecurityUtils = SecurityUtils;
}

/**
 * Example usage in calculator files:
 * 
 * // Instead of:
 * // result.innerHTML = userInput; // DANGEROUS!
 * 
 * // Use:
 * SecurityUtils.safeSetText(result, userInput);
 * 
 * // Or for HTML content:
 * SecurityUtils.safeSetHTML(result, htmlContent);
 * 
 * // For random numbers:
 * const randomNum = SecurityUtils.secureRandomInt(1, 100);
 * 
 * // For input validation:
 * const validatedNum = SecurityUtils.validateNumber(userInput, {
 *     min: 0,
 *     max: 1000,
 *     positive: true
 * });
 */