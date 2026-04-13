/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'demoShop.cart.v1'

function loadCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Map()
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return new Map()
    return new Map(arr)
  } catch {
    return new Map()
  }
}

function saveCart(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(items.entries())))
  } catch {
    // ignore quota / private mode
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart())

  useEffect(() => {
    saveCart(items)
  }, [items])

  const value = useMemo(() => {
    function add(productId, qty = 1) {
      setItems((prev) => {
        const next = new Map(prev)
        next.set(productId, (next.get(productId) || 0) + qty)
        return next
      })
    }

    function setQty(productId, qty) {
      const q = Number(qty)
      setItems((prev) => {
        const next = new Map(prev)
        if (!Number.isFinite(q) || q <= 0) next.delete(productId)
        else next.set(productId, q)
        return next
      })
    }

    function remove(productId) {
      setItems((prev) => {
        const next = new Map(prev)
        next.delete(productId)
        return next
      })
    }

    function clear() {
      setItems(new Map())
    }

    function count() {
      let total = 0
      for (const qty of items.values()) total += qty
      return total
    }

    return { items, add, setQty, remove, clear, count }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

