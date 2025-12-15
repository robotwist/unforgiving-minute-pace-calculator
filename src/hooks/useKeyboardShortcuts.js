import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * Usage:
 *   useKeyboardShortcuts({
 *     'Meta+Enter': handleSubmit, // Cmd+Enter on Mac
 *     'Ctrl+Enter': handleSubmit, // Ctrl+Enter on Windows/Linux
 *     'Escape': handleClose
 *   });
 */
export const useKeyboardShortcuts = (shortcuts, deps = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Build key string
      const keyParts = [];
      if (event.metaKey) keyParts.push('Meta');
      if (event.ctrlKey) keyParts.push('Ctrl');
      if (event.altKey) keyParts.push('Alt');
      if (event.shiftKey) keyParts.push('Shift');
      keyParts.push(event.key);
      
      const keyString = keyParts.join('+');
      
      // Check if we have a handler for this shortcut
      if (shortcuts[keyString]) {
        // Don't trigger if user is typing in an input
        const target = event.target;
        const isInput = target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' || 
                       target.isContentEditable;
        
        // Allow shortcuts in inputs only for Escape
        if (!isInput || event.key === 'Escape') {
          event.preventDefault();
          shortcuts[keyString](event);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(shortcuts), ...deps]);
};
