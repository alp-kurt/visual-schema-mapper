import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'

import { UserProfile } from '@/components/layout/UserProfile'

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col">
      <Toaster position="top-right" toastOptions={{ duration: 2400 }} />
      <header className="border-b border-brand-blue/30 bg-dark-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="text-xl font-bold tracking-tight text-gray-100">TB-Mapper</div>
          <UserProfile />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">{children}</main>

      <footer className="border-t border-brand-blue/30 bg-dark-card">
        <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-blue-200 md:px-6">
          © 2024 TB-Mapper · v{__APP_VERSION__}
        </div>
      </footer>
    </div>
  )
}
