import { FallbackProps } from 'react-error-boundary'

import { Card } from '@/components/ui/Card'


export const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg px-4 text-gray-100">
      <Card className="w-full max-w-md text-center shadow-lg">
        <div className="space-y-4 p-6">
          <p className="text-2xl font-semibold">Something went wrong</p>
          <p className="text-sm text-brand-blue">An unexpected error occurred. Try again to continue mapping.</p>
          <button onClick={resetErrorBoundary} className="w-full justify-center">
            Try Again
          </button>
        </div>
      </Card>
    </div>
  )
}
