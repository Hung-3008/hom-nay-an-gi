export interface FoodItem {
  id: string;
  name: string;
  icon?: string;
}

export interface FoodList {
  id: string;
  name: string;
  items: FoodItem[];
  isDefault?: boolean; // To prevent deleting default lists if desired
}

export enum AppView {
  HOME = 'HOME',
  MANAGE_LIST = 'MANAGE_LIST',
}

export const DEFAULT_LISTS: FoodList[] = [
  {
    id: 'normal',
    name: 'Lộn Xộn',
    isDefault: true,
    items: [
      { id: '1', name: 'Phở Bò', icon: 'ramen_dining' },
      { id: '2', name: 'Cơm Thu', icon: 'rice_bowl' },
      { id: '3', name: 'Bún Chả', icon: 'lunch_dining' },
      { id: '6', name: 'Bánh Mì', icon: 'bakery_dining' },
    ]
  },
  {
    id: 'healthy',
    name: 'Healthy/Ăn Kiêng',
    isDefault: true,
    items: [
      { id: '4', name: 'Gỏi Cuốn', icon: 'local_pizza' },
      { id: '5', name: 'Salad', icon: 'nutrition' },
    ]
  }
];

