import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Button = ({ 
  children, 
  to, 
  onClick, 
  variant = 'primary', 
  className = '', 
  showArrow = true,
  type = 'button' 
}) => {
  const baseClass = variant === 'primary' 
    ? 'btn btn-primary' 
    : variant === 'secondary-dark' 
    ? 'btn btn-secondary-dark' 
    : 'btn btn-secondary';

  const content = (
    <>
      <span>{children}</span>
      {showArrow && <ArrowRight className="btn-arrow" size={16} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClass} ${className}`}>
      {content}
    </button>
  );
};
