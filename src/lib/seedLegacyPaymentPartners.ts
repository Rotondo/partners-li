import { supabase } from "@/integrations/supabase/client";
import { generatePaymentMethodsWithIds } from "@/data/paymentMethodsSeed";
import { toast } from "sonner";
import { Partner } from "@/types/partner";

/**
 * Maps a granular PaymentMethod to a simplified Partner (payment category)
 */
function mapPaymentMethodToPartner(method: any): Partner {
  const creditFees = method.fees?.creditCard?.feesByRevenue?.[0];
  const debitFees = method.fees?.debitCard;
  const pixFees = method.fees?.pix;
  const boletoFees = method.fees?.boleto;
  
  const partner: Partner = {
    id: method.id,
    name: method.company?.tradeName || method.company?.legalName || "Sem nome",
    categories: ['payment'],
    status: method.status === 'active' ? 'active' : 
            method.status === 'inactive' ? 'inactive' : 
            method.status === 'pending' ? 'pending' : 'active',
    startDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    customFields: {},
    contactFields: {},
    payment: {
      category: 'payment' as const,
      fees: {
        creditCard: {
          vista: {
            mdr: creditFees?.baseRate || 0,
          },
        },
        debitCard: {
          mdr: debitFees?.baseRate || 0,
        },
        pix: {
          mdr: pixFees?.baseRate || 0,
        },
        boleto: {
          fixedFee: boletoFees?.fixedFee || 0,
        },
        anticipationRate: method.fees?.creditCard?.anticipation?.feePercentage || 0,
        chargebackFee: method.fees?.creditCard?.chargeback?.fee || 0,
      },
      settlement: {
        credit: method.settlement?.creditCard?.default || 30,
        debit: method.settlement?.debitCard?.default || 1,
        pix: method.settlement?.pix?.default || 1,
        boleto: method.settlement?.boleto?.default || 2,
      },
      supportedMethods: [
        ...(method.fees?.creditCard ? ['credit' as const] : []),
        ...(method.fees?.debitCard ? ['debit' as const] : []),
        ...(method.fees?.pix ? ['pix' as const] : []),
        ...(method.fees?.boleto ? ['boleto' as const] : []),
      ],
      takeRate: method.integration?.platformSplit?.takeRatePercentage || 0,
    }
  };
  
  return partner;
}

/**
 * Seeds the partners table with simplified payment partner data
 * derived from the granular payment methods seed
 */
export async function seedLegacyPaymentPartnersFromGranular(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const paymentMethods = generatePaymentMethodsWithIds();
  const ids: string[] = [];

  for (const method of paymentMethods) {
    const partner = mapPaymentMethodToPartner(method);
    
    const { error } = await supabase
      .from('partners')
      .upsert({
        id: partner.id,
        user_id: user.id,
        name: partner.name,
        type: 'payment',
        data: partner as any,
      }, { onConflict: 'id' });

    if (error) {
      console.error(`Erro ao cadastrar ${partner.name}:`, error);
      toast.error(`Erro ao cadastrar ${partner.name}`);
    } else {
      ids.push(partner.id);
    }
  }

  return ids;
}

/**
 * Seeds legacy payment partners only if needed (checks for existing data)
 */
export async function seedLegacyPaymentPartnersIfNeeded(): Promise<{
  seeded: boolean;
  count: number;
  ids: string[];
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if we already have payment partners
  const { data, error } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', 'payment')
    .limit(5);

  if (error) {
    console.error('Error checking existing partners:', error);
    return { seeded: false, count: 0, ids: [] };
  }

  // If we have 5+ payment partners, consider it already seeded
  if (data && data.length >= 5) {
    return { seeded: false, count: 0, ids: [] };
  }

  const ids = await seedLegacyPaymentPartnersFromGranular();
  
  toast.success(`${ids.length} parceiros de pagamento cadastrados com sucesso!`);

  return {
    seeded: true,
    count: ids.length,
    ids,
  };
}
