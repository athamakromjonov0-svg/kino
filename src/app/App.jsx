import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProviders } from './providers';
import AppRoutes from './router';
import i18n from '../i18n';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * App shell — providers + router + global toast system.
 * All routes are lazy-loaded (see router.jsx) for optimal bundle size.
 */
export function App() {
  // Keep <html lang> in sync with the active i18n language
  useEffect(() => {
    const syncLang = () => {
      document.documentElement.lang = i18n.language || 'uz';
    };
    syncLang();
    i18n.on('languageChanged', syncLang);
    return () => i18n.off('languageChanged', syncLang);
  }, []);

  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#171A22',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              },
              success: {
                iconTheme: { primary: '#22C55E', secondary: '#171A22' },
              },
              error: {
                iconTheme: { primary: '#8B5CF6', secondary: '#171A22' },
              },
            }}
          />

          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
