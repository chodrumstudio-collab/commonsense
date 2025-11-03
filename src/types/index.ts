export interface Fact {
  id: string;
  title: string;
  category: Category;
  shortDescription: string;
  fullContent: string;
  relatedFacts: string[];
  date?: string; // 날짜 필드 (YYYY-MM-DD 형식)
}

export type Category = '과학' | '역사' | '생활' | '문화' | '건강' | '지리';

export interface CategoryInfo {
  name: Category;
  emoji: string;
  color: string;
}
