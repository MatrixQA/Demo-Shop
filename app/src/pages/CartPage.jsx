import { Link } from 'react-router-dom'
import { useCart } from '../state/cart/CartContext.jsx'
import { useProducts } from '../state/products/ProductsContext.jsx'

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`
}

export function CartPage() {
  const cart = useCart()
  const { products } = useProducts()

  const entries = Array.from(cart.items.entries())
    .map(([productId, qty]) => {
      const p = products.find((x) => x.id === productId)
      return p ? { product: p, qty } : null
    })
    .filter(Boolean)

  const total = entries.reduce((sum, e) => sum + e.product.price * e.qty, 0)

  if (!entries.length) {
    return (
      <div className="card" data-testid="cart-empty">
        <h1 style={{ marginTop: 0 }}>Cart</h1>
        <p className="muted">Your cart is empty.</p>
        <div style={{ height: 12 }} />
        <Link className="btn btnPrimary" to="/catalog">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Cart</h1>

      <table className="table" data-testid="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style={{ width: 120 }}>Price</th>
            <th style={{ width: 120 }}>Qty</th>
            <th style={{ width: 140 }}>Line</th>
            <th style={{ width: 140 }} />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.product.id} data-testid={`cart-row-${e.product.id}`}>
              <td>{e.product.name}</td>
              <td>{formatPrice(e.product.price)}</td>
              <td>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={e.qty}
                  onChange={(ev) => cart.setQty(e.product.id, ev.target.value)}
                  data-testid={`cart-qty-${e.product.id}`}
                />
              </td>
              <td data-testid={`cart-line-${e.product.id}`}>
                {formatPrice(e.product.price * e.qty)}
              </td>
              <td>
                <button
                  className="btn btnDanger"
                  onClick={() => cart.remove(e.product.id)}
                  data-testid={`cart-remove-${e.product.id}`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ height: 12 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Link className="btn" to="/catalog">
          Continue shopping
        </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="pill" data-testid="cart-total">
            Total: {formatPrice(total)}
          </div>
          <Link className="btn btnPrimary" to="/checkout" data-testid="cart-checkout">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

