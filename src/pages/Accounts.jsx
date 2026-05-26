import { ShieldCheck, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader, StatusBadge } from '../components/Ui'
import { roles, users as seedUsers } from '../data/mockDatabase'

const permissionRows = [
  { module: 'Bảng điều khiển', admin: true, training: true, teacher: true, student: true },
  { module: 'Quản lý tài khoản', admin: true, training: true, teacher: false, student: false },
  { module: 'Cấu hình Excel', admin: true, training: true, teacher: false, student: false },
  { module: 'Sửa điểm inline', admin: true, training: true, teacher: true, student: false },
  { module: 'Xem tài liệu nhạy cảm', admin: true, training: true, teacher: true, student: false },
  { module: 'Chat hỏi đáp', admin: true, training: true, teacher: true, student: true },
]

export function Accounts() {
  const [users, setUsers] = useState(seedUsers)
  const [roleFilter, setRoleFilter] = useState('all')
  const filteredUsers = useMemo(() => users.filter((user) => roleFilter === 'all' || user.role === roleFilter), [roleFilter, users])

  const toggleStatus = (userId) => {
    setUsers((items) =>
      items.map((user) => (user.id === userId ? { ...user, status: user.status === 'active' ? 'paused' : 'active' } : user)),
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="RBAC"
        title="Quản lý tài khoản"
        description="Vai trò, hồ sơ người dùng và ma trận quyền truy cập"
        actions={
          <button type="button" className="primary-button">
            <UserPlus size={16} />
            Thêm người dùng
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="text-lg font-bold text-ink">Danh sách tài khoản</h2>
            <select className="control" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="all">Tất cả vai trò</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.shortLabel}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const role = roles.find((item) => item.id === user.role)

                  return (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                            {user.avatar}
                          </span>
                          <span className="font-bold text-ink">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone="brand">{role.shortLabel}</StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={user.status === 'active' ? 'success' : 'warning'}>{user.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}</StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" className="secondary-button" onClick={() => toggleStatus(user.id)}>
                          {user.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <ShieldCheck size={18} className="text-brand-600" />
            <h2 className="text-lg font-bold text-ink">Ma trận phân quyền</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Module</th>
                  {roles.map((role) => (
                    <th key={role.id} className="px-3 py-3 text-center">{role.shortLabel}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionRows.map((row) => (
                  <tr key={row.module}>
                    <td className="px-4 py-3 font-semibold text-ink">{row.module}</td>
                    {roles.map((role) => (
                      <td key={role.id} className="px-3 py-3 text-center">
                        <StatusBadge tone={row[role.id] ? 'success' : 'danger'}>{row[role.id] ? 'Có' : 'Không'}</StatusBadge>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
