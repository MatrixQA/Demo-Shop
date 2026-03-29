import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../state/products/ProductsContext.jsx'
import { useCart } from '../state/cart/CartContext.jsx'
import { useToast } from '../state/toast/ToastContext.jsx'

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`
}

export function CatalogPage() {
  const { products, categories } = useProducts()
  const cart = useCart()
  const { pushToast } = useToast()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('name-asc')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products

    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
    if (category !== 'All') list = list.filter((p) => p.category === category)

    const by = {
      'name-asc': (a, b) => a.name.localeCompare(b.name),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    }[sort]

    return [...list].sort(by)
  }, [products, query, category, sort])

  function addToCart(productId) {
    cart.add(productId, 1)
    pushToast({ kind: 'ok', title: 'Added to cart' })
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Catalog</h1>
        <p className="muted">Search, filter, sort, and add items to your cart.</p>

        <div style={{ height: 14 }} />

        <div className="row">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input
              id="q"
              className="input"
              placeholder="Type a product name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="catalog-search"
            />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-testid="catalog-category"
            >
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="row">
          <div className="field">
            <label htmlFor="sort">Sort</label>
            <select
              id="sort"
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-testid="catalog-sort"
            >
              <option value="name-asc">Name (A→Z)</option>
              <option value="price-asc">Price (Low→High)</option>
              <option value="price-desc">Price (High→Low)</option>
            </select>
          </div>
          <div />
        </div>
      </div>

      <div className="grid" data-testid="catalog-grid">
        {visible.map((p) => (
          <div className="card" key={p.id} data-testid={`product-card-${p.id}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div className="muted">{p.category}</div>
              </div>
              <div className="pill" data-testid={`product-price-${p.id}`}>
                {formatPrice(p.price)}
              </div>
            </div>

            <div style={{ height: 10 }} />
            <div className="muted">{p.description}</div>

            <div style={{ height: 14 }} />

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link className="btn" to={`/product/${p.id}`} data-testid={`view-${p.id}`}>
                View
              </Link>
              <button
                className="btn btnPrimary"
                onClick={() => addToCart(p.id)}
                data-testid={`add-to-cart-${p.id}`}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {!visible.length ? (
        <div className="card" data-testid="catalog-empty">
          No products match your filters.
        </div>
      ) : null}
    </div>
  )
}

