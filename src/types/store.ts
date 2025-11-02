// Types for Stores (Lojas) management

export type StoreStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type StoreType = 'physical' | 'online' | 'hybrid';

export interface Store {
  id: string;
  user_id: string;
  name: string;
  store_type: StoreType;
  status: StoreStatus;

  // Basic Information
  cnpj?: string;
  trade_name?: string; // Nome fantasia
  legal_name?: string; // Razão social

  // Address
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };

  // Contact
  phone?: string;
  email?: string;
  website?: string;

  // Business Hours
  business_hours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  // Partnerships
  logistic_partners?: string[]; // IDs of partners
  payment_partners?: string[]; // IDs of partners
  marketplace_partners?: string[]; // IDs of partners

  // Metrics
  metrics?: {
    monthly_revenue?: number;
    monthly_orders?: number;
    average_ticket?: number;
    customer_count?: number;
  };

  // Additional Info
  description?: string;
  notes?: string;
  tags?: string[];

  // Strategic Analysis
  tier?: 'small' | 'medium' | 'large' | 'enterprise';

  created_at: Date;
  updated_at: Date;
}

export type NewStore = Omit<Store, 'id' | 'created_at' | 'updated_at'>;

export const STORE_TYPES: { value: StoreType; label: string }[] = [
  { value: 'physical', label: 'Loja Física' },
  { value: 'online', label: 'E-commerce' },
  { value: 'hybrid', label: 'Híbrida' },
];

export const STORE_STATUSES: { value: StoreStatus; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }[] = [
  { value: 'active', label: 'Ativa', variant: 'default' },
  { value: 'inactive', label: 'Inativa', variant: 'secondary' },
  { value: 'pending', label: 'Pendente', variant: 'outline' },
  { value: 'suspended', label: 'Suspensa', variant: 'destructive' },
];

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
