'use client'

import { addKegiatanPHBI } from '@/app/actions/phbi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function TambahKegiatanPHBIPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await addKegiatanPHBI(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard/phbi')
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
        <Link href="/dashboard/phbi" className="text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Buat Kegiatan PHBI Baru</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
            <input type="text" name="nama" required placeholder="Contoh: Peringatan Maulid Nabi 1448 H" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pelaksanaan</label>
              <input type="date" name="tanggal" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Anggaran (Rp)</label>
              <input type="number" name="target_anggaran" min="0" placeholder="Contoh: 5000000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input type="text" name="lokasi" defaultValue="Musholla Darun Najah" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea name="deskripsi" rows={3} placeholder="Tujuan atau rangkuman acara..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link href="/dashboard/phbi" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Batal
            </Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-emerald-800 transition disabled:opacity-70">
              {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
