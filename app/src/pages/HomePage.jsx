import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>UI automation practice site</h1>
      <p className="muted">
        This app is intentionally designed for stable selectors and predictable
        data so you can practice Playwright.
      </p>

      <div style={{ height: 16 }} />

      <div className="row">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Start here</h2>
          <p className="muted">
            Visit the catalog, add items to cart, then try checkout.
          </p>
          <div style={{ height: 12 }} />
          <Link className="btn btnPrimary" to="/catalog" data-testid="home-cta">
            Go to Catalog
          </Link>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Test accounts</h2>
          <p className="muted" data-testid="home-accounts">
            user / user123 (role: user) • admin / admin123 (role: admin)
          </p>
        </div>
      </div>
    </div>
  )
}

