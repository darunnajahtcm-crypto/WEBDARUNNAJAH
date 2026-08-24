'use client'

import { useState } from 'react'
import { deleteUserAction, updateUserAction } from '@/app/actions/users'

export default function UserList({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Edit Form State
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus akun ${name}?`)) return
    
    setLoading(true)
    const res = await deleteUserAction(id)
    if (res.error) {
      alert('Gagal menghapus: ' + res.error)
    } else {
      setUsers(users.filter(u => u.id !== id))
    }
    setLoading(false)
  }

  const startEdit = (user: any) => {
    setEditingId(user.id)
    setEditName(user.full_name)
    setEditRole(user.role)
    setEditPassword('') // Password selalu kosong awalnya (karena terenkripsi)
  }

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData()
    formData.append('id', id)
    formData.append('full_name', editName)
    formData.append('role', editRole)
    if (editPassword) formData.append('password', editPassword)

    const res = await updateUserAction(formData)
    if (res.error) {
      alert('Gagal update: ' + res.error)
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, full_name: editName, role: editRole } : u))
      setEditingId(null)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-emerald-50 text-emerald-800 uppercase font-semibold text-xs border-b border-emerald-100">
            <tr>
              <th className="px-4 py-3">Nama Lengkap</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Peran (Role)</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                editingId === u.id ? (
                  <tr key={u.id} className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-4">
                      <form onSubmit={(e) => handleUpdate(e, u.id)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <label className="block text-xs mb-1">Nama Lengkap</label>
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full px-2 py-1 border rounded text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs mb-1 text-red-500">Reset Password (opsional)</label>
                          <div className="relative">
                            <input type={showEditPassword ? "text" : "password"} value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Kosongkan jika tidak diubah" minLength={6} className="w-full px-2 py-1 border rounded text-sm pr-8" />
                            <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-1 top-1 text-xs text-gray-500 font-bold">👀</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Peran</label>
                          <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                            <option value="PETUGAS">PETUGAS</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MASTER_ADMIN">MASTER ADMIN</option>
                          </select>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">Batal</button>
                          <button type="submit" disabled={loading} className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-emerald-800">Simpan</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {u.full_name || 'Tanpa Nama'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-emerald-700 bg-emerald-50 rounded inline-block mt-2 ml-4">
                      {u.username}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                        u.role === 'MASTER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => startEdit(u)} className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(u.id, u.full_name)} disabled={u.role === 'MASTER_ADMIN' || loading} className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 px-2 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed">Hapus</button>
                    </td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
