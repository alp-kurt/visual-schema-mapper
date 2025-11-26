import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useUser } from '@/hooks/useUser'
import { UserProfile } from './UserProfile'

vi.mock('@/hooks/useUser')

const mockedUseUser = vi.mocked(useUser)

const renderUserProfile = () => render(<UserProfile />)

describe('UserProfile', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the loading skeleton while fetching the user', () => {
    mockedUseUser.mockReturnValue({ user: undefined, isLoading: true, isError: false })

    renderUserProfile()

    const skeleton = screen.getByTestId('user-skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-busy', 'true')
  })

  it('displays the user name when the profile loads successfully', () => {
    mockedUseUser.mockReturnValue({
      user: {
        firstName: 'Alice',
        lastName: 'Smith',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
      isLoading: false,
      isError: false,
    })

    renderUserProfile()

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
  })

  it('falls back to the guest view when the hook reports an error', () => {
    mockedUseUser.mockReturnValue({ user: undefined, isLoading: false, isError: true })

    renderUserProfile()

    expect(screen.getByText('Guest User')).toBeInTheDocument()
  })
})
