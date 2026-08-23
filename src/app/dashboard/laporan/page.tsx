import { createClient } from '@/utils/supabase/server'

export default async function LaporanPage() {
  const supabase = await createClient()

  // Ambil 50 log terakhir
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Audit & Log Sistem</h2>
        <p className="text-gray-600 text-sm">Jejak rekaman aktivitas pengguna di dalam sistem (Riwayat Tindakan).</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Waktu (WIB)</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Modul</th>
                <th className="px-6 py-4">Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada rekaman aktivitas yang tercatat.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {log.profiles?.full_name || 'Sistem'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                        {log.module_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {log.action}
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
