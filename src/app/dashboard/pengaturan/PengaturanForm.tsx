'use client'

import { updatePengaturan } from '@/app/actions/pengaturan'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PengaturanForm({ pengaturan }: { pengaturan: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    if (pengaturan?.id) {
      formData.append('id', pengaturan.id)
    }

    try {
      const res = await updatePengaturan(formData)
      if (res.error) {
        setMessage('Gagal: ' + res.error)
      } else {
        setMessage('Sukses! Pengaturan berhasil disimpan.')
        router.refresh()
      }
    } catch (err: any) {
      setMessage('Gagal menyimpan pengaturan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.includes('Sukses') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {message}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Musholla</label>
        <input 
          type="text" 
          name="nama_musholla" 
          defaultValue={pengaturan?.nama_musholla || 'Musholla Darun Najah'} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
        <textarea 
          name="alamat" 
          rows={3} 
          defaultValue={pengaturan?.alamat || 'Tenjo City Metropolis'} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Kontak (HP/WA)</label>
          <input 
            type="text" 
            name="kontak_hp" 
            defaultValue={pengaturan?.kontak_hp || ''} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            defaultValue={pengaturan?.email || ''} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}
