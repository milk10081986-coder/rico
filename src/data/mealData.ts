import type { Recipe } from '../types';

export const defaultRecipes: Recipe[] = [
  // 主食 - 肉
  {
    id: 'meat-1',
    name: '唐揚げ',
    category: 'main-meat',
    ingredients: ['鶏もも肉', '醤油', 'みりん', '酒', '生姜', 'にんにく', '片栗粉', 'サラダ油'],
  },
  {
    id: 'meat-2',
    name: '照り焼きチキン',
    category: 'main-meat',
    ingredients: ['鶏もも肉', '醤油', 'みりん', '砂糖', '酒'],
  },
  {
    id: 'meat-3',
    name: 'ささみカツ',
    category: 'main-meat',
    ingredients: ['鶏ささみ', 'パン粉', '卵', '小麦粉', '塩', 'こしょう', 'サラダ油'],
  },
  {
    id: 'meat-4',
    name: 'ハンバーグ',
    category: 'main-meat',
    ingredients: ['合いびき肉', '玉ねぎ', 'パン粉', '卵', '塩', 'こしょう', 'ケチャップ', 'ウスターソース'],
  },
  {
    id: 'meat-5',
    name: '酢豚（鶏）',
    category: 'main-meat',
    ingredients: ['鶏もも肉', '玉ねぎ', 'ピーマン', 'にんじん', '酢', '砂糖', '醤油', '片栗粉', 'サラダ油'],
  },
  {
    id: 'meat-6',
    name: '生姜焼き',
    category: 'main-meat',
    ingredients: ['豚ロース薄切り', '玉ねぎ', '生姜', '醤油', 'みりん', '酒'],
  },
  {
    id: 'meat-7',
    name: '餃子',
    category: 'main-meat',
    ingredients: ['豚ひき肉', 'キャベツ', 'ニラ', '餃子の皮', 'ごま油', '醤油', 'にんにく', '生姜'],
  },

  // 主食 - 魚
  {
    id: 'fish-1',
    name: '鮭のホイル焼き',
    category: 'main-fish',
    ingredients: ['鮭', '玉ねぎ', 'しめじ', 'バター', '醤油', '塩', 'こしょう'],
  },
  {
    id: 'fish-2',
    name: 'サバの味噌煮',
    category: 'main-fish',
    ingredients: ['サバ', '味噌', 'みりん', '酒', '砂糖', '生姜'],
  },
  {
    id: 'fish-3',
    name: '白身魚のフライ',
    category: 'main-fish',
    ingredients: ['白身魚（タラ等）', 'パン粉', '卵', '小麦粉', '塩', 'こしょう', 'サラダ油', 'タルタルソース'],
  },

  // 主食 - 丼
  {
    id: 'donburi-1',
    name: 'カレー',
    category: 'main-donburi',
    ingredients: ['鶏もも肉', '玉ねぎ', 'じゃがいも', 'にんじん', 'カレールー', 'サラダ油'],
  },
  {
    id: 'donburi-2',
    name: 'ハヤシライス',
    category: 'main-donburi',
    ingredients: ['牛薄切り肉', '玉ねぎ', 'マッシュルーム', 'ハヤシルー', 'バター'],
  },
  {
    id: 'donburi-3',
    name: 'シチュー',
    category: 'main-donburi',
    ingredients: ['鶏もも肉', '玉ねぎ', 'じゃがいも', 'にんじん', 'シチュールー', '牛乳', 'バター'],
  },
  {
    id: 'donburi-4',
    name: '麻婆豆腐',
    category: 'main-donburi',
    ingredients: ['豚ひき肉', '豆腐', '長ネギ', '豆板醤', '醤油', '味噌', 'ごま油', '鶏ガラスープ', '片栗粉'],
  },
  {
    id: 'donburi-5',
    name: '豚丼',
    category: 'main-donburi',
    ingredients: ['豚バラ薄切り', '玉ねぎ', '醤油', 'みりん', '酒', '砂糖'],
  },
  {
    id: 'donburi-6',
    name: '親子丼',
    category: 'main-donburi',
    ingredients: ['鶏もも肉', '玉ねぎ', '卵', '醤油', 'みりん', '酒', 'だし'],
  },
  {
    id: 'donburi-7',
    name: '天丼',
    category: 'main-donburi',
    ingredients: ['エビ', '野菜（なす・ピーマン等）', '天ぷら粉', '天丼のタレ', 'サラダ油'],
  },
  {
    id: 'donburi-8',
    name: 'オムライス',
    category: 'main-donburi',
    ingredients: ['鶏もも肉', '玉ねぎ', '卵', 'ケチャップ', 'バター', 'ご飯'],
  },
  {
    id: 'donburi-9',
    name: 'タコライス',
    category: 'main-donburi',
    ingredients: ['牛ひき肉', 'トマト', 'レタス', 'チェダーチーズ', 'サルサソース', 'タコスシーズニング'],
  },

  // 主食 - 麺類
  {
    id: 'noodle-1',
    name: '焼きそば',
    category: 'main-noodle',
    ingredients: ['豚バラ薄切り', 'キャベツ', 'もやし', '焼きそば麺', 'ウスターソース', '青のり'],
  },
  {
    id: 'noodle-2',
    name: 'うどん',
    category: 'main-noodle',
    ingredients: ['うどん', 'だし', '醤油', 'みりん', '好みのトッピング（卵・天ぷら等）'],
  },
  {
    id: 'noodle-3',
    name: 'そば',
    category: 'main-noodle',
    ingredients: ['そば', 'だし', '醤油', 'みりん', '薬味（ネギ・わさび等）'],
  },
  {
    id: 'noodle-4',
    name: '素麺',
    category: 'main-noodle',
    ingredients: ['素麺', 'だし', '醤油', 'みりん', '薬味（ネギ・生姜等）'],
  },
  {
    id: 'noodle-5',
    name: 'パスタ',
    category: 'main-noodle',
    ingredients: ['パスタ', 'にんにく', 'オリーブオイル', 'パスタソース', '塩'],
  },

  // 副菜
  {
    id: 'side-1',
    name: 'ポテトサラダ',
    category: 'side',
    ingredients: ['じゃがいも', 'マヨネーズ', '玉ねぎ', 'きゅうり', 'ハム', '塩', 'こしょう'],
  },
  {
    id: 'side-2',
    name: 'ほうれん草の胡麻和え',
    category: 'side',
    ingredients: ['ほうれん草', '白ごま', '醤油', '砂糖', 'みりん'],
  },
  {
    id: 'side-3',
    name: 'トマト',
    category: 'side',
    ingredients: ['トマト'],
  },
  {
    id: 'side-4',
    name: 'カボチャの煮物',
    category: 'side',
    ingredients: ['カボチャ', '醤油', 'みりん', '砂糖', 'だし'],
  },
  {
    id: 'side-5',
    name: 'ブロッコリー',
    category: 'side',
    ingredients: ['ブロッコリー', '塩'],
  },
  {
    id: 'side-6',
    name: 'サラダ',
    category: 'side',
    ingredients: ['レタス', 'トマト', 'きゅうり', 'ドレッシング'],
  },
  {
    id: 'side-7',
    name: '豆腐',
    category: 'side',
    ingredients: ['豆腐', '醤油', '薬味（ネギ・生姜等）'],
  },

  // お汁
  {
    id: 'soup-1',
    name: '味噌汁',
    category: 'soup',
    ingredients: ['味噌', 'だし', '豆腐', 'わかめ', '長ネギ'],
  },
  {
    id: 'soup-2',
    name: 'ワカメスープ',
    category: 'soup',
    ingredients: ['わかめ', '鶏ガラスープの素', '長ネギ', 'ごま油'],
  },
  {
    id: 'soup-3',
    name: 'かき玉汁',
    category: 'soup',
    ingredients: ['卵', 'だし', '醤油', '塩', '片栗粉', '長ネギ'],
  },
  {
    id: 'soup-4',
    name: 'コンソメスープ',
    category: 'soup',
    ingredients: ['コンソメ', '玉ねぎ', 'にんじん', '塩', 'こしょう'],
  },

  // 子どものご飯
  {
    id: 'kids-1',
    name: 'ミートボール',
    category: 'kids',
    ingredients: ['合いびき肉', 'パン粉', '卵', 'ケチャップ', 'ウスターソース', '玉ねぎ'],
  },
  {
    id: 'kids-2',
    name: '厚揚げ',
    category: 'kids',
    ingredients: ['厚揚げ', '醤油', 'みりん', '砂糖'],
  },
  {
    id: 'kids-3',
    name: '唐揚げ',
    category: 'kids',
    ingredients: ['鶏もも肉', '醤油', 'みりん', '片栗粉', 'サラダ油'],
  },
  {
    id: 'kids-4',
    name: '磯部焼き',
    category: 'kids',
    ingredients: ['切り餅', '海苔', '醤油', 'サラダ油'],
  },
  {
    id: 'kids-5',
    name: 'ポテト',
    category: 'kids',
    ingredients: ['じゃがいも', '塩', 'サラダ油'],
  },
  {
    id: 'kids-6',
    name: 'おにぎり',
    category: 'kids',
    ingredients: ['ご飯', '海苔', '塩', '好みの具（鮭・梅等）'],
  },
];

export const categoryLabels: Record<string, string> = {
  'main-meat': '肉',
  'main-fish': '魚',
  'main-donburi': '丼',
  'main-noodle': '麺類',
  side: '副菜',
  soup: 'お汁',
  kids: '子どものご飯',
};

export const mainCategories = ['main-meat', 'main-fish', 'main-donburi', 'main-noodle'] as const;
