import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App.tsx'
import { ErrorFallback } from '@/components/layout/ErrorFallback'
import { Analytics } from '@/services/analytics'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => Analytics.track('APP_CRASH', { error })}>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)
