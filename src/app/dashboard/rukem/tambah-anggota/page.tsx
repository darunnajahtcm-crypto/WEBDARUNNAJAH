'use client'

import { addAnggotaRukem } from '@/app/actions/rukem'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function TambahAnggotaRukemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await addAnggotaRukem(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/dashboard/rukem/${result.id}`)
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
        <Link href="/dashboard/rukem" className="text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Pendaftaran Anggota Rukem Baru</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
          <span className="font-bold">Info:</span> Menyimpan data ini akan otomatis mencatat tagihan <strong>Uang Pendaftaran sebesar Rp 100.000</strong> ke dalam sistem.
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Daftar</label>
              <input type="date" name="tanggal_daftar" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Keluarga</label>
              <input type="text" name="nama_kk" required placeholder="Contoh: Bpk. Ahmad" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Anggota Keluarga</label>
              <input type="number" name="jumlah_keluarga" min="1" defaultValue="1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blok Rumah</label>
              <input type="text" name="blok" required placeholder="A / B / C" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rumah</label>
              <input type="text" name="no_rumah" required placeholder="01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Handphone / WhatsApp</label>
            <input type="text" name="no_hp" placeholder="081234567890" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link href="/dashboard/rukem" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Batal
            </Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-emerald-800 transition disabled:opacity-70">
              {loading ? 'Menyimpan...' : 'Daftarkan Anggota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
