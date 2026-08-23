'use client'

import { deletePengumuman, deleteGaleri } from '@/app/actions/content'
import { useState } from 'react'

export default function DeleteButton({ id, type }: { id: string, type: 'pengumuman' | 'galeri' }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return
    
    setLoading(true)
    try {
      if (type === 'pengumuman') {
        await deletePengumuman(id)
      } else {
        await deleteGaleri(id)
      }
    } catch (e) {
      alert('Gagal menghapus data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded hover:bg-red-200 transition disabled:opacity-50"
    >
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}
