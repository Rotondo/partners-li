import { Partner, LogisticPartnerData, PaymentPartnerData, MarketplacePartnerData } from "@/types/partner";
import { FieldConfig, DEFAULT_FIELD_CONFIGS } from "@/types/field-config";

const DB_KEYS = {
  PARTNERS: 'partners',
  FIELD_CONFIGS: 'fieldConfigs',
  BLUR_ACTIVE: 'blurActive',
} as const;

// ==================== PARTNERS ====================

export function savePartner(partner: Partner): void {
  const partners = getAllPartners();
  const index = partners.findIndex(p => p.id === partner.id);
  
  if (index >= 0) {
    partners[index] = partner;
  } else {
    partners.push(partner);
  }
  
  localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(partners));
}

export function getAllPartners(): Partner[] {
  const data = localStorage.getItem(DB_KEYS.PARTNERS);
  return data ? JSON.parse(data) : [];
}

export function getPartnerById(id: string): Partner | undefined {
  const partners = getAllPartners();
  return partners.find(p => p.id === id);
}

export function deletePartner(id: string): void {
  const partners = getAllPartners();
  const filtered = partners.filter(p => p.id !== id);
  localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(filtered));
}

// ==================== FIELD CONFIGS ====================

export function saveFieldConfigs(configs: FieldConfig[]): void {
  localStorage.setItem(DB_KEYS.FIELD_CONFIGS, JSON.stringify(configs));
}

export function getFieldConfigs(): FieldConfig[] {
  const data = localStorage.getItem(DB_KEYS.FIELD_CONFIGS);
  if (data) {
    return JSON.parse(data);
  }
  // Se não há dados salvos, retornar os defaults
  return DEFAULT_FIELD_CONFIGS;
}

export function getFieldConfigsByPartnerType(type: 'logistic' | 'payment' | 'marketplace'): FieldConfig[] {
  const configs = getFieldConfigs();
  return configs.filter(f => {
    // Retorna se o campo é específico desse tipo OU se está nos partnerTypes
    const isMainType = f.partnerType === type;
    const isInPartnerTypes = f.partnerTypes?.includes(type);
    return (isMainType || isInPartnerTypes) && f.enabled;
  });
}

// ==================== EXPORT/IMPORT ====================

export function exportDatabase(): string {
  const data = {
    partners: getAllPartners(),
    fieldConfigs: getFieldConfigs(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabase(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    if (data.partners) localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(data.partners));
    if (data.fieldConfigs) localStorage.setItem(DB_KEYS.FIELD_CONFIGS, JSON.stringify(data.fieldConfigs));
  } catch (error) {
    console.error('Erro ao importar banco de dados:', error);
    throw new Error('Dados inválidos');
  }
}

export function clearDatabase(): void {
  localStorage.removeItem(DB_KEYS.PARTNERS);
  localStorage.removeItem(DB_KEYS.FIELD_CONFIGS);
}

