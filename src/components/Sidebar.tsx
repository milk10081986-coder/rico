import { CalendarDays, CalendarRange, Menu, X, Users } from 'lucide-react';
import type { CommitteeViewMode } from '../types';

interface SidebarProps {
  activeView: CommitteeViewMode;
  onViewChange: (view: CommitteeViewMode) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems: { view: CommitteeViewMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { view: 'annual',  label: '年間スケジュール', icon: <CalendarRange size={20} />, desc: '1年間の予定を一覧' },
  { view: 'monthly', label: '月間スケジュール', icon: <CalendarDays size={20} />,  desc: '月ごとの詳細カレンダー' },
];

export default function Sidebar({ activeView, onViewChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={onToggle} />
      )}

      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 md:hidden bg-white rounded-full p-2 shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`
          fixed left-0 top-0 h-full z-30 flex flex-col
          bg-white shadow-lg transition-transform duration-300
          w-56
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-auto md:shadow-none md:z-auto
        `}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">委員会</p>
              <p className="font-bold text-gray-800 text-sm leading-tight">スケジュール</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map(({ view, label, icon, desc }) => (
            <button
              key={view}
              onClick={() => { onViewChange(view); if (isOpen) onToggle(); }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                transition-colors duration-150 text-left
                ${activeView === view
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <span className={`flex-shrink-0 ${activeView === view ? 'text-indigo-500' : 'text-gray-400'}`}>
                {icon}
              </span>
              <div>
                <div className="leading-tight">{label}</div>
                <div className={`text-[10px] font-normal mt-0.5 ${activeView === view ? 'text-indigo-400' : 'text-gray-400'}`}>
                  {desc}
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold">
              委
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-700">委員会管理</p>
              <p>年間スケジュール</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
