import { generatePaymentPartnersWithIds } from '@/data/paymentPartnersSeed';
import { savePartner } from '@/lib/db';
import { PaymentPartner } from '@/types/partner';

/**
 * Insere os 5 parceiros de pagamento no banco de dados
 *
 * IMPORTANTE: Executar apenas UMA VEZ para evitar duplicação
 *
 * @returns Array com os IDs dos parceiros inseridos
 */
export async function seedPaymentPartners(): Promise<string[]> {
  const partners = generatePaymentPartnersWithIds();
  const insertedIds: string[] = [];

  console.log('🌱 Iniciando seed de parceiros de pagamento...');

  for (const partner of partners) {
    try {
      // Converter PaymentPartner para Partner format esperado pelo savePartner
      const partnerToSave = {
        ...partner,
        payment: {
          category: 'payment' as const,
          fees: partner.fees,
          settlement: partner.settlement,
          supportedMethods: partner.supportedMethods,
          takeRate: partner.takeRate,
          performance: partner.performance,
          competitiveAdvantages: partner.competitiveAdvantages,
          notes: partner.notes
        }
      };

      await savePartner(partnerToSave);
      insertedIds.push(partner.id);
      console.log(`✅ ${partner.name} inserido com sucesso (ID: ${partner.id})`);
    } catch (error) {
      console.error(`❌ Erro ao inserir ${partner.name}:`, error);
    }
  }

  console.log(`\n🎉 Seed completo! ${insertedIds.length}/${partners.length} parceiros inseridos.`);

  return insertedIds;
}

/**
 * Verifica se já existem parceiros de pagamento cadastrados
 * Útil para evitar duplicação
 */
export async function checkExistingPaymentPartners(): Promise<boolean> {
  try {
    const { getAllPartners } = await import('@/lib/db');
    const allPartners = await getAllPartners();
    const paymentPartners = allPartners.filter(p => p.categories.includes('payment'));

    if (paymentPartners.length > 0) {
      console.log(`⚠️  Já existem ${paymentPartners.length} parceiros de pagamento cadastrados:`);
      paymentPartners.forEach(p => console.log(`   - ${p.name}`));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao verificar parceiros existentes:', error);
    return false;
  }
}

/**
 * Função principal: verifica duplicação e insere se necessário
 */
export async function seedPaymentPartnersIfNeeded(): Promise<{
  seeded: boolean;
  count: number;
  ids: string[];
}> {
  const hasExisting = await checkExistingPaymentPartners();

  if (hasExisting) {
    console.log('⏭️  Pulando seed - parceiros já existem');
    return { seeded: false, count: 0, ids: [] };
  }

  console.log('🚀 Nenhum parceiro de pagamento encontrado. Iniciando seed...\n');
  const ids = await seedPaymentPartners();

  return { seeded: true, count: ids.length, ids };
}
