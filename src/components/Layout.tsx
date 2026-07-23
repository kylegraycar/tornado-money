import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/offers', label: 'Offers', end: false },
  { to: '/claimed', label: 'Claimed', end: false },
  { to: '/settings', label: 'Settings', end: false },
]

function navLinkClasses(isActive: boolean) {
  return [
    'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-tornado-100 text-tornado-800 dark:bg-tornado-900/50 dark:text-tornado-200'
      : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100',
  ].join(' ')
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-950/90">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl">🌪️</span>
            <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
              Tornado Money
            </span>
          </NavLink>
          <nav className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navLinkClasses(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
