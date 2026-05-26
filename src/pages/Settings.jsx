import { Braces, Columns3, DatabaseZap, Plus, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader, StatusBadge, Toggle } from '../components/Ui'
import { excelObjectMappings, gradingTemplates } from '../data/mockDatabase'
import { validateExcelMapping } from '../utils/businessRules'

function normalizeColumn(value) {
  return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
}

export function Settings() {
  const [activeTab, setActiveTab] = useState('excel')
  const [mappings, setMappings] = useState(excelObjectMappings)
  const [templates, setTemplates] = useState(gradingTemplates)
  const [selectedMappingId, setSelectedMappingId] = useState(excelObjectMappings[0].id)
  const [selectedTemplateId, setSelectedTemplateId] = useState(gradingTemplates[0].id)
  const [saveMessage, setSaveMessage] = useState('Cấu hình đang ở trạng thái nháp.')

  const selectedMapping = mappings.find((item) => item.id === selectedMappingId)
  const selectedTemplate = templates.find((item) => item.id === selectedTemplateId)
  const mappingValidation = useMemo(() => validateExcelMapping(selectedMapping), [selectedMapping])
  const templateWeight = selectedTemplate.columns.reduce((total, column) => total + Number(column.weight), 0)

  const updateMapping = (patch) => {
    setMappings((items) => items.map((item) => (item.id === selectedMappingId ? { ...item, ...patch } : item)))
  }

  const updateMappingColumn = (code, patch) => {
    setMappings((items) =>
      items.map((item) =>
        item.id === selectedMappingId
          ? {
              ...item,
              mappings: item.mappings.map((mapping) => (mapping.code === code ? { ...mapping, ...patch } : mapping)),
            }
          : item,
      ),
    )
  }

  const updateTemplate = (patch) => {
    setTemplates((items) => items.map((item) => (item.id === selectedTemplateId ? { ...item, ...patch } : item)))
  }

  const updateTemplateColumn = (key, patch) => {
    setTemplates((items) =>
      items.map((item) =>
        item.id === selectedTemplateId
          ? {
              ...item,
              columns: item.columns.map((column) => (column.key === key ? { ...column, ...patch } : column)),
            }
          : item,
      ),
    )
  }

  const addTemplateColumn = () => {
    const nextIndex = selectedTemplate.columns.length + 1
    setTemplates((items) =>
      items.map((item) =>
        item.id === selectedTemplateId
          ? {
              ...item,
              columns: [
                ...item.columns,
                {
                  key: `custom_${nextIndex}`,
                  label: `Cột tùy chỉnh ${nextIndex}`,
                  weight: 0,
                  min: 0,
                  max: 10,
                  required: false,
                },
              ],
            }
          : item,
      ),
    )
  }

  const saveConfiguration = () => {
    const validTemplate = Math.abs(templateWeight - 1) < 0.001 && selectedTemplate.columns.every((column) => Number(column.min) < Number(column.max))

    if (activeTab === 'excel' && !mappingValidation.valid) {
      setSaveMessage('Mapping Excel chưa hợp lệ: kiểm tra sheet pattern và ký tự cột.')
      return
    }

    if (activeTab === 'templates' && !validTemplate) {
      setSaveMessage('Mẫu điểm chưa hợp lệ: tổng trọng số phải bằng 100% và min nhỏ hơn max.')
      return
    }

    setSaveMessage(`Đã lưu ${activeTab === 'excel' ? selectedMapping.objectType : selectedTemplate.name}.`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Module cấu hình nâng cao"
        title="Cài đặt"
        description="Mapping Excel, mẫu bảng điểm và quy tắc kiểm tra dữ liệu"
        actions={
          <button type="button" className="primary-button" onClick={saveConfiguration}>
            <Save size={16} />
            Lưu cấu hình
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={`secondary-button ${activeTab === 'excel' ? 'border-brand-300 bg-brand-50 text-brand-700' : ''}`}
          onClick={() => setActiveTab('excel')}
        >
          <DatabaseZap size={16} />
          Mapping Excel
        </button>
        <button
          type="button"
          className={`secondary-button ${activeTab === 'templates' ? 'border-brand-300 bg-brand-50 text-brand-700' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Columns3 size={16} />
          Mẫu bảng điểm
        </button>
        <span className="text-sm font-semibold text-slate-500">{saveMessage}</span>
      </div>

      {activeTab === 'excel' ? (
        <div className="grid gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
          <section className="panel p-3">
            {mappings.map((mapping) => {
              const validation = validateExcelMapping(mapping)

              return (
                <button
                  type="button"
                  key={mapping.id}
                  className={`mb-2 w-full rounded border p-3 text-left transition ${
                    mapping.id === selectedMappingId ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedMappingId(mapping.id)}
                >
                  <p className="text-sm font-bold text-ink">{mapping.objectType}</p>
                  <p className="mt-1 text-xs text-slate-500">{mapping.sheetPattern}</p>
                  <div className="mt-2">
                    <StatusBadge tone={validation.valid ? 'success' : 'warning'}>{validation.valid ? 'Hợp lệ' : 'Cần kiểm tra'}</StatusBadge>
                  </div>
                </button>
              )
            })}
          </section>

          <section className="panel overflow-hidden">
            <div className="grid gap-4 border-b border-slate-200 p-4 md:grid-cols-3">
              <label className="text-sm font-semibold text-slate-600">
                Loại đối tượng
                <input className="control mt-2 w-full" value={selectedMapping.objectType} onChange={(event) => updateMapping({ objectType: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Pattern sheet
                <input className="control mt-2 w-full" value={selectedMapping.sheetPattern} onChange={(event) => updateMapping({ sheetPattern: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Chế độ khớp
                <select className="control mt-2 w-full" value={selectedMapping.matchMode} onChange={(event) => updateMapping({ matchMode: event.target.value })}>
                  <option value="exact">Khớp chính xác</option>
                  <option value="wildcard">Dùng ký tự đại diện *</option>
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Thuộc tính</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Ký tự cột</th>
                    <th className="px-4 py-3">Bắt buộc</th>
                    <th className="px-4 py-3">Validate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedMapping.mappings.map((mapping) => (
                    <tr key={mapping.code}>
                      <td className="px-4 py-3 font-semibold text-ink">{mapping.property}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{mapping.code}</td>
                      <td className="px-4 py-3">
                        <input
                          className="control w-24 text-center font-bold"
                          value={mapping.column}
                          onChange={(event) => updateMappingColumn(mapping.code, { column: normalizeColumn(event.target.value) })}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Toggle checked={mapping.required} onChange={(required) => updateMappingColumn(mapping.code, { required })} label={`Bắt buộc ${mapping.property}`} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={/^[A-Z]{1,3}$/.test(mapping.column) ? 'success' : 'danger'}>
                          {/^[A-Z]{1,3}$/.test(mapping.column) ? 'OK' : 'Sai cột'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
          <section className="panel p-3">
            {templates.map((template) => (
              <button
                type="button"
                key={template.id}
                className={`mb-2 w-full rounded border p-3 text-left transition ${
                  template.id === selectedTemplateId ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
                onClick={() => setSelectedTemplateId(template.id)}
              >
                <p className="text-sm font-bold text-ink">{template.name}</p>
                <p className="mt-1 text-xs text-slate-500">{template.classType}</p>
                <div className="mt-2">
                  <StatusBadge tone={Math.abs(template.columns.reduce((total, column) => total + column.weight, 0) - 1) < 0.001 ? 'success' : 'warning'}>
                    {template.columns.length} cột
                  </StatusBadge>
                </div>
              </button>
            ))}
          </section>

          <section className="panel overflow-hidden">
            <div className="grid gap-4 border-b border-slate-200 p-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
              <label className="text-sm font-semibold text-slate-600">
                Tên mẫu
                <input className="control mt-2 w-full" value={selectedTemplate.name} onChange={(event) => updateTemplate({ name: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Loại lớp
                <input className="control mt-2 w-full" value={selectedTemplate.classType} onChange={(event) => updateTemplate({ classType: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Công thức tính
                <div className="relative mt-2">
                  <Braces className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input className="control w-full pl-9" value={selectedTemplate.formula} onChange={(event) => updateTemplate({ formula: event.target.value })} />
                </div>
              </label>
              <div className="flex items-end">
                <button type="button" className="secondary-button" onClick={addTemplateColumn}>
                  <Plus size={16} />
                  Thêm cột
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Cột điểm</th>
                    <th className="px-4 py-3">Key</th>
                    <th className="px-4 py-3">Trọng số</th>
                    <th className="px-4 py-3">Min</th>
                    <th className="px-4 py-3">Max</th>
                    <th className="px-4 py-3">Bắt buộc</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedTemplate.columns.map((column) => {
                    const validRange = Number(column.min) < Number(column.max)

                    return (
                      <tr key={column.key}>
                        <td className="px-4 py-3">
                          <input className="control w-52" value={column.label} onChange={(event) => updateTemplateColumn(column.key, { label: event.target.value })} />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{column.key}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            className="control w-24"
                            value={column.weight}
                            onChange={(event) => updateTemplateColumn(column.key, { weight: Number(event.target.value) })}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="control w-20"
                            value={column.min}
                            onChange={(event) => updateTemplateColumn(column.key, { min: Number(event.target.value) })}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="control w-20"
                            value={column.max}
                            onChange={(event) => updateTemplateColumn(column.key, { max: Number(event.target.value) })}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Toggle checked={column.required} onChange={(required) => updateTemplateColumn(column.key, { required })} label={`Bắt buộc ${column.label}`} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={validRange ? 'success' : 'danger'}>{validRange ? 'OK' : 'Sai thang'}</StatusBadge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <span className="text-sm font-semibold text-slate-500">Tổng trọng số</span>
              <StatusBadge tone={Math.abs(templateWeight - 1) < 0.001 ? 'success' : 'warning'}>
                {(templateWeight * 100).toFixed(0)}%
              </StatusBadge>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
