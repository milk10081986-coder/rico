import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import ShoppingList from './components/ShoppingList';
import FileManager from './components/FileManager';
import GrowthChart from './components/GrowthChart';
import VaccinationList from './components/VaccinationList';
import MealPlanner from './components/MealPlanner';
import type { ViewMode, CalendarEvent, ShoppingItem, GrowthRecord, Vaccine } from './types';
import { sampleEvents, sampleShoppingItems, sampleFiles, sampleGrowthRecords, sampleVaccines } from './data/sampleData';
import './index.css';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(sampleShoppingItems);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(sampleGrowthRecords);
  const [vaccines, setVaccines] = useState<Vaccine[]>(sampleVaccines);

  const viewTitles: Record<ViewMode, string> = {
    calendar: 'カレンダー',
    meal: '献立プランナー',
    shopping: '買い物リスト',
    files: 'ファイル',
    growth: '成長グラフ',
    vaccination: '予防接種',
  };

  const addEvent = (event: CalendarEvent) => setEvents(prev => [...prev, event]);
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const addShoppingItem = (text: string) =>
    setShoppingItems(prev => [{ id: Date.now().toString(), text, checked: false, createdAt: new Date().toISOString() }, ...prev]);
  const toggleShoppingItem = (id: string) =>
    setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const deleteShoppingItem = (id: string) =>
    setShoppingItems(prev => prev.filter(i => i.id !== id));

  const addGrowthRecord = (record: Omit<GrowthRecord, 'id'>) =>
    setGrowthRecords(prev => [...prev, { ...record, id: Date.now().toString() }]);

  const completeVaccine = (id: string, date: string) =>
    setVaccines(prev => prev.map(v => v.id === id ? { ...v, completedDate: date } : v));
  const addVaccine = (vaccine: Omit<Vaccine, 'id'>) =>
    setVaccines(prev => [...prev, { ...vaccine, id: Date.now().toString() }]);

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
          {activeView === 'calendar' && (
            <Calendar events={events} onAddEvent={addEvent} onDeleteEvent={deleteEvent} />
          )}
          {activeView === 'shopping' && (
            <ShoppingList
              items={shoppingItems}
              onAdd={addShoppingItem}
              onToggle={toggleShoppingItem}
              onDelete={deleteShoppingItem}
            />
          )}
          {activeView === 'meal' && <MealPlanner />}
          {activeView === 'files' && (
            <FileManager files={sampleFiles} />
          )}
          {activeView === 'growth' && (
            <GrowthChart records={growthRecords} onAdd={addGrowthRecord} />
          )}
          {activeView === 'vaccination' && (
            <VaccinationList vaccines={vaccines} onComplete={completeVaccine} onAdd={addVaccine} />
          )}
        </div>
      </main>
    </div>
  );
}
