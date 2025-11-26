interface LoadingSpinnerProps {
  label?: string
}

export const LoadingSpinner = ({ label = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-brand-blue"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue/30 border-t-brand-orange shadow-2xl shadow-brand-orange/10"
        aria-hidden="true"
      />
      <span className="text-sm font-semibold text-gray-100">{label}</span>
    </div>
  )
}
