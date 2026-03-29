import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../state/cart/CartContext.jsx'
import { useProducts } from '../state/products/ProductsContext.jsx'
import { useToast } from '../state/toast/ToastContext.jsx'

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`
}

export function CheckoutPage() {
  const cart = useCart()
  const { products } = useProducts()
  const { pushToast } = useToast()
  const nav = useNavigate()

  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [error, setError] = useState('')

  const total = useMemo(() => {
    let sum = 0
    for (const [productId, qty] of cart.items.entries()) {
      const p = products.find((x) => x.id === productId)
      if (p) sum += p.price * qty
    }
    return sum
  }, [cart.items, products])

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!cart.count()) {
      setError('Your cart is empty.')
      return
    }

    if (!fullName || !address || !city || !postalCode || !cardNumber) {
      setError('All fields are required.')
      return
    }

    if (cardNumber.replace(/\s/g, '').length < 12) {
      setError('Card number looks too short.')
      return
    }

    cart.clear()
    pushToast({ kind: 'ok', title: 'Order placed', message: 'Thanks for your purchase.' })
    nav('/', { replace: true })
  }

  return (
    <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Checkout</h1>
      <p className="muted" data-testid="checkout-total">
        Total: {formatPrice(total)}
      </p>

      <div style={{ height: 12 }} />

      <form onSubmit={onSubmit} data-testid="checkout-form">
        <div className="row">
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              data-testid="checkout-fullName"
            />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              data-testid="checkout-city"
            />
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="row">
          <div className="field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              data-testid="checkout-address"
            />
          </div>
          <div className="field">
            <label htmlFor="postalCode">Postal code</label>
            <input
              id="postalCode"
              className="input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              data-testid="checkout-postalCode"
            />
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <label htmlFor="cardNumber">Card number</label>
          <input
            id="cardNumber"
            className="input"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1111 2222 3333 4444"
            data-testid="checkout-cardNumber"
          />
        </div>

        {error ? (
          <>
            <div style={{ height: 10 }} />
            <div className="error" role="alert" data-testid="checkout-error">
              {error}
            </div>
          </>
        ) : null}

        <div style={{ height: 16 }} />

        <button className="btn btnPrimary" type="submit" data-testid="checkout-submit">
          Place order
        </button>
      </form>
    </div>
  )
}

