import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen" style={{ background: '#F3F2EE' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  )
}
