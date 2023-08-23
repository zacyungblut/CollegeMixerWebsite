import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useContext } from 'react';
import { ProcessedEmailsContext } from '../contexts/ProcessedEmailsContext';

export function useProcessedEmails() {
    const context = useContext(ProcessedEmailsContext);
    
    if (context === undefined) {
      throw new Error('useProcessedEmails must be used within a ProcessedEmailsProvider');
    }
    
    return context;
  }

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
