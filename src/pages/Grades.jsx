import { Download, Eye, FileUp, Lock, Pencil, Save, Search, UploadCloud } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { PageHeader, StatusBadge } from '../components/Ui'
import { useAuth } from '../context/AuthContext'
import { classes as classRecords, gradeRows as seedGradeRows, scoreColumns, students } from '../data/mockDatabase'
import { canEditClassGrades, computeAverageScore, downloadTextFile, getScoreTone, validateScore } from '../utils/businessRules'

function buildTranscriptDoc(classRecord, rows) {
  const header = `Bang diem ${classRecord.code} - ${classRecord.term}`
  const body = rows
    .map((row) => {
      const student = students.find((item) => item.id === row.studentId)
      return `${student.code}\t${student.fullName}\t${computeAverageScore(row, scoreColumns)}`
    })
    .join('\n')

  return `${header}\nMa hoc vien\tHo ten\tDiem TB\n${body}`
}

function scoreClass(score, role) {
  const tone = getScoreTone(score)

  if (role === 'student') {
    if (tone === 'danger') {
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    }

    if (tone === 'success') {
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    }
  }

  if (tone === 'danger') {
    return 'text-rose-600'
  }

  if (tone === 'success') {
    return 'text-emerald-600'
  }

  return 'text-slate-700'
}

export function Grades() {
  const { role, currentUser } = useAuth()
  const [gradeRows, setGradeRows] = useState(seedGradeRows)
  const visibleClasses = useMemo(() => {
    if (role === 'teacher') {
      return classRecords.filter((item) => currentUser.assignedClassIds?.includes(item.id))
    }

    if (role === 'student') {
      return classRecords.filter((item) => currentUser.classIds?.includes(item.id))
    }

    return classRecords
  }, [currentUser, role])
  const [selectedClassId, setSelectedClassId] = useState(visibleClasses[0]?.id ?? 'class-cs101-a')
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(role !== 'student')
  const [editingCell, setEditingCell] = useState(null)
  const [feedback, setFeedback] = useState('Sẵn sàng đồng bộ bảng điểm.')
  const uploadInputRef = useRef(null)
  const uploadTypeRef = useRef('PL HĐTL1')

  const effectiveSelectedClassId = visibleClasses.some((item) => item.id === selectedClassId)
    ? selectedClassId
    : visibleClasses[0]?.id
  const selectedClass = classRecords.find((item) => item.id === effectiveSelectedClassId) ?? visibleClasses[0]
  const canEditSelectedClass = canEditClassGrades(role, currentUser, selectedClass)
  const isEditMode = editMode && canEditSelectedClass

  const computedRows = useMemo(() => {
    return gradeRows
      .filter((row) => row.classId === selectedClass?.id)
      .filter((row) => role !== 'student' || row.studentId === currentUser.studentId)
      .map((row) => ({
        ...row,
        student: students.find((item) => item.id === row.studentId),
        average_score: computeAverageScore(row, scoreColumns),
      }))
      .filter((row) => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) {
          return true
        }

        return row.student.fullName.toLowerCase().includes(query) || row.student.code.includes(query)
      })
  }, [currentUser.studentId, gradeRows, role, searchTerm, selectedClass])

  const beginEdit = (row, column) => {
    if (!isEditMode || row.locked) {
      return
    }

    setEditingCell({ rowId: row.id, key: column.key, value: String(row[column.key]) })
  }

  const commitEdit = () => {
    if (!editingCell) {
      return
    }

    const column = scoreColumns.find((item) => item.key === editingCell.key)
    const validation = validateScore(editingCell.value, column)

    if (!validation.valid) {
      setFeedback(validation.message)
      return
    }

    setGradeRows((rows) =>
      rows.map((row) => (row.id === editingCell.rowId ? { ...row, [editingCell.key]: validation.value } : row)),
    )
    setFeedback(`Đã lưu ${column.label}: ${validation.value}`)
    setEditingCell(null)
  }

  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    const validExtensions = ['doc', 'docx', 'pdf']
    const extension = file.name.split('.').pop()?.toLowerCase()
    const isValidExtension = validExtensions.includes(extension)
    const isValidSize = file.size <= 50 * 1024 * 1024

    if (!isValidExtension || !isValidSize) {
      setFeedback('Tệp phụ lục phải là DOC/DOCX/PDF và không vượt quá 50MB.')
      return
    }

    setFeedback(`Đã nhận ${uploadTypeRef.current}: ${file.name}`)
  }

  const triggerUpload = (type) => {
    uploadTypeRef.current = type
    uploadInputRef.current?.click()
  }

  const exportDocx = () => {
    const content = buildTranscriptDoc(selectedClass, computedRows)
    downloadTextFile(`phieu-diem-${selectedClass.code}.doc`, content, 'application/msword;charset=utf-8')
    setFeedback(`Đã xuất phiếu điểm ${selectedClass.code}.`)
  }

  const exportCsv = () => {
    const header = ['ma_hoc_vien', 'ho_ten', ...scoreColumns.map((column) => column.key), 'average_score']
    const lines = computedRows.map((row) => [
      row.student.code,
      row.student.fullName,
      ...scoreColumns.map((column) => row[column.key]),
      row.average_score,
    ].join(','))

    downloadTextFile(`bang-diem-${selectedClass.code}.csv`, [header.join(','), ...lines].join('\n'), 'text/csv;charset=utf-8')
    setFeedback(`Đã xuất CSV ${selectedClass.code}.`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Module Điểm số & Phiếu điểm"
        title="Quản lý Điểm số"
        description={selectedClass ? `${selectedClass.code} · ${selectedClass.name} · ${selectedClass.term}` : 'Không có lớp khả dụng'}
        actions={
          <>
            <button type="button" className="secondary-button" onClick={exportCsv}>
              <Download size={16} />
              Xuất CSV
            </button>
            <button type="button" className="primary-button" onClick={exportDocx}>
              <Save size={16} />
              Xuất phiếu điểm DOCX
            </button>
          </>
        }
      />

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <label className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="control w-full pl-9"
                placeholder="Tìm kiếm sinh viên..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <select className="control min-w-56" value={effectiveSelectedClassId ?? ''} onChange={(event) => setSelectedClassId(event.target.value)}>
              {visibleClasses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} · {item.name}
                </option>
              ))}
            </select>
            <input ref={uploadInputRef} type="file" className="hidden" accept=".doc,.docx,.pdf" onChange={handleUpload} />
            <button type="button" className="secondary-button" onClick={() => triggerUpload('PL HĐTL1')}>
              <UploadCloud size={16} />
              Upload PL HĐTL1
            </button>
            <button type="button" className="secondary-button" onClick={() => triggerUpload('PL HĐTL2')}>
              <FileUp size={16} />
              Upload PL HĐTL2
            </button>
          </div>

          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              className={`inline-flex h-8 items-center gap-2 rounded px-3 text-xs font-bold ${isEditMode ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
              onClick={() => setEditMode(true)}
              disabled={!canEditSelectedClass}
            >
              <Pencil size={14} />
              Chế độ Chỉnh sửa
            </button>
            <button
              type="button"
              className={`inline-flex h-8 items-center gap-2 rounded px-3 text-xs font-bold ${!isEditMode ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
              onClick={() => setEditMode(false)}
            >
              <Eye size={14} />
              Chỉ đọc
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1280px] border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="w-16 border-b border-slate-200 bg-white px-4 py-3 font-bold">STT</th>
                <th className="sticky left-0 z-20 w-32 border-b border-r border-slate-200 bg-white px-4 py-3 font-bold">Mã học viên</th>
                <th className="sticky left-32 z-20 w-60 border-b border-r border-slate-200 bg-white px-4 py-3 font-bold">Họ và Tên</th>
                {scoreColumns.map((column) => (
                  <th key={column.key} className="w-36 border-b border-slate-200 bg-brand-50/60 px-4 py-3 text-center font-bold">
                    {column.label} ({Math.round(column.weight * 100)}%)
                  </th>
                ))}
                <th className="w-36 border-b border-slate-200 bg-slate-50 px-4 py-3 text-center font-bold">average_score</th>
                <th className="w-32 border-b border-slate-200 bg-slate-50 px-4 py-3 text-center font-bold">Khóa</th>
              </tr>
            </thead>
            <tbody>
              {computedRows.map((row, index) => (
                <tr key={row.id} className="group">
                  <td className="border-b border-slate-100 bg-white px-4 py-3 text-slate-600">{index + 1}</td>
                  <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-4 py-3 font-semibold text-slate-700 group-hover:bg-slate-50">
                    {row.student.code}
                  </td>
                  <td className="sticky left-32 z-10 border-b border-r border-slate-100 bg-white px-4 py-3 font-semibold text-ink group-hover:bg-slate-50">
                    {row.student.fullName}
                  </td>
                  {scoreColumns.map((column) => {
                    const isEditing = editingCell?.rowId === row.id && editingCell.key === column.key
                    const canEditCell = isEditMode && !row.locked

                    return (
                      <td
                        key={column.key}
                        className="border-b border-slate-100 bg-white px-4 py-3 text-center"
                        onClick={() => beginEdit(row, column)}
                      >
                        {isEditing ? (
                          <input
                            type="number"
                            min={column.min}
                            max={column.max}
                            step="0.1"
                            className="h-8 w-20 rounded border border-brand-300 bg-white px-2 text-center text-sm font-semibold outline-none ring-2 ring-brand-100"
                            value={editingCell.value}
                            onChange={(event) => setEditingCell({ ...editingCell, value: event.target.value })}
                            onBlur={commitEdit}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                commitEdit()
                              }
                              if (event.key === 'Escape') {
                                setEditingCell(null)
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span
                            className={`inline-flex min-w-12 items-center justify-center rounded px-2 py-1 text-sm font-semibold ${scoreClass(row[column.key], role)} ${canEditCell ? 'hover:bg-brand-50 hover:text-brand-700' : ''}`}
                          >
                            {Number(row[column.key]).toFixed(1)}
                          </span>
                        )}
                      </td>
                    )
                  })}
                  <td className="border-b border-slate-100 bg-white px-4 py-3 text-center">
                    <StatusBadge tone={getScoreTone(row.average_score)}>
                      {row.average_score.toFixed(2)}
                    </StatusBadge>
                  </td>
                  <td className="border-b border-slate-100 bg-white px-4 py-3 text-center">
                    {row.locked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Lock size={13} />
                        Đã khóa
                      </span>
                    ) : (
                      <StatusBadge tone="success">Mở</StatusBadge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Hiển thị 1-{computedRows.length} trong tổng số {computedRows.length} học viên</span>
          <span className="font-semibold text-slate-700">{feedback}</span>
        </div>
      </section>
    </div>
  )
}
