import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/offers', label: 'Offers', end: false },
  { to: '/claimed', label: 'Claimed', end: false },
  { to: '/settings', label: 'Settings', end: false },
]

function navLinkClasses(isActive: boolean) {
  return [
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-tornado-600 text-white'
      : 'text-slate-600 hover:bg-tornado-50 hover:text-tornado-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-tornado-300',
  ].join(' ')
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl">🌪️</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
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
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
