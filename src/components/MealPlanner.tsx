import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingBasket,
  BookOpen,
  Plus,
  Trash2,
  Check,
  X,
  Utensils,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Recipe, DayMeal, MealCategory } from '../types';
import { defaultRecipes, categoryLabels, mainCategories } from '../data/mealData';

const STORAGE_KEY_MEALS = 'meal-plan-v1';
const STORAGE_KEY_RECIPES = 'meal-custom-recipes-v1';
const STORAGE_KEY_SHOPPING = 'meal-shopping-v1';

type Tab = 'plan' | 'shopping' | 'repertoire';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

interface ShoppingEntry {
  id: string;
  text: string;
  checked: boolean;
}

export default function MealPlanner() {
  const [tab, setTab] = useState<Tab>('plan');
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [meals, setMeals] = useState<DayMeal[]>(() =>
    loadFromStorage<DayMeal[]>(STORAGE_KEY_MEALS, [])
  );
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() =>
    loadFromStorage<Recipe[]>(STORAGE_KEY_RECIPES, [])
  );
  const [shopping, setShopping] = useState<ShoppingEntry[]>(() =>
    loadFromStorage<ShoppingEntry[]>(STORAGE_KEY_SHOPPING, [])
  );

  // Recipe add form state
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<MealCategory>('main-meat');
  const [newIngredients, setNewIngredients] = useState('');

  const allRecipes = [...defaultRecipes, ...customRecipes];

  useEffect(() => { saveToStorage(STORAGE_KEY_MEALS, meals); }, [meals]);
  useEffect(() => { saveToStorage(STORAGE_KEY_RECIPES, customRecipes); }, [customRecipes]);
  useEffect(() => { saveToStorage(STORAGE_KEY_SHOPPING, shopping); }, [shopping]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getMeal = useCallback(
    (date: Date): DayMeal => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return (
        meals.find((m) => m.date === dateStr) ?? {
          date: dateStr,
          isNightShift: false,
        }
      );
    },
    [meals]
  );

  const updateMeal = (date: Date, patch: Partial<DayMeal>) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setMeals((prev) => {
      const existing = prev.find((m) => m.date === dateStr);
      if (existing) {
        return prev.map((m) => (m.date === dateStr ? { ...m, ...patch } : m));
      }
      return [...prev, { date: dateStr, isNightShift: false, ...patch }];
    });
  };

  const toggleNightShift = (date: Date) => {
    const meal = getMeal(date);
    const next = !meal.isNightShift;
    const patch: Partial<DayMeal> = { isNightShift: next };
    // If switching to night shift and current main is not donburi, clear it
    if (next && meal.mainId) {
      const recipe = allRecipes.find((r) => r.id === meal.mainId);
      if (recipe && recipe.category !== 'main-donburi') {
        patch.mainId = undefined;
      }
    }
    updateMeal(date, patch);
  };

  const autoGenerate = () => {
    const newMeals: DayMeal[] = weekDays.map((day) => {
      const existing = getMeal(day);
      const isNightShift = existing.isNightShift;

      const mainPool = allRecipes.filter((r) =>
        isNightShift
          ? r.category === 'main-donburi'
          : mainCategories.includes(r.category as typeof mainCategories[number])
      );
      const sidePool = allRecipes.filter((r) => r.category === 'side');
      const soupPool = allRecipes.filter((r) => r.category === 'soup');
      const kidsPool = allRecipes.filter((r) => r.category === 'kids');

      return {
        date: format(day, 'yyyy-MM-dd'),
        isNightShift,
        mainId: pickRandom(mainPool)?.id,
        sideId: pickRandom(sidePool)?.id,
        soupId: pickRandom(soupPool)?.id,
        kidsId: pickRandom(kidsPool)?.id,
      };
    });
    setMeals((prev) => {
      const otherWeek = prev.filter(
        (m) => !weekDays.some((d) => format(d, 'yyyy-MM-dd') === m.date)
      );
      return [...otherWeek, ...newMeals];
    });
  };

  const generateShoppingList = () => {
    const ingredientSet = new Set<string>();
    weekDays.forEach((day) => {
      const meal = getMeal(day);
      const ids = [meal.mainId, meal.sideId, meal.soupId, meal.kidsId].filter(Boolean);
      ids.forEach((id) => {
        const recipe = allRecipes.find((r) => r.id === id);
        recipe?.ingredients.forEach((ing) => ingredientSet.add(ing));
      });
    });
    const entries: ShoppingEntry[] = Array.from(ingredientSet).map((ing) => ({
      id: `${Date.now()}-${ing}`,
      text: ing,
      checked: false,
    }));
    setShopping(entries);
    setTab('shopping');
  };

  const toggleShoppingItem = (id: string) => {
    setShopping((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const deleteShoppingItem = (id: string) => {
    setShopping((prev) => prev.filter((s) => s.id !== id));
  };

  const addCustomRecipe = () => {
    if (!newName.trim()) return;
    const recipe: Recipe = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      ingredients: newIngredients
        .split(/[,、\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      isCustom: true,
    };
    setCustomRecipes((prev) => [...prev, recipe]);
    setNewName('');
    setNewIngredients('');
    setShowAddRecipe(false);
  };

  const deleteCustomRecipe = (id: string) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const today = new Date();

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
        {([
          { key: 'plan', label: '献立', icon: <Utensils size={15} /> },
          { key: 'shopping', label: '買い物リスト', icon: <ShoppingBasket size={15} /> },
          { key: 'repertoire', label: 'レパートリー', icon: <BookOpen size={15} /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ===== PLAN TAB ===== */}
      {tab === 'plan' && (
        <div className="flex flex-col gap-3">
          {/* Week navigation */}
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
            <button
              onClick={() => setWeekStart((w) => subWeeks(w, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 text-center">
              <span className="font-semibold text-gray-800 text-sm">
                {format(weekStart, 'M月d日', { locale: ja })}
                {' 〜 '}
                {format(addDays(weekStart, 6), 'M月d日（EEE）', { locale: ja })}
              </span>
            </div>
            <button
              onClick={() => setWeekStart((w) => addWeeks(w, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              className="text-xs text-orange-500 hover:text-orange-600 font-medium px-2 py-1 rounded-lg hover:bg-orange-50"
            >
              今週
            </button>
          </div>

          {/* Auto generate + shopping list buttons */}
          <div className="flex gap-2">
            <button
              onClick={autoGenerate}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              <RefreshCw size={15} />
              自動で献立を生成
            </button>
            <button
              onClick={generateShoppingList}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              <ShoppingBasket size={15} />
              買い物リストを作成
            </button>
          </div>

          {/* Day cards */}
          <div className="flex flex-col gap-2">
            {weekDays.map((day) => {
              const meal = getMeal(day);
              const isToday = isSameDay(day, today);
              const isNight = meal.isNightShift;

              const mainPool = allRecipes.filter((r) =>
                isNight
                  ? r.category === 'main-donburi'
                  : mainCategories.includes(r.category as typeof mainCategories[number])
              );

              return (
                <div
                  key={meal.date}
                  className={`bg-white rounded-xl shadow-sm border transition-all ${
                    isToday
                      ? 'border-orange-300 ring-1 ring-orange-200'
                      : 'border-gray-100'
                  }`}
                >
                  {/* Day header */}
                  <div
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-t-xl ${
                      isToday ? 'bg-orange-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isToday ? 'text-orange-600' : 'text-gray-700'
                        }`}
                      >
                        {format(day, 'M/d（EEE）', { locale: ja })}
                      </span>
                      {isToday && (
                        <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                          今日
                        </span>
                      )}
                    </div>
                    <div className="ml-auto">
                      <button
                        onClick={() => toggleNightShift(day)}
                        title="夜勤の日"
                        className={`text-lg px-2 py-0.5 rounded-lg transition-colors ${
                          isNight
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        🌛
                      </button>
                    </div>
                  </div>

                  {/* Meal selectors */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-4 py-3">
                    <MealSelect
                      label={`主食${isNight ? '（丼）' : ''}`}
                      value={meal.mainId}
                      options={mainPool}
                      onChange={(id) => updateMeal(day, { mainId: id })}
                    />
                    <MealSelect
                      label="副菜"
                      value={meal.sideId}
                      options={allRecipes.filter((r) => r.category === 'side')}
                      onChange={(id) => updateMeal(day, { sideId: id })}
                    />
                    <MealSelect
                      label="お汁"
                      value={meal.soupId}
                      options={allRecipes.filter((r) => r.category === 'soup')}
                      onChange={(id) => updateMeal(day, { soupId: id })}
                    />
                    <MealSelect
                      label="子どものご飯"
                      value={meal.kidsId}
                      options={allRecipes.filter((r) => r.category === 'kids')}
                      onChange={(id) => updateMeal(day, { kidsId: id })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== SHOPPING TAB ===== */}
      {tab === 'shopping' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">
              今週の買い物リスト
            </h2>
            <span className="text-xs text-gray-400">
              {shopping.filter((s) => !s.checked).length} / {shopping.length} 件
            </span>
          </div>

          {shopping.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <ShoppingBasket size={40} className="opacity-30" />
              <p className="text-sm">
                献立タブで「買い物リストを作成」を押してください
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {shopping.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <button
                    onClick={() => toggleShoppingItem(item.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {item.checked && <Check size={11} className="text-white" />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      item.checked ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteShoppingItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {shopping.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() =>
                  setShopping((prev) =>
                    prev.map((s) => ({ ...s, checked: true }))
                  )
                }
                className="flex-1 text-xs text-gray-500 hover:text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                すべてチェック
              </button>
              <button
                onClick={() => setShopping([])}
                className="flex-1 text-xs text-red-400 hover:text-red-600 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                リストを消去
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== REPERTOIRE TAB ===== */}
      {tab === 'repertoire' && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowAddRecipe(true)}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            <Plus size={16} />
            新しいレシピを追加
          </button>

          {showAddRecipe && (
            <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-gray-800 text-sm">新しいレシピ</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-medium">料理名</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例：チキンソテー"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-medium">カテゴリ</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MealCategory)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-medium">
                  材料（カンマ・改行で区切る）
                </label>
                <textarea
                  value={newIngredients}
                  onChange={(e) => setNewIngredients(e.target.value)}
                  placeholder="例：鶏もも肉、塩、こしょう、オリーブオイル"
                  rows={3}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addCustomRecipe}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  追加
                </button>
                <button
                  onClick={() => setShowAddRecipe(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* Recipe list by category */}
          {(Object.entries(categoryLabels) as [MealCategory, string][]).map(
            ([cat, label]) => {
              const recipes = allRecipes.filter((r) => r.category === cat);
              return (
                <div
                  key={cat}
                  className="bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="px-4 py-2.5 bg-gray-50 rounded-t-xl border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">
                      {label}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {recipes.length}品
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    {recipes.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-start gap-3 px-4 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            {r.name}
                            {r.isCustom && (
                              <span className="ml-1.5 text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                                追加
                              </span>
                            )}
                          </p>
                          {r.ingredients.length > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {r.ingredients.join('、')}
                            </p>
                          )}
                        </div>
                        {r.isCustom && (
                          <button
                            onClick={() => deleteCustomRecipe(r.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

interface MealSelectProps {
  label: string;
  value?: string;
  options: Recipe[];
  onChange: (id: string | undefined) => void;
}

function MealSelect({ label, value, options, onChange }: MealSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 truncate"
      >
        <option value="">未選択</option>
        {options.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
