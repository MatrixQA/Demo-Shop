import { useMemo, useState } from 'react'
import { useProducts } from '../state/products/ProductsContext.jsx'
import { useToast } from '../state/toast/ToastContext.jsx'

function emptyDraft() {
  return {
    name: '',
    category: 'Books',
    price: '9.99',
    description: '',
  }
}

export function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } =
    useProducts()
  const { pushToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('add') // add | edit
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(emptyDraft)

  const title = useMemo(() => (mode === 'add' ? 'Add product' : 'Edit product'), [mode])

  function openAdd() {
    setMode('add')
    setEditingId(null)
    setDraft(emptyDraft())
    setIsOpen(true)
  }

  function openEdit(p) {
    setMode('edit')
    setEditingId(p.id)
    setDraft({
      name: p.name,
      category: p.category,
      price: String(p.price),
      description: p.description,
    })
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function onSave(e) {
    e.preventDefault()
    if (!draft.name.trim()) {
      pushToast({ kind: 'err', title: 'Validation', message: 'Name is required.' })
      return
    }
    if (!draft.price || Number(draft.price) <= 0) {
      pushToast({ kind: 'err', title: 'Validation', message: 'Price must be > 0.' })
      return
    }

    if (mode === 'add') {
      addProduct(draft)
      pushToast({ kind: 'ok', title: 'Product added' })
      close()
      return
    }

    updateProduct(editingId, draft)
    pushToast({ kind: 'ok', title: 'Product updated' })
    close()
  }

  function onDelete(id) {
    deleteProduct(id)
    pushToast({ kind: 'ok', title: 'Product deleted' })
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 6 }}>Admin: Products</h1>
          <p className="muted">Simple CRUD via an in-memory list.</p>
        </div>
        <button className="btn btnPrimary" onClick={openAdd} data-testid="admin-add">
          Add product
        </button>
      </div>

      <div style={{ height: 12 }} />

      <table className="table" data-testid="admin-products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th style={{ width: 140 }}>Category</th>
            <th style={{ width: 120 }}>Price</th>
            <th style={{ width: 220 }} />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} data-testid={`admin-product-row-${p.id}`}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    className="btn"
                    onClick={() => openEdit(p)}
                    data-testid={`admin-edit-${p.id}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btnDanger"
                    onClick={() => onDelete(p.id)}
                    data-testid={`admin-delete-${p.id}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOpen ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" data-testid="admin-modal">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{title}</h2>
              <button className="btn" onClick={close} data-testid="admin-cancel">
                Close
              </button>
            </div>

            <div style={{ height: 12 }} />

            <form onSubmit={onSave} data-testid="admin-product-form">
              <div className="row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    className="input"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    data-testid="admin-name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="select"
                    value={draft.category}
                    onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                    data-testid="admin-category"
                  >
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
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    className="input"
                    value={draft.price}
                    onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                    data-testid="admin-price"
                  />
                </div>
                <div />
              </div>

              <div style={{ height: 12 }} />

              <div className="field">
                <label htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  className="textarea"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  data-testid="admin-description"
                />
              </div>

              <div style={{ height: 16 }} />

              <button className="btn btnPrimary" type="submit" data-testid="admin-save">
                Save
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

