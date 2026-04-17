import { useState } from 'react';
import { FileText, Image, File, FolderOpen, Search, Grid, List, Download } from 'lucide-react';
import type { DriveFile } from '../types';

interface FileManagerProps {
  files: DriveFile[];
}

const typeIcon = (type: DriveFile['type']) => {
  switch (type) {
    case 'pdf': return <FileText size={24} className="text-red-500" />;
    case 'image': return <Image size={24} className="text-blue-500" />;
    case 'doc': return <File size={24} className="text-blue-700" />;
    default: return <File size={24} className="text-gray-500" />;
  }
};

const typeBadge = (type: DriveFile['type']) => {
  switch (type) {
    case 'pdf': return 'bg-red-100 text-red-700';
    case 'image': return 'bg-blue-100 text-blue-700';
    case 'doc': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function FileManager({ files }: FileManagerProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<DriveFile['type'] | 'all'>('all');

  const filtered = files
    .filter(f => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || f.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return b.date.localeCompare(a.date);
      return a.name.localeCompare(b.name, 'ja');
    });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen size={18} className="text-yellow-500" />
        <h2 className="font-bold text-gray-800">ファイル</h2>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {files.length}件
        </span>
      </div>

      {/* Search & controls */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-36">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ファイル名で検索..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'date' | 'name')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-yellow-400"
        >
          <option value="date">日付順</option>
          <option value="name">名前順</option>
        </select>
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-yellow-50 text-yellow-600' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-50 text-yellow-600' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'pdf', 'image', 'doc'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              filterType === t
                ? 'bg-yellow-400 text-white border-yellow-400'
                : 'bg-white text-gray-500 border-gray-200 hover:border-yellow-300'
            }`}
          >
            {t === 'all' ? 'すべて' : t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* File list/grid */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FolderOpen size={40} className="mb-3 opacity-30" />
            <p className="text-sm">ファイルが見つかりません</p>
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="space-y-1.5">
            {filtered.map(file => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-yellow-200 hover:shadow-sm group transition-all">
                <div className="flex-shrink-0">{typeIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.date} · {file.size}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge(file.type)}`}>
                  {file.type.toUpperCase()}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-yellow-500 transition-all">
                  <Download size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map(file => (
              <div key={file.id} className="bg-white rounded-xl border border-gray-100 hover:border-yellow-200 hover:shadow-sm p-4 flex flex-col items-center gap-2 transition-all cursor-pointer">
                {typeIcon(file.type)}
                <p className="text-xs font-medium text-gray-600 text-center line-clamp-2 leading-tight">{file.name}</p>
                <p className="text-xs text-gray-400">{file.date}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge(file.type)}`}>
                  {file.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
