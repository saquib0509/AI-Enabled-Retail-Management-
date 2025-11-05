import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import type { DailyEntry, Product, Sale, Customer } from '../types';

interface AppContextType {
  products: Product[];
  entries: DailyEntry[];
  sales: Sale[];
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchEntries: () => Promise<void>;
  fetchSales: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  addEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalPurchases'>) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock API calls - replace with actual API calls
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Petrol',
          price: 102.5,
          unit: 'liter',
          stock: 5000,
          minStockLevel: 1000,
          category: 'fuel',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Diesel',
          price: 89.75,
          unit: 'liter',
          stock: 8000,
          minStockLevel: 1500,
          category: 'fuel',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setProducts(mockProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data
      const mockEntries: DailyEntry[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          productId: '1',
          productName: 'Petrol',
          openingStock: 10000,
          sales: 5000,
          closingStock: 5000,
          pricePerUnit: 102.5,
          totalAmount: 512500,
          notes: 'Regular sales',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setEntries(mockEntries);
    } catch (err) {
      setError('Failed to fetch entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data
      const mockSales: Sale[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          customerId: '1',
          customerName: 'John Doe',
          items: [
            {
              productId: '1',
              productName: 'Petrol',
              quantity: 20,
              pricePerUnit: 102.5,
              totalPrice: 2050,
            },
          ],
          totalAmount: 2050,
          paymentMethod: 'cash',
          paymentStatus: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setSales(mockSales);
    } catch (err) {
      setError('Failed to fetch sales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          totalPurchases: 5,
          lastPurchaseDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setCustomers(mockCustomers);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newEntry: DailyEntry = {
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries(prev => [...prev, newEntry]);
      return true;
    } catch (err) {
      setError('Failed to add entry');
      console.error(err);
      return false;
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newProduct: Product = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts(prev => [...prev, newProduct]);
      return true;
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
      return false;
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSale: Sale = {
        ...sale,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSales(prev => [...prev, newSale]);
      return true;
    } catch (err) {
      setError('Failed to add sale');
      console.error(err);
      return false;
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalPurchases'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCustomer: Customer = {
        ...customer,
        id: Math.random().toString(36).substr(2, 9),
        totalPurchases: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCustomers(prev => [...prev, newCustomer]);
      return true;
    } catch (err) {
      setError('Failed to add customer');
      console.error(err);
      return false;
    }
  };

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchEntries(),
        fetchSales(),
        fetchCustomers(),
      ]);
    };
    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        entries,
        sales,
        customers,
        loading,
        error,
        fetchProducts,
        fetchEntries,
        fetchSales,
        fetchCustomers,
        addEntry,
        addProduct,
        addSale,
        addCustomer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
