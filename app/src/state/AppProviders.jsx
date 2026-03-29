import { AuthProvider } from './auth/AuthContext.jsx'
import { CartProvider } from './cart/CartContext.jsx'
import { ProductsProvider } from './products/ProductsContext.jsx'
import { ToastProvider } from './toast/ToastContext.jsx'

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

