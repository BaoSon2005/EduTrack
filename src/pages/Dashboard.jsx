import { Activity, BookMarked, GraduationCap, UsersRound } from 'lucide-react'
import { classes, recentActivities, students, users } from '../data/mockDatabase'
import { MetricCard, PageHeader } from '../components/Ui'
import { useAuth } from '../context/AuthContext'

const trend = [
  { label: 'T2', value: 48 },
  { label: 'T3', value: 73 },
  { label: 'T4', value: 55 },
  { label: 'T5', value: 96 },
  { label: 'T6', value: 78 },
  { label: 'T7', value: 108 },
  { label: 'CN', value: 90 },
]

function activityToneClass(tone) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    brand: 'bg-brand-50 text-brand-600',
  }

  return tones[tone] ?? tones.brand
}

export function Dashboard() {
  const { currentRole, currentUser, role } = useAuth()
  const activeTeachers = users.filter((user) => user.role === 'teacher' && user.status === 'active').length
  const openClasses = classes.filter((item) => item.status === 'open').length
  const personalClasses = role === 'teacher' ? currentUser.assignedClassIds.length : currentUser.classIds?.length

  return (
    <div>
      <PageHeader
        title="Bảng điều khiển"
        description={`${currentRole.label} · học kỳ vận hành Mùa thu 2024`}
        actions={
          <button type="button" className="primary-button">
            <Activity size={16} />
            Tạo phiên mới
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Tổng số Học viên" value={students.length.toLocaleString('en-US')} delta="+12%" icon={<GraduationCap size={20} />} />
        <MetricCard label="Giảng viên Hoạt động" value={activeTeachers} delta="Ổn định" icon={<UsersRound size={20} />} />
        <MetricCard label={role === 'student' ? 'Lớp đang học' : role === 'teacher' ? 'Lớp được phân công' : 'Lớp học Đang mở'} value={personalClasses ?? openClasses} delta="+5%" icon={<BookMarked size={20} />} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.8fr)]">
        <section className="panel p-5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Xu hướng Đăng ký</h2>
            <select className="control h-8">
              <option>30 ngày qua</option>
              <option>90 ngày qua</option>
            </select>
          </div>
          <div className="flex h-56 items-end gap-5 border-b border-slate-200 px-2">
            {trend.map((item, index) => (
              <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className={`w-full max-w-[72px] rounded-t ${index < 2 ? 'bg-indigo-200' : index === 2 ? 'bg-indigo-300' : 'bg-brand-500/70'}`}
                  style={{ height: `${item.value}%` }}
                  aria-label={`${item.label}: ${item.value}`}
                />
                <span className="pb-1 text-xs font-medium text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Hoạt động Gần đây</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activityToneClass(activity.tone)}`}>
                  <Activity size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-5 text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-5 text-sm font-semibold text-brand-700">
            Xem tất cả
          </button>
        </section>
      </div>
    </div>
  )
}
