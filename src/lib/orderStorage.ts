import fs from 'fs';
import path from 'path';

// Sipariş tipi
export interface Order {
  id: string;
  orderId: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  zipCode?: string;
  createdAt: string;
  items: OrderItem[];
}

// Sipariş ürün tipi
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

// Dosya yolu
const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Veri dizinini oluştur
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
};

// Tüm siparişleri getir
export const getAllOrders = (): Order[] => {
  ensureDataDir();
  
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Siparişler okunamadı:', error);
    return [];
  }
};

// Sipariş ekle
export const addOrder = (order: Order): Order => {
  ensureDataDir();
  
  try {
    const orders = getAllOrders();
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return order;
  } catch (error) {
    console.error('Sipariş eklenemedi:', error);
    throw new Error('Sipariş kaydedilemedi');
  }
};

// Sipariş getir
export const getOrderById = (orderId: string): Order | null => {
  const orders = getAllOrders();
  const order = orders.find(o => o.orderId === orderId);
  return order || null;
};

// Kullanıcının siparişlerini getir
export const getOrdersByUser = (email: string): Order[] => {
  const orders = getAllOrders();
  return orders.filter(o => o.customerEmail === email);
};

// Sipariş durumunu güncelle
export const updateOrderStatus = (orderId: string, status: string, paymentStatus?: string): Order | null => {
  ensureDataDir();
  
  try {
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    orders[orderIndex].status = status;
    
    if (paymentStatus) {
      orders[orderIndex].paymentStatus = paymentStatus;
    }
    
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return orders[orderIndex];
  } catch (error) {
    console.error('Sipariş durumu güncellenemedi:', error);
    throw new Error('Sipariş durumu güncellenemedi');
  }
}; 