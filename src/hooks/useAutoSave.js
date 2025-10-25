import { useEffect, useRef } from 'react';
import { apiService } from '../services/api';

export const useAutoSave = (code, sessionId, questionId, language = 'javascript') => {
  const saveTimeoutRef = useRef(null);
  const lastSavedCodeRef = useRef(code);

  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only save if code has actually changed
    if (code !== lastSavedCodeRef.current && code.trim() !== '') {
      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await apiService.autoSaveCode({
            sessionId,
            questionId,
            code,
            language,
            timestamp: new Date().toISOString(),
          });
          
          lastSavedCodeRef.current = code;
          console.log('Code auto-saved successfully');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 20000); // Auto-save every 20 seconds
    }

    // Cleanup timeout on unmount or code change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [code, sessionId, questionId, language]);

  // Manual save function
  const manualSave = async () => {
    if (code.trim() !== '' && code !== lastSavedCodeRef.current) {
      try {
        await apiService.autoSaveCode({
          sessionId,
          questionId,
          code,
          language,
          timestamp: new Date().toISOString(),
        });
        
        lastSavedCodeRef.current = code;
        return true;
      } catch (error) {
        console.error('Manual save failed:', error);
        return false;
      }
    }
    return true;
  };

  return { manualSave };
};
