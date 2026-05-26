/* eslint-disable react-refresh/only-export-components */
import {
  Bell,
  BookOpen,
  CalendarDays,
  FileText,
  Grid2X2,
  HelpCircle,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  UserCog,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { to: '/', label: 'Bảng điều khiển', icon: Grid2X2, roles: ['admin', 'training', 'teacher', 'student'] },
  { to: '/schedule', label: 'Lịch trình', teacherLabel: 'Lịch dạy', studentLabel: 'Lịch học', icon: CalendarDays, roles: ['admin', 'training', 'teacher', 'student'] },
  { to: '/grades', label: 'Điểm số', icon: Star, roles: ['admin', 'training', 'teacher', 'student'] },
  { to: '/documents', label: 'Tài liệu & Trò chuyện', icon: FileText, roles: ['admin', 'training', 'teacher', 'student'] },
  { to: '/settings', label: 'Cấu hình', icon: Settings, roles: ['admin', 'training'] },
  { to: '/accounts', label: 'Quản lý tài khoản', icon: UserCog, roles: ['admin', 'training'] },
]

function getRoleAwareLabel(item, role) {
  if (role === 'teacher' && item.teacherLabel) {
    return item.teacherLabel
  }

  if (role === 'student' && item.studentLabel) {
    return item.studentLabel
  }

  return item.label
}

function pageTitle(pathname) {
  const match = menuItems.find((item) => item.to === pathname)
  return match?.label ?? 'Bảng điều khiển'
}

export function Layout() {
  const { role, roles, currentRole, currentUser, setRole } = useAuth()
  const location = useLocation()
  const allowedMenu = menuItems.filter((item) => item.roles.includes(role))

  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <div className="flex min-h-screen overflow-hidden rounded-lg border-2 border-brand-600 bg-surface">
        <aside className="hidden w-[262px] shrink-0 border-r border-slate-200 bg-slate-50 lg:flex lg:flex-col">
          <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-5">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-brand-600 text-sm font-black text-white">
              E
            </span>
            <div>
              <p className="text-sm font-bold text-brand-700">EduTrack Pro</p>
              <p className="text-[11px] font-medium text-slate-500">{currentRole.shortLabel}</p>
            </div>
          </div>

          <div className="px-4 py-5">
            <button type="button" className="primary-button w-full">
              <Plus size={15} />
              Phiên mới
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {allowedMenu.map((item) => {
              const Icon = item.icon
              const label = getRoleAwareLabel(item, role)

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex h-11 items-center gap-3 rounded px-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-white hover:text-brand-700'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <button type="button" className="flex h-10 w-full items-center gap-3 rounded px-3 text-sm font-medium text-slate-700 hover:bg-white">
              <HelpCircle size={17} />
              Trung tâm Trợ giúp
            </button>
            <button type="button" className="mt-1 flex h-10 w-full items-center gap-3 rounded px-3 text-sm font-medium text-slate-700 hover:bg-white">
              <LogOut size={17} />
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-600 text-sm font-black text-white">
                  E
                </span>
              </div>
              <div className="hidden items-center gap-2 text-sm font-bold text-ink sm:flex">
                <BookOpen size={18} className="text-brand-600" />
                <span className="truncate">{pageTitle(location.pathname)}</span>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 justify-center px-4">
              <label className="relative hidden w-full max-w-[360px] sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input className="control h-8 w-full pl-9" placeholder="Tìm kiếm khóa học, phòng, giáo viên" />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="icon-button hidden border-0 sm:inline-flex" aria-label="Thông báo">
                <Bell size={17} />
              </button>
              <button type="button" className="icon-button hidden border-0 sm:inline-flex" aria-label="Ứng dụng">
                <Sparkles size={17} />
              </button>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-2 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
                  {currentUser.avatar}
                </span>
                <ShieldCheck size={14} className="text-emerald-500" />
                <select
                  className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  aria-label="Chuyển vai trò"
                >
                  {roles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.shortLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-auto bg-surface">
            <div className="mx-auto w-full max-w-[1440px] p-4 lg:p-7">
              <Outlet />
            </div>
          </main>

          <nav className="grid grid-cols-4 gap-1 border-t border-slate-200 bg-white p-2 lg:hidden">
            {allowedMenu.slice(0, 4).map((item) => {
              const Icon = item.icon
              const label = getRoleAwareLabel(item, role)

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 rounded px-2 py-2 text-[11px] font-semibold ${
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500'
                    }`
                  }
                >
                  <Icon size={17} />
                  <span className="truncate">{label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export function getAllowedRoutes(role) {
  return menuItems.filter((item) => item.roles.includes(role)).map((item) => item.to)
}
