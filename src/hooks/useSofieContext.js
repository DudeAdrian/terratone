import { useContext } from 'react';
import { SofieContext } from '../context/SofieContext';

export const useSofieContext = () => {
  const context = useContext(SofieContext);
  if (!context) {
    throw new Error('useSofieContext must be used within a SofieProvider');
  }
  return context;
};
