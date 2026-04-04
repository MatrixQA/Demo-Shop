import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../state/products/ProductsContext.jsx'
import { useCart } from '../state/cart/CartContext.jsx'
import { useToast } from '../state/toast/ToastContext.jsx'

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`
}

export function ProductPage() {
  const { productId } = useParams()
  const { getById } = useProducts()
  const cart = useCart()
  const { pushToast } = useToast()

  const p = getById(productId)
  if (!p) {
    return (
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Not found</h1>
        <p className="muted">This product does not exist.</p>
        <div style={{ height: 12 }} />
        <Link className="btn" to="/catalog">
          Back to catalog
        </Link>
      </div>
    )
  }

  function add() {
    cart.add(p.id, 1)
    pushToast({ kind: 'ok', title: 'Added to cart' })
  }

  return (
    <div className="card" data-testid="product-details">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 6 }}>{p.name}</h1>
          <div className="muted" data-testid="product-category">
            Category: {p.category}
          </div>
        </div>
        <div className="pill" data-testid="product-price">
          {formatPrice(p.price)}
        </div>
      </div>

      <div style={{ height: 12 }} />
      <p className="muted" data-testid="product-description">
        {p.description}
      </p>

      <div style={{ height: 18 }} />

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btnPrimary" onClick={add} data-testid="product-add">
          Add to cart
        </button>
        <Link className="btn" to="/cart" data-testid="product-go-cart">
          Go to cart
        </Link>
        <Link className="btn" to="/catalog" data-testid="product-back">
          Back
        </Link>
      </div>
    </div>
  )
}

