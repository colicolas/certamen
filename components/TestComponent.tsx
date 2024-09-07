// components/TestComponent.tsx
'use client';
import { useEffect } from 'react';

const TestComponent = () => {
  useEffect(() => {
    console.log('TestComponent useEffect running');
  }, []);

  return <div>TestComponent is here!</div>;
};

export default TestComponent;
