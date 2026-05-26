import { Download, Eye, File, FileArchive, FileText, MoreVertical, Paperclip, Search, Send, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Modal, PageHeader, StatusBadge } from '../components/Ui'
import { useAuth } from '../context/AuthContext'
import { chatThreads, courses, documents } from '../data/mockDatabase'

const typeStyles = {
  PDF: 'bg-rose-50 text-rose-600',
  Word: 'bg-blue-50 text-blue-600',
  Excel: 'bg-emerald-50 text-emerald-600',
}

function fileIcon(type) {
  if (type === 'PDF') {
    return <FileText size={17} />
  }

  if (type === 'Word') {
    return <FileArchive size={17} />
  }

  return <File size={17} />
}

export function DocumentsChat() {
  const { role, currentUser } = useAuth()
  const visibleDocuments = useMemo(() => {
    if (role === 'student') {
      return documents.filter((document) => document.sensitivity === 'public')
    }

    return documents
  }, [role])
  const [selectedDocumentId, setSelectedDocumentId] = useState(visibleDocuments[0]?.id)
  const [previewDocument, setPreviewDocument] = useState(null)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState(chatThreads[0].messages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const filteredDocuments = visibleDocuments.filter((document) => document.title.toLowerCase().includes(query.trim().toLowerCase()))
  const effectiveSelectedDocumentId = visibleDocuments.some((document) => document.id === selectedDocumentId)
    ? selectedDocumentId
    : visibleDocuments[0]?.id
  const selectedDocument = visibleDocuments.find((document) => document.id === effectiveSelectedDocumentId) ?? visibleDocuments[0]
  const course = courses.find((item) => item.id === selectedDocument?.courseId)

  const sendMessage = () => {
    const text = draft.trim()

    if (!text) {
      return
    }

    const userMessage = {
      id: `msg-local-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      role,
      at: 'Bây giờ',
      text,
    }

    setMessages((items) => [...items, userMessage])
    setDraft('')
    setIsTyping(true)

    window.setTimeout(() => {
      setMessages((items) => [
        ...items,
        {
          id: `msg-reply-${Date.now()}`,
          senderId: 'user-training',
          senderName: 'Ban Đào tạo',
          role: 'training',
          at: 'Bây giờ',
          text: 'Phòng đào tạo đã ghi nhận câu hỏi. Hồ sơ liên quan sẽ được đối chiếu với lịch học và bảng điểm trong hệ thống.',
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div>
      <PageHeader
        title="Tài liệu Khóa học"
        description={course ? `${course.code} · ${course.name}` : 'Kho tài liệu'}
        actions={
          <>
            <button type="button" className="secondary-button">
              <Eye size={16} />
              Dạng lưới
            </button>
            <button type="button" className="primary-button">
              <Download size={16} />
              Tải lên
            </button>
          </>
        }
      />

      <div className="grid min-h-[690px] gap-4 xl:grid-cols-[280px_minmax(280px,1fr)_320px]">
        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="control w-full pl-9"
                placeholder="Tìm kiếm tài liệu..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <div className="max-h-[615px] overflow-auto p-3">
            {filteredDocuments.map((document) => {
              const isActive = document.id === selectedDocument?.id
              const isSensitive = document.sensitivity !== 'public'

              return (
                <button
                  type="button"
                  key={document.id}
                  className={`mb-2 flex w-full gap-3 rounded p-3 text-left transition ${isActive ? 'bg-brand-600 text-white' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedDocumentId(document.id)}
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded ${isActive ? 'bg-white/15 text-white' : typeStyles[document.type]}`}>
                    {fileIcon(document.type)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{document.title}</span>
                    <span className={`mt-1 block text-xs ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {document.sizeMb} MB · {document.updatedAt}
                    </span>
                    {role !== 'student' ? (
                      <span className={`mt-2 flex items-center gap-2 text-xs ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {isSensitive ? <ShieldAlert size={13} /> : null}
                        {document.owner} · {document.complianceCode}
                      </span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="panel flex flex-col overflow-hidden bg-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Xem trước</p>
              <h2 className="truncate text-sm font-bold text-ink">{selectedDocument?.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedDocument ? <StatusBadge tone={selectedDocument.sizeMb <= 50 ? 'success' : 'danger'}>{selectedDocument.sizeMb} MB</StatusBadge> : null}
              <button type="button" className="icon-button" onClick={() => setPreviewDocument(selectedDocument)} aria-label="Mở preview">
                <Eye size={16} />
              </button>
              <button type="button" className="icon-button" aria-label="Tải xuống">
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-start justify-center overflow-auto p-8">
            <article className="min-h-[560px] w-full max-w-[360px] border border-slate-300 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{course?.code}</p>
              <h3 className="mt-4 text-3xl font-bold leading-tight text-ink">Vật lý Nâng cao 301</h3>
              <div className="my-5 h-px bg-slate-300" />
              <p className="text-base font-semibold text-slate-800">Đề cương Khóa học - Học kỳ 3</p>
              <p className="mt-6 text-sm leading-6 text-slate-700">
                Giảng viên: TS. Aris Thorne<br />
                Giờ làm việc: Thứ 3/Thứ 5 2-4 PM
              </p>
              <div className="my-6 h-px bg-slate-200" />
              <p className="text-sm font-bold text-slate-900">Tổng quan Khóa học</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Khóa học này bao gồm các chủ đề nâng cao về cơ học lượng tử và nhiệt động lực học hệ thống.
              </p>
              <div className="mt-8 flex h-36 items-center justify-center border border-slate-300 bg-slate-100 text-sm font-medium text-slate-500">
                Biểu đồ tiến độ học phần
              </div>
            </article>
          </div>
        </section>

        <section className="panel flex min-h-[690px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                AT
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Thảo luận Vật lý 301</h2>
                <p className="text-xs font-semibold text-emerald-600">24 đang hoạt động</p>
              </div>
            </div>
            <button type="button" className="icon-button border-0" aria-label="Tùy chọn">
              <MoreVertical size={17} />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50 p-5">
            <div className="mb-5 text-center">
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">Hôm nay, 09:30 AM</span>
            </div>
            <div className="space-y-4">
              {messages.map((message) => {
                const mine = message.senderId === currentUser.id || message.role === 'training'

                return (
                  <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded px-4 py-3 text-sm shadow-sm ${mine ? 'bg-brand-600 text-white' : 'bg-blue-100 text-slate-800'}`}>
                      <p className={`mb-1 text-xs font-bold ${mine ? 'text-indigo-100' : 'text-slate-600'}`}>
                        {message.senderName} · {message.at}
                      </p>
                      <p className="leading-5">{message.text}</p>
                      {message.id === 'msg-002' ? (
                        <button type="button" className="mt-3 flex w-full items-center gap-2 rounded bg-white/15 px-3 py-2 text-left text-xs font-bold">
                          <FileText size={15} />
                          Q3_Syllabus_Advanced_Physics.pdf · 2.4 MB
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
              {isTyping ? (
                <div className="text-sm font-semibold text-slate-500">Cán bộ đào tạo đang gõ...</div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded border border-slate-200 bg-white px-2 py-2">
              <button type="button" className="icon-button h-8 w-8 border-0" aria-label="Đính kèm">
                <Paperclip size={16} />
              </button>
              <input
                className="min-w-0 flex-1 border-0 px-2 text-sm outline-none"
                placeholder="Nhập tin nhắn..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage()
                  }
                }}
              />
              <button type="button" className="primary-button h-9 w-9 px-0" onClick={sendMessage} aria-label="Gửi">
                <Send size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {previewDocument ? (
        <Modal
          title={previewDocument.title}
          onClose={() => setPreviewDocument(null)}
          footer={
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                {previewDocument.type} · {previewDocument.sizeMb} MB · giới hạn 50MB
              </span>
              <button type="button" className="primary-button" onClick={() => setPreviewDocument(null)}>
                Đóng preview
              </button>
            </div>
          }
        >
          <div className="mx-auto max-w-xl rounded border border-slate-200 bg-slate-50 p-6">
            <div className="rounded border border-slate-300 bg-white p-8 shadow-sm">
              <p className="text-xs font-bold uppercase text-brand-600">{previewDocument.complianceCode}</p>
              <h3 className="mt-3 text-2xl font-bold text-ink">{previewDocument.title}</h3>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                Nội dung đang được xem trực tiếp trong EduTrack Pro. Quyền truy cập được lọc theo vai trò hiện tại và trạng thái nhạy cảm của tài liệu.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="h-24 rounded bg-brand-100" />
                <div className="h-24 rounded bg-blue-100" />
                <div className="h-24 rounded bg-emerald-100" />
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
