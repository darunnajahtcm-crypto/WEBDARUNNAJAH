import { getKegiatanPHBI } from '@/app/actions/phbi'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function PHBIPage() {
  const kegiatan = await getKegiatanPHBI()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null }
  
  const isAdmin = profile?.role === 'MASTER_ADMIN' || profile?.role === 'ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kegiatan PHBI</h2>
          <p className="text-gray-600 text-sm">Kelola kegiatan Peringatan Hari Besar Islam dan keuangannya.</p>
        </div>
        <Link 
          href="/dashboard/phbi/tambah-kegiatan" 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
        >
          + Buat Kegiatan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kegiatan.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 border border-gray-100">
            Belum ada kegiatan PHBI yang dibuat.
          </div>
        ) : (
          kegiatan.map((k) => (
            <Link href={`/dashboard/phbi/${k.id}`} key={k.id}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    k.status_kegiatan === 'AKTIF' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {k.status_kegiatan}
                  </span>
                  <span className="text-gray-400 text-sm">{new Date(k.tanggal).toLocaleDateString('id-ID')}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition">{k.nama}</h3>
                <div className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {k.lokasi}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                  <div className="text-gray-500 mb-1">Target Anggaran:</div>
                  <div className="font-semibold text-gray-800">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(k.target_anggaran || 0)}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
