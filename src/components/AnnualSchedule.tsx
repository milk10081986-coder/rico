import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CommitteeEvent, CommitteeCategoryType } from '../types';

const CATEGORY_DOT: Record<CommitteeCategoryType, string> = {
  meeting:  'bg-blue-500',
  event:    'bg-green-500',
  deadline: 'bg-red-500',
  other:    'bg-gray-400',
};

interface AnnualScheduleProps {
  events: CommitteeEvent[];
  onMonthSelect: (year: number, month: number) => void;
}

export default function AnnualSchedule({ events, onMonthSelect }: AnnualScheduleProps) {
  const [year, setYear] = useState(new Date().getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Year navigation */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={() => setYear(y => y - 1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{year}年</h2>
        <button
          onClick={() => setYear(y => y + 1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 justify-center flex-wrap">
        {([['meeting', '会議', 'bg-blue-500'], ['event', '行事', 'bg-green-500'], ['deadline', '締切', 'bg-red-500'], ['other', 'その他', 'bg-gray-400']] as const).map(([, label, dot]) => (
          <span key={label} className="flex items-center gap-1 text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>

      {/* 12-month grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-auto pb-2">
        {months.map((monthDate, monthIdx) => {
          const daysInMonth = eachDayOfInterval({
            start: startOfMonth(monthDate),
            end: endOfMonth(monthDate),
          });
          const firstDayOfWeek = getDay(startOfMonth(monthDate));
          const monthEvents = events.filter(e => e.date.startsWith(`${year}-${String(monthIdx + 1).padStart(2, '0')}`));

          return (
            <div key={monthIdx} className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-shadow">
              <button
                onClick={() => onMonthSelect(year, monthIdx)}
                className="w-full text-left mb-2 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {format(monthDate, 'M月', { locale: ja })}
                  </h3>
                  {monthEvents.length > 0 && (
                    <span className="text-[10px] text-gray-400">{monthEvents.length}件</span>
                  )}
                </div>
              </button>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-0.5">
                {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                  <div
                    key={d}
                    className={`text-center text-[9px] font-medium py-0.5 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDayOfWeek }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day, dayIdx) => {
                  const dayEvents = getEventsForDate(day);
                  const today = isSameDay(day, new Date());
                  const dow = (firstDayOfWeek + dayIdx) % 7;

                  return (
                    <div key={dayIdx} className="flex flex-col items-center py-0.5">
                      <span
                        className={`text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-medium leading-none
                          ${today ? 'bg-blue-500 text-white' : dow === 0 ? 'text-red-400' : dow === 6 ? 'text-blue-400' : 'text-gray-600'}`}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                          {dayEvents.slice(0, 3).map(e => (
                            <span key={e.id} className={`w-1 h-1 rounded-full ${CATEGORY_DOT[e.category]}`} />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Month event summary */}
              {monthEvents.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100 space-y-0.5">
                  {monthEvents.slice(0, 3).map(e => (
                    <div key={e.id} className="flex items-center gap-1 text-[10px] text-gray-500 truncate">
                      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[e.category]}`} />
                      <span className="truncate">{e.date.slice(8)}日 {e.title}</span>
                    </div>
                  ))}
                  {monthEvents.length > 3 && (
                    <button
                      onClick={() => onMonthSelect(year, monthIdx)}
                      className="text-[10px] text-blue-400 hover:text-blue-600"
                    >
                      +{monthEvents.length - 3}件
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
