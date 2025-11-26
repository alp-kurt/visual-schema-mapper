import { useQuery } from '@tanstack/react-query'

const USER_ENDPOINT = 'https://randomuser.me/api/?seed=tradebyte'
const USER_QUERY_KEY = ['user-profile']

export type UserProfile = {
  firstName: string
  lastName: string
  avatarUrl: string
}

type RandomUserResponse = {
  results: Array<{
    name: {
      first: string
      last: string
    }
    picture: {
      large: string
      medium: string
      thumbnail: string
    }
  }>
}

/**
 * Fetches a deterministic user profile from the Random User API using a seed.
 * The stable seed simulates an authenticated session by always returning the same persona.
 */
const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(USER_ENDPOINT)

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const data: RandomUserResponse = await response.json()
  const [firstResult] = data.results ?? []

  if (!firstResult) {
    throw new Error('User not found')
  }

  const { name, picture } = firstResult

  return {
    firstName: name.first,
    lastName: name.last,
    avatarUrl: picture.large ?? picture.medium ?? picture.thumbnail,
  }
}

/**
 * Provides a cached user profile for the duration of the app session.
 * The infinite cache and stale times prevent unnecessary re-fetches and UI flicker.
 */
export const useUser = () => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUserProfile,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return {
    user,
    isLoading,
    isError,
  }
}
