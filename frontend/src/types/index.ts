export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: 'liter' | 'kg' | 'unit';
  stock: number;
  minStockLevel: number;
  category: 'fuel' | 'lubricant' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface DailyEntry {
  id: string;
  date: string;
  productId: string;
  productName: string;
  openingStock: number;
  sales: number;
  closingStock: number;
  pricePerUnit: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  lastPurchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  date: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface InventoryMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'loss';
  quantity: number;
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  type: 'sales' | 'inventory' | 'financial' | 'custom';
  title: string;
  description?: string;
  data: Record<string, any>;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier' | 'staff';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
