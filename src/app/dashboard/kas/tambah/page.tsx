'use client'

import { addKasTransaction } from '@/app/actions/kas'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function TambahKasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jenis, setJenis] = useState('PEMASUKAN')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await addKasTransaction(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard/kas')
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/kas" className="text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Tambah Transaksi Kas</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
              <input type="date" name="tanggal" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
              <select 
                name="jenis" 
                value={jenis} 
                onChange={(e) => setJenis(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="PEMASUKAN">Pemasukan (+)</option>
                <option value="PENGELUARAN">Pengeluaran (-)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="kategori" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="Operasional">Operasional</option>
                <option value="Pembangunan">Pembangunan</option>
                <option value="Anak Yatim">Anak Yatim</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode</label>
              <select name="metode" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="CASH">Cash / Tunai</option>
                <option value="TRANSFER">Transfer Bank</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input type="number" name="jumlah" min="0" required placeholder="Contoh: 500000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pihak Terkait <span className="text-gray-400 font-normal">(Donatur / Toko / Penerima)</span>
            </label>
            <input type="text" name="pihak_terkait" required placeholder="Hamba Allah / Toko Bangunan Berkah..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Singkat</label>
            <input type="text" name="keterangan" required placeholder="Sedekah Jumat / Beli semen 5 sak..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link href="/dashboard/kas" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Batal
            </Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-emerald-800 transition disabled:opacity-70">
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
