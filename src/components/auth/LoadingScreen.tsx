
import React from 'react';
import Logo from '@/components/Logo';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Logo size="lg" />
        <div className="mt-6 flex space-x-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary delay-75"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
