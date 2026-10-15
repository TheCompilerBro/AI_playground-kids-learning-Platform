import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  variant?: 'outline' | 'subtle';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  size = 'md',
  fullWidth = false,
  icon,
  variant = 'outline',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-base rounded-2xl',
    lg: 'px-7 py-3.5 text-lg font-semibold rounded-full',
  }[size];

  const variantClasses = variant === 'outline'
    ? 'bg-white text-[#17233C] border border-[#E8E8F0] hover:border-[#6558E8] hover:bg-[#DDF3FF]/20'
    : 'bg-[#DDF3FF] text-[#17233C] hover:bg-[#cbeaff] border border-transparent';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer shadow-xs
        active:scale-[0.98]
        focus-visible:outline-3 focus-visible:outline-[#6558E8] focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${sizeClasses}
        ${variantClasses}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
