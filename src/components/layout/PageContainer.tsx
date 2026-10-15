import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  size = 'default',
}) => {
  const maxW = {
    narrow: 'max-w-4xl',
    default: 'max-w-[1720px]',
    wide: 'max-w-[1800px]',
  }[size];

  return (
    <main className={`mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 w-full ${maxW} ${className}`}>
      {children}
    </main>
  );
};
