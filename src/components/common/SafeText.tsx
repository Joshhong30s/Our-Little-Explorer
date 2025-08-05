import React from 'react';

interface SafeTextProps {
  children: string;
  className?: string;
  allowLineBreaks?: boolean;
}

/**
 * Component that safely renders text content to prevent XSS
 * Text is already sanitized at the API level, but this provides additional protection
 */
export const SafeText: React.FC<SafeTextProps> = ({ 
  children, 
  className, 
  allowLineBreaks = false 
}) => {
  if (!children || typeof children !== 'string') {
    return null;
  }

  // For text that should preserve line breaks (like messages)
  if (allowLineBreaks) {
    const lines = children.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < children.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
    
    return (
      <span className={className}>
        {lines}
      </span>
    );
  }

  // For single-line text (like names, titles)
  return (
    <span className={className}>
      {children}
    </span>
  );
};

export default SafeText;