import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useUser } from './useUser'

const mockApiResponse = {
  results: [
    {
      name: { first: 'Ada', last: 'Lovelace' },
      picture: {
        large: 'https://example.com/avatar-large.jpg',
        medium: 'https://example.com/avatar-medium.jpg',
        thumbnail: 'https://example.com/avatar-thumb.jpg',
      },
    },
  ],
}

// Each test gets its own QueryClient instance with retries disabled so the hook
// resolves deterministically without background re-fetch attempts.
const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function QueryProvider({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const mockFetchUser = () =>
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => mockApiResponse,
  } as Response)

const renderUseUser = () => renderHook(() => useUser(), { wrapper: createQueryClientWrapper() })

describe('useUser', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the parsed user profile when the request succeeds', async () => {
    mockFetchUser()

    const { result } = renderUseUser()

    await waitFor(() => {
      expect(result.current.user).toEqual({
        firstName: 'Ada',
        lastName: 'Lovelace',
        avatarUrl: 'https://example.com/avatar-large.jpg',
      })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  it('is loading on the initial render', () => {
    mockFetchUser()

    const { result } = renderUseUser()

    expect(result.current.isLoading).toBe(true)
  })
})
