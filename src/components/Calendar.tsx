import { useState } from 'react';
import { format, addDays, subDays, addWeeks, subWeeks, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import type { CalendarEvent, LabelType } from '../types';

const LABEL_CONFIG: Record<LabelType, { label: string; color: string; bg: string; dot: string }> = {
  family:  { label: '家族',      color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   dot: 'bg-blue-500' },
  nursery: { label: '保育園',    color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  work:    { label: '美菜勤務',  color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  todo:    { label: 'ToDo',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   dot: 'bg-green-500' },
};

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export default function Calendar({ events, onAddEvent, onDeleteEvent }: CalendarProps) {
  const [centerDate, setCenterDate] = useState(new Date());
  const [activeLabels, setActiveLabels] = useState<Set<LabelType>>(new Set(['family', 'nursery', 'work', 'todo']));
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '', label: 'family' as LabelType });

  const days = Array.from({ length: 7 }, (_, i) => addDays(centerDate, i - 3));

  const toggleLabel = (label: LabelType) => {
    setActiveLabels(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr && activeLabels.has(e.label));
  };

  const openAddModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setNewEvent({ title: '', startTime: '', endTime: '', label: 'family' });
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
      label: newEvent.label,
      color: LABEL_CONFIG[newEvent.label].dot.replace('bg-', ''),
    });
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Label filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(Object.keys(LABEL_CONFIG) as LabelType[]).map(label => (
          <button
            key={label}
            onClick={() => toggleLabel(label)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
              ${activeLabels.has(label)
                ? `${LABEL_CONFIG[label].bg} ${LABEL_CONFIG[label].color} border-current`
                : 'bg-gray-100 text-gray-400 border-gray-200'
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full ${activeLabels.has(label) ? LABEL_CONFIG[label].dot : 'bg-gray-300'}`} />
            {LABEL_CONFIG[label].label}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <button onClick={() => setCenterDate(d => subWeeks(d, 1))} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCenterDate(d => subDays(d, 1))} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 text-xs font-medium">
            前日
          </button>
        </div>
        <button
          onClick={() => setCenterDate(new Date())}
          className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 flex items-center gap-1"
        >
          <CalendarIcon size={12} /> 今日
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => setCenterDate(d => addDays(d, 1))} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 text-xs font-medium">
            翌日
          </button>
          <button onClick={() => setCenterDate(d => addWeeks(d, 1))} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1 min-h-0">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const today = isToday(day);
          const isCenter = idx === 3;
          return (
            <div
              key={idx}
              className={`
                flex flex-col rounded-xl border transition-all min-h-32
                ${today ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200 bg-white'}
                ${isCenter && !today ? 'border-gray-300 shadow-sm' : ''}
              `}
            >
              {/* Day header */}
              <div className={`p-2 text-center border-b ${today ? 'border-blue-200' : 'border-gray-100'}`}>
                <p className="text-xs text-gray-500">{format(day, 'E', { locale: ja })}</p>
                <p className={`text-lg font-bold leading-tight ${today ? 'text-blue-600' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </p>
                <p className="text-xs text-gray-400">{format(day, 'M/d')}</p>
              </div>

              {/* Events */}
              <div className="flex-1 p-1.5 overflow-y-auto space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`group relative rounded px-1.5 py-1 text-xs border ${LABEL_CONFIG[event.label].bg} ${LABEL_CONFIG[event.label].color}`}
                  >
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                    >
                      <X size={10} />
                    </button>
                    {event.startTime && <span className="font-medium">{event.startTime} </span>}
                    <span className="leading-tight">{event.title}</span>
                  </div>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={() => openAddModal(format(day, 'yyyy-MM-dd'))}
                className="p-1.5 text-gray-300 hover:text-blue-400 hover:bg-blue-50/50 rounded-b-xl transition-colors flex justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add event modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-blue-500" />
              予定を追加
              <span className="ml-auto text-sm text-gray-400 font-normal">
                {selectedDate}
              </span>
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="タイトル"
                value={newEvent.title}
                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                autoFocus
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
                <label className="text-xs text-gray-500 mb-1 block">ラベル</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(LABEL_CONFIG) as LabelType[]).map(label => (
                    <button
                      key={label}
                      onClick={() => setNewEvent(p => ({ ...p, label }))}
                      className={`
                        px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                        ${newEvent.label === label
                          ? `${LABEL_CONFIG[label].bg} ${LABEL_CONFIG[label].color} border-current`
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                        }
                      `}
                    >
                      {LABEL_CONFIG[label].label}
                    </button>
                  ))}
                </div>
              </div>
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
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
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
