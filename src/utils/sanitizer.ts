import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  });
}

/**
 * Sanitize plain text content
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove any HTML tags and decode HTML entities
  return validator.escape(input.trim());
}

/**
 * Validate and sanitize user name
 */
export function validateAndSanitizeName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Name is required' };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Name cannot be empty' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, sanitized: '', error: 'Name must be less than 50 characters' };
  }
  
  // Allow only letters, numbers, spaces, and common punctuation
  if (!validator.matches(trimmed, /^[a-zA-Z0-9\u4e00-\u9fff\s\-_.,!?()]+$/)) {
    return { isValid: false, sanitized: '', error: 'Name contains invalid characters' };
  }
  
  const sanitized = sanitizeText(trimmed);
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize message/comment content
 */
export function validateAndSanitizeMessage(message: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!message || typeof message !== 'string') {
    return { isValid: false, sanitized: '', error: 'Message is required' };
  }

  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, sanitized: '', error: 'Message must be less than 1000 characters' };
  }
  
  // Check for suspicious patterns that might indicate XSS attempts
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:text\/html/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, sanitized: '', error: 'Message contains potentially harmful content' };
    }
  }
  
  const sanitized = sanitizeText(trimmed);
  return { isValid: true, sanitized };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return validator.isEmail(email);
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const trimmed = url.trim();
  
  // Block dangerous protocols
  if (trimmed.match(/^(javascript|data|vbscript):/i)) {
    return '';
  }
  
  // Only allow http, https, and relative URLs
  if (!trimmed.match(/^(https?:\/\/|\/)/i)) {
    return '';
  }
  
  return validator.escape(trimmed);
}