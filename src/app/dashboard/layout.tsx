import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export const metadata = {
  title: 'Admin Dashboard - Musholla Darun Najah',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 md:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
