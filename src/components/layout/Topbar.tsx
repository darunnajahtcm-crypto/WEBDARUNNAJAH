'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Topbar() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserEmail(session.user.email ?? null)
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUserName(profile.full_name)
          setUserRole(profile.role)
        }
      } else {
        // Redirect to login if no session on dashboard
        router.push('/login')
      }
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (placeholder) */}
        <button className="md:hidden text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Dashboard Manajemen</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <div className="text-sm font-semibold text-gray-800">
            {userName || userEmail || 'Memuat...'}
          </div>
          <div className="text-xs text-primary font-bold uppercase tracking-wider">
            {userRole ? `[ ${userRole.replace('_', ' ')} ]` : '...'}
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition ml-2"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
