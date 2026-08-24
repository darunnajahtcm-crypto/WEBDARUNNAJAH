import { getAllUsersAdmin, deleteUserAction } from '@/app/actions/users'
import UserForm from './UserForm'
import UserList from './UserList'

export default async function UsersPage() {
  const users = await getAllUsersAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
        <p className="text-gray-600 text-sm">Tambahkan akun untuk Admin DKM atau Petugas Lapangan. (Login menggunakan Username)</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Form Tambah Pengguna */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Buat Akun Baru</h3>
            <UserForm />
          </div>
        </div>

        {/* Daftar Pengguna */}
        <div className="xl:col-span-2">
          <UserList initialUsers={users} />
        </div>

      </div>
    </div>
  )
}
