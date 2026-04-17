import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnnualSchedule from './components/AnnualSchedule';
import MonthlySchedule from './components/MonthlySchedule';
import type { CommitteeViewMode, CommitteeEvent } from './types';
import { sampleCommitteeEvents } from './data/committeeData';
import './index.css';

export default function App() {
  const [activeView, setActiveView] = useState<CommitteeViewMode>('annual');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<CommitteeEvent[]>(sampleCommitteeEvents);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const viewTitles: Record<CommitteeViewMode, string> = {
    annual:  '年間スケジュール',
    monthly: '月間スケジュール',
  };

  const addEvent = (event: CommitteeEvent) => setEvents(prev => [...prev, event]);
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedMonth(new Date(year, month, 1));
    setActiveView('monthly');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="md:hidden w-8" />
          <h1 className="text-lg font-bold text-gray-800">{viewTitles[activeView]}</h1>
          <div className="ml-auto text-sm text-gray-400">
            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeView === 'annual' && (
            <AnnualSchedule events={events} onMonthSelect={handleMonthSelect} />
          )}
          {activeView === 'monthly' && (
            <MonthlySchedule
              events={events}
              initialMonth={selectedMonth}
              onAddEvent={addEvent}
              onDeleteEvent={deleteEvent}
            />
          )}
        </div>
      </main>
    </div>
  );
}
