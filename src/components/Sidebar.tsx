import { Calendar, ShoppingCart, FolderOpen, TrendingUp, Syringe, Menu, X } from 'lucide-react';
import type { ViewMode } from '../types';

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems: { view: ViewMode; label: string; icon: React.ReactNode }[] = [
  { view: 'calendar', label: 'カレンダー', icon: <Calendar size={20} /> },
  { view: 'shopping', label: '買い物リスト', icon: <ShoppingCart size={20} /> },
  { view: 'files', label: 'ファイル', icon: <FolderOpen size={20} /> },
  { view: 'growth', label: '成長グラフ', icon: <TrendingUp size={20} /> },
  { view: 'vaccination', label: '予防接種', icon: <Syringe size={20} /> },
];

export default function Sidebar({ activeView, onViewChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={onToggle}
        />
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
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">ファミリー</p>
              <p className="font-bold text-gray-800 text-sm leading-tight">スケジュール</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3">
          {menuItems.map(({ view, label, icon }) => (
            <button
              key={view}
              onClick={() => { onViewChange(view); if (isOpen) onToggle(); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 mb-1
                ${activeView === view
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <span className={activeView === view ? 'text-blue-500' : 'text-gray-400'}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold">
              家
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-700">田中家</p>
              <p>4人家族</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
