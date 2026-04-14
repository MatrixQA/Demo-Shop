import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../state/auth/AuthContext.jsx'
import { useCart } from '../state/cart/CartContext.jsx'
import { ToastViewport } from './ToastViewport.jsx'

function linkClass({ isActive }) {
  return `link${isActive ? ' linkActive' : ''}`
}

export function Layout() {
  const { user, logout } = useAuth()
  const cart = useCart()

  return (
    <div className="appShell">
      <header className="topNav" data-testid="top-nav">
        <div className="topNavInner">
          <NavLink to="/" className="brand" data-testid="nav-home">
            DemoShop
          </NavLink>

          <nav className="navLinks" aria-label="Primary">
            <NavLink to="/catalog" className={linkClass}>
              Catalog
            </NavLink>
            <NavLink to="/cart" className={linkClass} data-testid="nav-cart">
              Cart <span className="pill">({cart.count()})</span>
            </NavLink>
            <NavLink to="/checkout" className={linkClass}>
              Checkout
            </NavLink>
            <NavLink to="/admin/products" className={linkClass}>
              Admin
            </NavLink>
          </nav>

          <div className="spacer" />

          {user ? (
            <>
              <span className="pill" data-testid="auth-user">
                {user.username} ({user.role})
              </span>
              <button
                className="btn"
                onClick={logout}
                data-testid="auth-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `btn btnPrimary${isActive ? ' linkActive' : ''}`
                }
                data-testid="auth-login-link"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `btn${isActive ? ' linkActive' : ''}`}
                data-testid="auth-register-link"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  )
}

