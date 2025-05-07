
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`font-poppins font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-primary">Catalo</span>
      <span className="text-action">Go</span>
    </div>
  );
};

export default Logo;
