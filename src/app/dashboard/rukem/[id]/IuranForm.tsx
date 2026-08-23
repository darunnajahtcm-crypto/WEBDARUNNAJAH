'use client'

import { bayarIuranBulanan } from '@/app/actions/rukem'
import { useState } from 'react'

export default function IuranForm({ anggotaId }: { anggotaId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    formData.append('anggota_id', anggotaId)
    
    try {
      const result = await bayarIuranBulanan(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses pembayaran.')
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  // Generate opsi bulan (misal dari awal tahun ini sampai akhir tahun ini)
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const months = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(year, i, 1)
    const valueStr = `${year}-${String(i + 1).padStart(2, '0')}-01`
    const labelStr = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    months.push({ value: valueStr, label: labelStr })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-xs">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded text-xs font-semibold">Pembayaran berhasil dicatat!</div>}
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Pilih Bulan Tagihan</label>
        <select name="bulan_tahun" required className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary">
          <option value="">-- Pilih Bulan --</option>
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Metode Pembayaran</label>
        <select name="metode" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary">
          <option value="CASH">Cash / Tunai</option>
          <option value="TRANSFER">Transfer Bank</option>
        </select>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-primary text-white py-2 rounded font-semibold text-sm hover:bg-emerald-800 disabled:opacity-70 transition"
        >
          {loading ? 'Memproses...' : 'Simpan Pembayaran (Rp 10.000)'}
        </button>
      </div>
    </form>
  )
}
