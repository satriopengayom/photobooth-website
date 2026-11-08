'use client'

export const EDITOR_TABS = [
  { id: 'layout', label: 'Layout' },
  { id: 'cover', label: 'Cover' },
  { id: 'filter', label: 'Filter' },
  { id: 'bingkai', label: 'Bingkai' }
]

/**
 * Tab bar editor. Tab aktif ditandai garis bawah.
 *
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {(tabId: string) => void} props.onChange
 */
export default function EditorTabs({ activeTab, onChange }) {
  return (
    <div
      className="flex border-b border-black/10"
      role="tablist"
      aria-label="Pengaturan editor"
    >
      {EDITOR_TABS.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`editor-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`editor-panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`-mb-px flex-1 border-b-2 px-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
              isActive
                ? 'border-black text-black'
                : 'border-transparent text-black/40 hover:text-black/70'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
