export type LabelType = 'family' | 'nursery' | 'work' | 'todo';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime?: string;
  endTime?: string;
  label: LabelType;
  color: string;
  allDay?: boolean;
}

export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  createdAt: string;
}

export interface DriveFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  size: string;
  date: string;
  thumbnail?: string;
}

export type ChildName = '太郎' | '花子';

export interface GrowthRecord {
  id: string;
  child: ChildName;
  date: string;
  height: number; // cm
  weight: number; // kg
}

export interface Vaccine {
  id: string;
  name: string;
  child: ChildName;
  scheduledDate: string;
  completedDate?: string;
  dose: number;
  totalDoses: number;
}

export type ViewMode = 'calendar' | 'shopping' | 'files' | 'growth' | 'vaccination' | 'meal';

export type MealCategory = 'main-meat' | 'main-fish' | 'main-donburi' | 'main-noodle' | 'side' | 'soup' | 'kids';

export interface Recipe {
  id: string;
  name: string;
  category: MealCategory;
  ingredients: string[];
  isCustom?: boolean;
}

export interface DayMeal {
  date: string; // YYYY-MM-DD
  isNightShift: boolean;
  mainId?: string;
  sideId?: string;
  soupId?: string;
  kidsId?: string;
}
