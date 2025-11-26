import { useUser } from '@/hooks/useUser'

const GuestIcon = () => (
  <svg
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-5 w-5"
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M5 20c0-3.31 3.134-6 7-6s7 2.69 7 6" />
  </svg>
)

const LoadingSkeleton = () => (
  <div className="flex items-center gap-3" data-testid="user-skeleton" aria-busy="true">
    <div className="h-10 w-10 animate-pulse rounded-full bg-brand-blue/40" />
    <div className="hidden h-3 w-20 animate-pulse rounded bg-brand-blue/40 sm:block" />
  </div>
)

/** Displays the current user's identity in the header with graceful fallbacks. */
export const UserProfile = () => {
  const { user, isLoading, isError } = useUser()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !user) {
    return (
      <div className="flex items-center gap-3 text-sm font-medium text-gray-100">
        <span className="hidden text-xs text-blue-200 sm:block">Guest User</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/30 text-brand-blue">
          <GuestIcon />
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 text-sm font-medium text-gray-100">
      <span className="hidden text-xs text-blue-200 sm:block">{`${user.firstName} ${user.lastName}`}</span>
      <img
        src={user.avatarUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="h-10 w-10 rounded-full border border-brand-blue/40 object-cover shadow-sm"
        loading="lazy"
      />
    </div>
  )
}
