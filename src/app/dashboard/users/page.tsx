import { createClient } from '@/utils/supabase/server'
import UserForm from './UserForm'

export default async function UsersPage() {
  const supabase = await createClient()

  // Ambil daftar pengguna dari tabel profiles
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
        <p className="text-gray-600 text-sm">Tambahkan akun untuk Admin DKM atau Petugas Lapangan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Tambah Pengguna */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Buat Akun Baru</h3>
            <UserForm />
          </div>
        </div>

        {/* Daftar Pengguna */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-emerald-50 text-emerald-800 uppercase font-semibold text-xs border-b border-emerald-100">
                  <tr>
                    <th className="px-4 py-3">Nama Lengkap</th>
                    <th className="px-4 py-3">Peran (Role)</th>
                    <th className="px-4 py-3">Tgl Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!users || users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        Belum ada pengguna terdaftar.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {u.full_name || 'Tanpa Nama'}
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
                        <td className="px-4 py-3 text-xs">
                          {new Date(u.created_at).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
