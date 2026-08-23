import { getGaleri } from '@/app/actions/content'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from '@/components/DeleteButton'

export default async function GaleriPage() {
  const galeri = await getGaleri()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h2>
          <p className="text-gray-600 text-sm">Kelola dokumentasi foto kegiatan Musholla.</p>
        </div>
        <Link 
          href="/dashboard/galeri/tambah" 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
        >
          + Tambah Foto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galeri.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 border border-gray-100">
            Belum ada foto di galeri.
          </div>
        ) : (
          galeri.map((g) => (
            <div key={g.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative h-48 w-full bg-gray-200">
                {g.image_url ? (
                  <img src={g.image_url} alt={g.judul} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold shadow ${
                    g.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {g.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{new Date(g.tanggal).toLocaleDateString('id-ID')}</div>
                <h3 className="font-bold text-gray-800">{g.judul}</h3>
                {g.keterangan && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{g.keterangan}</p>}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <DeleteButton id={g.id} type="galeri" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
