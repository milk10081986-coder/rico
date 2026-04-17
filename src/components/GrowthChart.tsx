import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Plus, X } from 'lucide-react';
import type { GrowthRecord, ChildName } from '../types';

interface GrowthChartProps {
  records: GrowthRecord[];
  onAdd: (record: Omit<GrowthRecord, 'id'>) => void;
}

const CHILD_COLORS: Record<ChildName, { height: string; weight: string; bg: string }> = {
  '太郎': { height: '#3b82f6', weight: '#93c5fd', bg: 'bg-blue-50' },
  '花子': { height: '#ec4899', weight: '#f9a8d4', bg: 'bg-pink-50' },
};

export default function GrowthChart({ records, onAdd }: GrowthChartProps) {
  const [activeChild, setActiveChild] = useState<ChildName>('太郎');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: '', height: '', weight: '' });

  const childRecords = records
    .filter(r => r.child === activeChild)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({
      date: r.date.slice(0, 7).replace('-', '/'),
      身長: r.height,
      体重: r.weight,
    }));

  const latest = records.filter(r => r.child === activeChild).sort((a, b) => b.date.localeCompare(a.date))[0];

  const handleAdd = () => {
    if (!form.date || !form.height || !form.weight) return;
    onAdd({ child: activeChild, date: form.date, height: parseFloat(form.height), weight: parseFloat(form.weight) });
    setShowModal(false);
    setForm({ date: '', height: '', weight: '' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-indigo-500" />
        <h2 className="font-bold text-gray-800">成長グラフ</h2>
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
            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 border border-indigo-200"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Latest stats */}
      {latest && (
        <div className={`flex gap-4 mb-4 p-3 rounded-xl ${CHILD_COLORS[activeChild].bg}`}>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 mb-0.5">最新身長</p>
            <p className="text-2xl font-bold text-gray-800">{latest.height}<span className="text-sm font-normal text-gray-500">cm</span></p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 mb-0.5">最新体重</p>
            <p className="text-2xl font-bold text-gray-800">{latest.weight}<span className="text-sm font-normal text-gray-500">kg</span></p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 mb-0.5">測定日</p>
            <p className="text-sm font-medium text-gray-700">{latest.date.slice(0, 7).replace('-', '/')}</p>
          </div>
        </div>
      )}

      {/* Height chart */}
      <div className="flex-1 min-h-0">
        <p className="text-xs font-medium text-gray-500 mb-2">身長 (cm)</p>
        <ResponsiveContainer width="100%" height="45%">
          <LineChart data={childRecords} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip formatter={(v) => [`${v}cm`, '身長']} />
            <Line
              type="monotone"
              dataKey="身長"
              stroke={CHILD_COLORS[activeChild].height}
              strokeWidth={2.5}
              dot={{ fill: CHILD_COLORS[activeChild].height, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs font-medium text-gray-500 mt-4 mb-2">体重 (kg)</p>
        <ResponsiveContainer width="100%" height="45%">
          <LineChart data={childRecords} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip formatter={(v) => [`${v}kg`, '体重']} />
            <Line
              type="monotone"
              dataKey="体重"
              stroke={CHILD_COLORS[activeChild].weight}
              strokeWidth={2.5}
              dot={{ fill: CHILD_COLORS[activeChild].weight, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Add modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">成長記録を追加</h3>
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
                <label className="text-xs text-gray-500 mb-1 block">測定日</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">身長 (cm)</label>
                <input type="number" step="0.1" value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))}
                  placeholder="例: 92.5"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">体重 (kg)</label>
                <input type="number" step="0.1" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                  placeholder="例: 14.0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={handleAdd} className="flex-1 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
