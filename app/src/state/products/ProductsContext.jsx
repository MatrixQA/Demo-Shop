/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { categories, initialProducts } from '../../data/products.js'

const ProductsContext = createContext(null)

function makeId() {
  return `p-${Math.floor(100 + Math.random() * 900)}`
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)

  const value = useMemo(() => {
    function addProduct(draft) {
      const id = makeId()
      const next = { ...draft, id, price: Number(draft.price) }
      setProducts((p) => [next, ...p])
      return next
    }

    function updateProduct(productId, patch) {
      setProducts((p) =>
        p.map((prod) =>
          prod.id === productId
            ? { ...prod, ...patch, price: Number(patch.price ?? prod.price) }
            : prod,
        ),
      )
    }

    function deleteProduct(productId) {
      setProducts((p) => p.filter((prod) => prod.id !== productId))
    }

    function getById(productId) {
      return products.find((p) => p.id === productId) || null
    }

    return {
      categories,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getById,
    }
  }, [products])

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

