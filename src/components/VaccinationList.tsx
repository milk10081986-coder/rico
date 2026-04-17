import { useState } from 'react';
import { Syringe, CheckCircle2, Circle, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import type { Vaccine, ChildName } from '../types';

interface VaccinationListProps {
  vaccines: Vaccine[];
  onComplete: (id: string, date: string) => void;
  onAdd: (vaccine: Omit<Vaccine, 'id'>) => void;
}

export default function VaccinationList({ vaccines, onComplete, onAdd }: VaccinationListProps) {
  const [activeChild, setActiveChild] = useState<ChildName>('太郎');
  const [showModal, setShowModal] = useState(false);
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', scheduledDate: '', dose: '1', totalDoses: '1' });
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completeDate, setCompleteDate] = useState('');

  const childVaccines = vaccines.filter(v => v.child === activeChild);

  const grouped = childVaccines.reduce<Record<string, Vaccine[]>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {});

  const completedCount = childVaccines.filter(v => v.completedDate).length;
  const totalCount = childVaccines.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = () => {
    if (!form.name || !form.scheduledDate) return;
    onAdd({
      child: activeChild,
      name: form.name,
      scheduledDate: form.scheduledDate,
      dose: parseInt(form.dose),
      totalDoses: parseInt(form.totalDoses),
    });
    setShowModal(false);
    setForm({ name: '', scheduledDate: '', dose: '1', totalDoses: '1' });
  };

  const handleComplete = (id: string) => {
    if (!completeDate) return;
    onComplete(id, completeDate);
    setCompletingId(null);
    setCompleteDate('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Syringe size={18} className="text-teal-500" />
        <h2 className="font-bold text-gray-800">予防接種</h2>
        <div className="ml-auto flex gap-2">
          {(['太郎', '花子'] as ChildName[]).map(child => (
            <button
              key={child}
              onClick={() => setActiveChild(child)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                activeChild === child
                  ? child === '太郎' ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {child}
            </button>
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="p-1.5 rounded-lg bg-teal-50 text-teal-500 hover:bg-teal-100 border border-teal-200"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 p-3 bg-teal-50 rounded-xl">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-600 font-medium">接種進捗</span>
          <span className="text-teal-700 font-bold">{completedCount} / {totalCount}回 ({progress}%)</span>
        </div>
        <div className="w-full bg-teal-100 rounded-full h-2">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Vaccine groups */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Syringe size={40} className="mb-3 opacity-30" />
            <p className="text-sm">接種記録がありません</p>
          </div>
        )}

        {Object.entries(grouped).map(([name, doses]) => {
          const allDone = doses.every(d => d.completedDate);
          const isExpanded = expandedVaccine === name;

          return (
            <div key={name} className={`rounded-xl border overflow-hidden ${allDone ? 'border-teal-200 bg-teal-50/50' : 'border-gray-200 bg-white'}`}>
              <button
                onClick={() => setExpandedVaccine(isExpanded ? null : name)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50/50 transition-colors"
              >
                {allDone
                  ? <CheckCircle2 size={18} className="text-teal-500 flex-shrink-0" />
                  : <Circle size={18} className="text-gray-300 flex-shrink-0" />
                }
                <div className="flex-1 text-left">
                  <p className={`text-sm font-medium ${allDone ? 'text-teal-700' : 'text-gray-700'}`}>{name}</p>
                  <p className="text-xs text-gray-400">{doses.filter(d => d.completedDate).length}/{doses.length}回完了</p>
                </div>
                {isExpanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {doses.sort((a, b) => a.dose - b.dose).map(dose => (
                    <div key={dose.id} className="px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600">{dose.dose}回目 / 全{dose.totalDoses}回</p>
                          <p className="text-xs text-gray-400">予定: {dose.scheduledDate}</p>
                          {dose.completedDate && (
                            <p className="text-xs text-teal-600">接種済: {dose.completedDate}</p>
                          )}
                        </div>
                        {dose.completedDate ? (
                          <CheckCircle2 size={18} className="text-teal-500" />
                        ) : (
                          <div>
                            {completingId === dose.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="date"
                                  value={completeDate}
                                  onChange={e => setCompleteDate(e.target.value)}
                                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400"
                                />
                                <button onClick={() => handleComplete(dose.id)} className="text-xs bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600">OK</button>
                                <button onClick={() => setCompletingId(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setCompletingId(dose.id); setCompleteDate(''); }}
                                className="text-xs border border-teal-200 text-teal-600 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                              >
                                接種済にする
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">予防接種を追加</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="flex gap-2 mb-4">
              {(['太郎', '花子'] as ChildName[]).map(child => (
                <button
                  key={child}
                  onClick={() => setActiveChild(child)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    activeChild === child
                      ? child === '太郎' ? 'bg-blue-500 text-white border-blue-500' : 'bg-pink-500 text-white border-pink-500'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {child}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ワクチン名</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="例: インフルエンザ"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">接種予定日</label>
                <input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">回数</label>
                  <input type="number" min="1" value={form.dose} onChange={e => setForm(p => ({ ...p, dose: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">合計回数</label>
                  <input type="number" min="1" value={form.totalDoses} onChange={e => setForm(p => ({ ...p, totalDoses: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={handleAdd} className="flex-1 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
