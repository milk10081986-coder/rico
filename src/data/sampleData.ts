import type { CalendarEvent, ShoppingItem, DriveFile, GrowthRecord, Vaccine } from '../types';
import { format, addDays, subDays } from 'date-fns';

const today = new Date();
const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

export const sampleEvents: CalendarEvent[] = [
  { id: '1', title: '保育園 入園式', date: fmt(today), startTime: '10:00', endTime: '12:00', label: 'nursery', color: '#f97316' },
  { id: '2', title: '美菜 出勤', date: fmt(today), startTime: '09:00', endTime: '18:00', label: 'work', color: '#8b5cf6' },
  { id: '3', title: '太郎 小児科', date: fmt(addDays(today, 1)), startTime: '14:00', endTime: '15:00', label: 'family', color: '#3b82f6' },
  { id: '4', title: '家族でお出かけ', date: fmt(addDays(today, 2)), allDay: true, label: 'family', color: '#3b82f6' },
  { id: '5', title: '保育園 お誕生日会', date: fmt(addDays(today, 3)), startTime: '11:00', endTime: '12:00', label: 'nursery', color: '#f97316' },
  { id: '6', title: '美菜 休み', date: fmt(addDays(today, 4)), allDay: true, label: 'work', color: '#8b5cf6' },
  { id: '7', title: '夫 出張', date: fmt(subDays(today, 1)), startTime: '08:00', endTime: '20:00', label: 'family', color: '#3b82f6' },
  { id: '8', title: '花子 健診', date: fmt(addDays(today, 5)), startTime: '13:00', endTime: '14:00', label: 'family', color: '#3b82f6' },
  { id: '9', title: 'ゴミ出し', date: fmt(today), label: 'todo', color: '#10b981' },
  { id: '10', title: '保育園 保護者会', date: fmt(addDays(today, 6)), startTime: '19:00', endTime: '21:00', label: 'nursery', color: '#f97316' },
];

export const sampleShoppingItems: ShoppingItem[] = [
  { id: '1', text: '牛乳', checked: false, createdAt: new Date().toISOString() },
  { id: '2', text: '卵', checked: true, createdAt: new Date().toISOString() },
  { id: '3', text: 'パン', checked: false, createdAt: new Date().toISOString() },
  { id: '4', text: 'おむつ (Mサイズ)', checked: false, createdAt: new Date().toISOString() },
  { id: '5', text: '野菜ジュース', checked: true, createdAt: new Date().toISOString() },
  { id: '6', text: 'りんご', checked: false, createdAt: new Date().toISOString() },
  { id: '7', text: 'シャンプー', checked: false, createdAt: new Date().toISOString() },
  { id: '8', text: '洗剤', checked: false, createdAt: new Date().toISOString() },
];

export const sampleFiles: DriveFile[] = [
  { id: '1', name: '保育園_2024年度入園手続き.pdf', type: 'pdf', size: '1.2MB', date: '2024-03-01' },
  { id: '2', name: '太郎_母子手帳コピー.pdf', type: 'pdf', size: '3.4MB', date: '2024-01-15' },
  { id: '3', name: '花子_健康診断結果.pdf', type: 'pdf', size: '0.8MB', date: '2024-02-20' },
  { id: '4', name: '保育園_緊急連絡先.pdf', type: 'pdf', size: '0.3MB', date: '2024-03-10' },
  { id: '5', name: '家族写真_春_2024.jpg', type: 'image', size: '4.1MB', date: '2024-04-01' },
  { id: '6', name: '太郎_幼稚園書類.doc', type: 'doc', size: '0.5MB', date: '2024-03-15' },
  { id: '7', name: '保険証_コピー.pdf', type: 'pdf', size: '0.9MB', date: '2024-02-01' },
];

export const sampleGrowthRecords: GrowthRecord[] = [
  { id: '1', child: '太郎', date: '2023-06-01', height: 85.0, weight: 12.5 },
  { id: '2', child: '太郎', date: '2023-09-01', height: 87.5, weight: 13.0 },
  { id: '3', child: '太郎', date: '2023-12-01', height: 90.0, weight: 13.6 },
  { id: '4', child: '太郎', date: '2024-03-01', height: 92.5, weight: 14.0 },
  { id: '5', child: '太郎', date: '2024-06-01', height: 95.0, weight: 14.5 },
  { id: '6', child: '花子', date: '2023-06-01', height: 68.0, weight: 7.8 },
  { id: '7', child: '花子', date: '2023-09-01', height: 71.0, weight: 8.5 },
  { id: '8', child: '花子', date: '2023-12-01', height: 74.0, weight: 9.2 },
  { id: '9', child: '花子', date: '2024-03-01', height: 77.0, weight: 9.8 },
  { id: '10', child: '花子', date: '2024-06-01', height: 79.5, weight: 10.3 },
];

export const sampleVaccines: Vaccine[] = [
  { id: '1', name: 'BCG', child: '太郎', scheduledDate: '2022-04-01', completedDate: '2022-04-05', dose: 1, totalDoses: 1 },
  { id: '2', name: 'B型肝炎', child: '太郎', scheduledDate: '2022-03-01', completedDate: '2022-03-03', dose: 1, totalDoses: 3 },
  { id: '3', name: 'B型肝炎', child: '太郎', scheduledDate: '2022-04-01', completedDate: '2022-04-05', dose: 2, totalDoses: 3 },
  { id: '4', name: 'B型肝炎', child: '太郎', scheduledDate: '2022-09-01', completedDate: '2022-09-10', dose: 3, totalDoses: 3 },
  { id: '5', name: 'ヒブ', child: '太郎', scheduledDate: '2022-03-01', completedDate: '2022-03-03', dose: 1, totalDoses: 4 },
  { id: '6', name: 'ヒブ', child: '太郎', scheduledDate: '2022-04-01', completedDate: '2022-04-05', dose: 2, totalDoses: 4 },
  { id: '7', name: 'ヒブ', child: '太郎', scheduledDate: '2022-05-01', completedDate: '2022-05-08', dose: 3, totalDoses: 4 },
  { id: '8', name: 'ヒブ', child: '太郎', scheduledDate: '2023-01-01', dose: 4, totalDoses: 4 },
  { id: '9', name: 'MR (麻疹風疹)', child: '太郎', scheduledDate: '2023-06-01', dose: 1, totalDoses: 2 },
  { id: '10', name: 'BCG', child: '花子', scheduledDate: '2023-09-01', completedDate: '2023-09-05', dose: 1, totalDoses: 1 },
  { id: '11', name: 'B型肝炎', child: '花子', scheduledDate: '2023-08-01', completedDate: '2023-08-03', dose: 1, totalDoses: 3 },
  { id: '12', name: 'ヒブ', child: '花子', scheduledDate: '2023-08-01', completedDate: '2023-08-03', dose: 1, totalDoses: 4 },
  { id: '13', name: 'ヒブ', child: '花子', scheduledDate: '2023-09-01', completedDate: '2023-09-05', dose: 2, totalDoses: 4 },
  { id: '14', name: 'MR (麻疹風疹)', child: '花子', scheduledDate: '2024-08-01', dose: 1, totalDoses: 2 },
];
