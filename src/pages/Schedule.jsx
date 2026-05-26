import { Download, FileInput, Filter, MapPin, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Modal, PageHeader, StatusBadge } from '../components/Ui'
import { useAuth } from '../context/AuthContext'
import { classes, courses, majors, scheduleEvents, users, weekDays } from '../data/mockDatabase'
import { detectScheduleConflicts, downloadTextFile, filterEventsForRole, getEventDetails } from '../utils/businessRules'

const eventPalette = {
  blue: 'border-blue-500 bg-blue-50 text-blue-950',
  emerald: 'border-emerald-500 bg-emerald-50 text-emerald-950',
  rose: 'border-rose-500 bg-rose-50 text-rose-950',
}

const importedPreviewRows = [
  { classCode: 'CS101-A', subject: 'Nhập môn Khoa học Máy tính', teacher: 'TS. Aris Thorne', room: 'ONLINE', shift: 'Tiết 4', day: 'T4' },
  { classCode: 'AI301-B', subject: 'Faculty Seminar: AI Ethics', teacher: 'TS. Aris Thorne', room: 'A302', shift: 'Tiết 2', day: 'T4' },
  { classCode: 'CS204-B', subject: 'Hệ thống Cơ sở dữ liệu', teacher: 'PGS. David Kim', room: 'A201', shift: 'Tiết 3', day: 'T6' },
]

function eventPosition(event, visibleEvents) {
  const sameSlot = visibleEvents.filter((item) => item.dayIndex === event.dayIndex && item.shiftId === event.shiftId)
  const index = sameSlot.findIndex((item) => item.id === event.id)

  return {
    count: sameSlot.length,
    index: Math.max(index, 0),
  }
}

function buildScheduleExport(events) {
  const lines = ['Lop,Mon hoc,Giang vien,Phong,Tiet,Ngay']

  events.forEach((event) => {
    const { classRecord, course, instructor, room, shift } = getEventDetails(event)
    const day = weekDays.find((item) => item.index === event.dayIndex)
    lines.push([classRecord.code, course.name, instructor.name, room.code, shift.name, day.code].join(','))
  })

  return lines.join('\n')
}

export function Schedule() {
  const { role, currentUser } = useAuth()
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [courseFilter, setCourseFilter] = useState('all')
  const [majorFilter, setMajorFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [teacherFilter, setTeacherFilter] = useState('all')

  const allConflicts = useMemo(() => detectScheduleConflicts(scheduleEvents), [])
  const visibleEvents = useMemo(() => {
    return filterEventsForRole(scheduleEvents, role, currentUser).filter((event) => {
      const classRecord = classes.find((item) => item.id === event.classId)
      const matchesCourse = courseFilter === 'all' || event.subjectId === courseFilter
      const matchesMajor = majorFilter === 'all' || classRecord.majorId === majorFilter
      const matchesClass = classFilter === 'all' || event.classId === classFilter
      const matchesTeacher = teacherFilter === 'all' || event.instructorId === teacherFilter

      return matchesCourse && matchesMajor && matchesClass && matchesTeacher
    })
  }, [classFilter, courseFilter, currentUser, majorFilter, role, teacherFilter])

  const handleExport = (type) => {
    const content = buildScheduleExport(visibleEvents)
    const filename = type === 'excel' ? 'edutrack-lich-hoc.csv' : 'edutrack-lich-hoc.doc'
    const mimeType = type === 'excel' ? 'text/csv;charset=utf-8' : 'application/msword;charset=utf-8'
    downloadTextFile(filename, content, mimeType)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Lịch huấn luyện"
        title="23 - 29 Tháng 10, 2023"
        description="Lưới tuần với kiểm tra trùng giảng viên, phòng học và tiết học"
        actions={
          <>
            <button type="button" className="secondary-button" onClick={() => setIsImportOpen(true)}>
              <FileInput size={16} />
              Import lịch từ bảng Word
            </button>
            <button type="button" className="secondary-button" onClick={() => handleExport('excel')}>
              <Download size={16} />
              Xuất Excel
            </button>
            <button type="button" className="primary-button" onClick={() => handleExport('word')}>
              <Download size={16} />
              Xuất Word
            </button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-500">
          <Filter size={15} />
          Bộ lọc
        </span>
        <select className="control min-w-36" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
          <option value="all">Khóa</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code}
            </option>
          ))}
        </select>
        <select className="control min-w-36" value={majorFilter} onChange={(event) => setMajorFilter(event.target.value)}>
          <option value="all">Ngành</option>
          {majors.map((major) => (
            <option key={major.id} value={major.id}>
              {major.code}
            </option>
          ))}
        </select>
        <select className="control min-w-36" value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
          <option value="all">Lớp</option>
          {classes.map((classRecord) => (
            <option key={classRecord.id} value={classRecord.id}>
              {classRecord.code}
            </option>
          ))}
        </select>
        <select className="control min-w-36" value={teacherFilter} onChange={(event) => setTeacherFilter(event.target.value)}>
          <option value="all">Giáo viên</option>
          {users.filter((user) => user.role === 'teacher').map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="relative min-w-[1080px] bg-white"
            style={{
              display: 'grid',
              gridTemplateColumns: '70px repeat(6, minmax(150px, 1fr))',
              gridTemplateRows: '44px repeat(20, 36px)',
            }}
          >
            <div className="sticky left-0 top-0 z-20 border-b border-r border-slate-200 bg-slate-50" />
            {weekDays.map((day) => (
              <div
                key={day.index}
                className={`border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-center ${day.code === 'T4' ? 'text-brand-700' : 'text-slate-600'}`}
                style={{ gridColumn: day.index + 1, gridRow: 1 }}
              >
                <p className="text-[11px] font-semibold">{day.code}</p>
                <p className="text-sm font-bold">{day.dateLabel}</p>
              </div>
            ))}

            {Array.from({ length: 10 }).map((_, index) => {
              const hour = `${String(index + 8).padStart(2, '0')}:00`
              const row = index * 2 + 2

              return (
                <div
                  key={hour}
                  className="sticky left-0 z-10 border-r border-slate-200 bg-white px-2 pt-1 text-right text-[11px] font-medium text-slate-500"
                  style={{ gridColumn: 1, gridRow: `${row} / span 2` }}
                >
                  {hour}
                </div>
              )
            })}

            {weekDays.flatMap((day) =>
              Array.from({ length: 20 }).map((_, rowIndex) => (
                <div
                  key={`${day.index}-${rowIndex}`}
                  className="border-b border-r border-slate-100"
                  style={{ gridColumn: day.index + 1, gridRow: rowIndex + 2 }}
                />
              )),
            )}

            {visibleEvents.map((event) => {
              const { classRecord, course, instructor, room, shift } = getEventDetails(event)
              const conflict = allConflicts.has(event.id)
              const position = eventPosition(event, visibleEvents)
              const width = position.count > 1 ? `calc(${100 / position.count}% - 6px)` : 'calc(100% - 8px)'
              const marginLeft = position.count > 1 ? `calc(${position.index * (100 / position.count)}% + 4px)` : '4px'

              return (
                <div
                  key={event.id}
                  className={`group relative m-1 overflow-visible rounded border-l-4 p-2 text-left shadow-sm ${eventPalette[event.color]} ${conflict ? 'border-2 border-red-500 ring-2 ring-red-100' : ''}`}
                  style={{
                    gridColumn: event.dayIndex + 1,
                    gridRow: `${shift.rowStart + 1} / span ${shift.rowSpan}`,
                    width,
                    marginLeft,
                    alignSelf: 'stretch',
                  }}
                >
                  <p className="truncate text-sm font-bold">{course.name}</p>
                  <p className="mt-1 text-[11px] font-semibold">{shift.start} - {shift.end}</p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11px]">
                    <MapPin size={12} />
                    {room.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11px]">
                    <Users size={12} />
                    {classRecord.code} · {instructor.name}
                  </p>
                  {conflict ? (
                    <span className="pointer-events-none absolute left-2 top-full z-30 mt-1 hidden w-56 rounded border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900 shadow-lg group-hover:block">
                      Trùng lịch giảng viên/phòng học!
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {isImportOpen ? (
        <Modal
          title="Preview import lịch từ bảng Word"
          onClose={() => setIsImportOpen(false)}
          footer={
            <div className="flex justify-end gap-2">
              <button type="button" className="secondary-button" onClick={() => setIsImportOpen(false)}>
                Hủy
              </button>
              <button type="button" className="primary-button" onClick={() => setIsImportOpen(false)}>
                Áp dụng dữ liệu
              </button>
            </div>
          }
        >
          <div className="overflow-hidden rounded border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Lớp</th>
                  <th className="px-3 py-2">Môn học</th>
                  <th className="px-3 py-2">Giáo viên</th>
                  <th className="px-3 py-2">Phòng</th>
                  <th className="px-3 py-2">Tiết</th>
                  <th className="px-3 py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {importedPreviewRows.map((row) => {
                  const hasConflict = row.teacher === 'TS. Aris Thorne' && row.room === 'A302'

                  return (
                    <tr key={`${row.classCode}-${row.shift}`}>
                      <td className="px-3 py-2 font-semibold">{row.classCode}</td>
                      <td className="px-3 py-2">{row.subject}</td>
                      <td className="px-3 py-2">{row.teacher}</td>
                      <td className="px-3 py-2">{row.room}</td>
                      <td className="px-3 py-2">{row.day} · {row.shift}</td>
                      <td className="px-3 py-2">
                        <StatusBadge tone={hasConflict ? 'warning' : 'success'}>
                          {hasConflict ? 'Cần duyệt' : 'Hợp lệ'}
                        </StatusBadge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
