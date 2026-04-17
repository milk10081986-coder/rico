import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isToday, addMonths, subMonths,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, X, Calendar } from 'lucide-react';
import type { CommitteeEvent, CommitteeCategoryType } from '../types';

export const CATEGORY_CONFIG: Record<CommitteeCategoryType, { label: string; color: string; bg: string; dot: string }> = {
  meeting:  { label: '会議',   color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200',   dot: 'bg-blue-500' },
  event:    { label: '行事',   color: 'text-green-700', bg: 'bg-green-50 border-green-200',  dot: 'bg-green-500' },
  deadline: { label: '締切',   color: 'text-red-700',   bg: 'bg-red-50 border-red-200',     dot: 'bg-red-500' },
  other:    { label: 'その他', color: 'text-gray-700',  bg: 'bg-gray-50 border-gray-200',   dot: 'bg-gray-400' },
};

interface MonthlyScheduleProps {
  events: CommitteeEvent[];
  initialMonth?: Date;
  onAddEvent: (event: CommitteeEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export default function MonthlySchedule({ events, initialMonth, onAddEvent, onDeleteEvent }: MonthlyScheduleProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'meeting' as CommitteeCategoryType,
    description: '',
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  const totalRows = Math.ceil((firstDayOfWeek + daysInMonth.length) / 7);
  const totalCellCount = totalRows * 7;

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr).sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''));
  };

  const openAddModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setNewEvent({ title: '', startTime: '', endTime: '', category: 'meeting', description: '' });
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    onAddEvent({
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      startTime: newEvent.startTime || undefined,
      endTime: newEvent.endTime || undefined,
      category: newEvent.category,
      description: newEvent.description || undefined,
    });
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </h2>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 flex items-center gap-1"
          >
            <Calendar size={11} /> 今月
          </button>
        </div>
        <button
          onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Category legend */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {(Object.keys(CATEGORY_CONFIG) as CommitteeCategoryType[]).map(cat => (
          <span
            key={cat}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${CATEGORY_CONFIG[cat].bg} ${CATEGORY_CONFIG[cat].color}`}
          >
            <span className={`w-2 h-2 rounded-full ${CATEGORY_CONFIG[cat].dot}`} />
            {CATEGORY_CONFIG[cat].label}
          </span>
        ))}
        <button
          onClick={() => openAddModal(format(new Date(), 'yyyy-MM-dd'))}
          className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus size={12} /> 予定を追加
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col flex-1 min-h-0 border border-gray-200 rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-semibold py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div
          className="grid grid-cols-7 flex-1 min-h-0"
          style={{ gridTemplateRows: `repeat(${totalRows}, 1fr)` }}
        >
          {Array.from({ length: totalCellCount }, (_, cellIdx) => {
            const dayIdx = cellIdx - firstDayOfWeek;
            const day = dayIdx >= 0 && dayIdx < daysInMonth.length ? daysInMonth[dayIdx] : null;
            const dow = cellIdx % 7;
            const dayEvents = day ? getEventsForDate(day) : [];
            const today = day ? isToday(day) : false;
            const isLastRow = Math.floor(cellIdx / 7) === totalRows - 1;
            const isLastCol = dow === 6;

            return (
              <div
                key={cellIdx}
                className={`flex flex-col p-1 min-h-[80px]
                  ${!isLastRow ? 'border-b' : ''} ${!isLastCol ? 'border-r' : ''} border-gray-100
                  ${day ? 'bg-white hover:bg-gray-50/50' : 'bg-gray-50/40'}
                `}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full leading-none
                          ${today ? 'bg-blue-500 text-white' : dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'}`}
                      >
                        {format(day, 'd')}
                      </span>
                      <button
                        onClick={() => openAddModal(format(day, 'yyyy-MM-dd'))}
                        className="text-gray-200 hover:text-blue-400 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="space-y-0.5 flex-1 overflow-hidden">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`group/ev relative flex items-start gap-0.5 rounded px-1 py-0.5 text-[11px] border leading-tight ${CATEGORY_CONFIG[event.category].bg} ${CATEGORY_CONFIG[event.category].color}`}
                        >
                          <button
                            onClick={() => onDeleteEvent(event.id)}
                            className="flex-shrink-0 opacity-0 group-hover/ev:opacity-100 text-gray-400 hover:text-red-500 mt-0.5 transition-opacity"
                          >
                            <X size={9} />
                          </button>
                          <span className="truncate">
                            {event.startTime && <span className="font-medium">{event.startTime} </span>}
                            {event.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add event modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-blue-500" />
              予定を追加
              <span className="ml-auto text-sm text-gray-400 font-normal">{selectedDate}</span>
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="タイトル（必須）"
                value={newEvent.title}
                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">開始時間</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={e => setNewEvent(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">終了時間</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={e => setNewEvent(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">カテゴリ</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(CATEGORY_CONFIG) as CommitteeCategoryType[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewEvent(p => ({ ...p, category: cat }))}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                        ${newEvent.category === cat
                          ? `${CATEGORY_CONFIG[cat].bg} ${CATEGORY_CONFIG[cat].color} border-current`
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                    >
                      {CATEGORY_CONFIG[cat].label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="メモ（任意）"
                value={newEvent.description}
                onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
