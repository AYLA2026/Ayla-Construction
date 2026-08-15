'use client'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  loading?: boolean
  onAdd?: () => void
  onEdit?: (row: any) => void
  onDelete?: (id: string) => void
}

export default function DataTable({ title, columns, data, loading, onAdd, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="ayla-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="ayla-btn flex items-center gap-2 text-sm">
            <Plus size={16} />
            <span>إضافة جديد</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={28} className="text-ayla-gold animate-spin" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-ayla-border">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">#</th>
                {columns.map(c => <th key={c.key} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{c.label}</th>)}
                {(onEdit || onDelete) && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={columns.length + 2} className="text-center py-8 text-gray-400">لا توجد بيانات</td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id || i} className="border-b border-ayla-border last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  {columns.map(c => (
                    <td key={c.key} className="px-4 py-3 text-gray-700">
                      {c.render ? c.render(row[c.key], row) : row[c.key] || '—'}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onEdit && <button onClick={() => onEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></button>}
                        {onDelete && <button onClick={() => onDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
