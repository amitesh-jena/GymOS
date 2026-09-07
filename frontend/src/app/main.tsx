import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/index.css';

async function enableMocking() {
  if (
    import.meta.env.VITE_USE_MOCK_API === 'true' ||
    import.meta.env.MODE === 'development' ||
    import.meta.env.MODE === 'test'
  ) {
    const { worker } = await import('@/mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
