'use client'

import { reviewTransaksiPHBI } from '@/app/actions/phbi'
import { useState } from 'react'

export default function ReviewAction({ 
  transaksiId, 
  kegiatanId, 
  currentStatus 
}: { 
  transaksiId: string, 
  kegiatanId: string, 
  currentStatus: string 
}) {
  const [loading, setLoading] = useState(false)
  const [showCatatan, setShowCatatan] = useState(false)
  const [catatan, setCatatan] = useState('')

  const handleReview = async (newStatus: string) => {
    if (newStatus === 'REVISION' && !catatan) {
      setShowCatatan(true)
      return
    }

    setLoading(true)
    try {
      await reviewTransaksiPHBI(transaksiId, newStatus, catatan, kegiatanId)
      setShowCatatan(false)
    } catch (err) {
      console.error(err)
      alert('Gagal mengupdate status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      {showCatatan ? (
        <div className="flex flex-col gap-2">
          <textarea 
            className="w-full text-xs p-2 border rounded" 
            placeholder="Catatan perbaikan..." 
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              onClick={() => handleReview('REVISION')} 
              disabled={loading || !catatan}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-50"
            >
              Simpan Revisi
            </button>
            <button 
              onClick={() => setShowCatatan(false)} 
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {currentStatus === 'SUBMITTED' && (
            <>
              <button onClick={() => handleReview('APPROVED')} disabled={loading} className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">Approve</button>
              <button onClick={() => handleReview('REVISION')} disabled={loading} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600">Revisi</button>
              <button onClick={() => handleReview('REJECTED')} disabled={loading} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Reject</button>
            </>
          )}
          {currentStatus === 'APPROVED' && (
            <button onClick={() => handleReview('PUBLISHED')} disabled={loading} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Publish ke Web</button>
          )}
          {currentStatus === 'PUBLISHED' && (
            <button onClick={() => handleReview('APPROVED')} disabled={loading} className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600">Unpublish</button>
          )}
        </div>
      )}
    </div>
  )
}
