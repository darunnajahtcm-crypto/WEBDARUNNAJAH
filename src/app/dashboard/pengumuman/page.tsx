import { getPengumuman } from '@/app/actions/content'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

export default async function PengumumanPage() {
  const pengumuman = await getPengumuman()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengumuman</h2>
          <p className="text-gray-600 text-sm">Kelola informasi dan pengumuman untuk ditampilkan di website.</p>
        </div>
        <Link 
          href="/dashboard/pengumuman/tambah" 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
        >
          + Buat Pengumuman
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Judul Pengumuman</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pengumuman.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data pengumuman.
                  </td>
                </tr>
              ) : (
                pengumuman.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(p.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 text-base">{p.judul}</div>
                      <div className="text-gray-500 mt-1 line-clamp-2">{p.konten}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <DeleteButton id={p.id} type="pengumuman" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
