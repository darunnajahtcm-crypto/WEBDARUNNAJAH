'use client'

import { createAdminOrPetugas } from '@/app/actions/users'
import { useState } from 'react'

export default function UserForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createAdminOrPetugas(formData)
      if (res.error) {
        setMessage('Gagal: ' + res.error)
      } else {
        setMessage('Sukses! Akun berhasil dibuat.')
        e.currentTarget.reset()
      }
    } catch (err: any) {
      setMessage('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded text-sm ${message.includes('Sukses') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input 
          type="text" 
          name="full_name" 
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Email (Untuk Login)</label>
        <input 
          type="email" 
          name="email" 
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
        <input 
          type="password" 
          name="password" 
          required
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Peran Akses (Role)</label>
        <select 
          name="role" 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="PETUGAS">PETUGAS (Input Data)</option>
          <option value="ADMIN">ADMIN (Verifikasi & Edit)</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-emerald-800 transition disabled:opacity-50 text-sm mt-2"
      >
        {loading ? 'Membuat...' : 'Buat Akun'}
      </button>
    </form>
  )
}
