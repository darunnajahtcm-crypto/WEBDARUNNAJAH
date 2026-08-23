import { createClient } from '@/utils/supabase/server'

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
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Musholla</label>
            <input 
              type="text" 
              name="nama_musholla" 
              defaultValue={pengaturan?.nama_musholla || 'Musholla Darun Najah'} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50" 
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea 
              name="alamat" 
              rows={3} 
              defaultValue={pengaturan?.alamat || 'Tenjo City Metropolis'} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
              disabled
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Kontak (HP/WA)</label>
              <input 
                type="text" 
                name="kontak_hp" 
                defaultValue={pengaturan?.kontak_hp || ''} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                disabled 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                defaultValue={pengaturan?.email || ''} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50" 
                disabled
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <strong>Informasi:</strong> Halaman ini saat ini dalam mode *Read-Only* (hanya baca). Fitur pengubahan (*Update*) profil sedang dikembangkan dan akan tersedia pada pembaruan sistem berikutnya.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
