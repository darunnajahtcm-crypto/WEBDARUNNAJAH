import { createClient } from '@/utils/supabase/server'
import PengaturanForm from './PengaturanForm'

export default async function PengaturanPage() {
  const supabase = await createClient()

  // Ambil pengaturan web jika ada (mengambil baris pertama)
  const { data: pengaturan } = await supabase
    .from('pengaturan_web')
    .select('*')
    .limit(1)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Website</h2>
        <p className="text-gray-600 text-sm">Ubah profil dasar Musholla yang tampil di halaman publik.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl">
        <PengaturanForm pengaturan={pengaturan} />
      </div>
    </div>
  )
}
