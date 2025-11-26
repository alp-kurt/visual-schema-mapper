interface PageHeaderProps {
  title: string
  subtitle?: string
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
      {subtitle ? <p className="text-sm text-blue-300">{subtitle}</p> : null}
    </header>
  )
}
