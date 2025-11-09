import { supabase } from "@/integrations/supabase/client";
import { ExpectationMilestone, MilestoneCheckbox } from "@/types/expectations";

const INITIAL_MILESTONES = [
  {
    category: 'marketplace' as const,
    deadline_days: 30,
    title: 'Mapeamento de pontos de contato e abertura de portas com marketplaces estratégicos',
    opportunities_risks: 'Estamos iniciando testes de integração com MeLi e Shopee. Falta um ponto de contato claro para escalar e afunir a experiência de onboarding — junto com @João Lander',
    status: 'in_progress' as const,
    priority: 'high' as const,
    checkboxes: [
      'Falar com @João Lander sobre onboarding',
      'Mapear integração MeLi',
      'Mapear integração Shopee',
    ]
  },
  {
    category: 'logistic' as const,
    deadline_days: 30,
    title: 'Hand-off de Programas e Processos de Logística',
    opportunities_risks: 'Falar com @raisa, @ray, @tuffy, @heldt para ganho de contexto sobre parceiros de logística e pagamento — e quais processos existem. Quais funcionam e quais não funcionam.',
    status: 'in_progress' as const,
    priority: 'high' as const,
    checkboxes: [
      'Agendar reunião com @raisa',
      'Conversar com @ray',
      'Falar com @tuffy',
      'Contato com @heldt',
    ]
  },
  {
    category: 'payment' as const,
    deadline_days: 30,
    title: 'Hand-off de Programas e Processos de Pagamento',
    opportunities_risks: 'Ganho de contexto sobre parceiros e funcionamento dos fluxos de pagamento',
    status: 'in_progress' as const,
    priority: 'high' as const,
    checkboxes: [
      'Conversar com equipe responsável',
      'Mapear fluxos existentes',
    ]
  },
  {
    category: 'logistic' as const,
    deadline_days: 30,
    title: 'Análise de concentração de receita e adoção de parceiros de Logística',
    opportunities_risks: 'Entenda profundamente o paretto dos parceiros de logística e pagamentos, e quais os gargalos de adoção e/ou faturamento nos seguram de crescer com eles — #squad-dados — @Pedro Watanabe',
    status: 'not_started' as const,
    priority: 'medium' as const,
    checkboxes: [
      'Levantar dados com @Pedro Watanabe',
      'Identificar paretto dos parceiros',
      'Mapear gargalos de adoção',
    ]
  },
  {
    category: 'payment' as const,
    deadline_days: 30,
    title: 'Análise de concentração de receita e adoção de meios de pagamento',
    opportunities_risks: 'Identificar gargalos de adoção/faturamento, análise detalhada dos parceiros',
    status: 'not_started' as const,
    priority: 'medium' as const,
    checkboxes: [
      'Levantamento com time de dados',
      'Análise de paretto',
    ]
  },
  {
    category: 'marketplace' as const,
    deadline_days: 60,
    title: 'Planejamento de GTM em parceria com Mercado Livre e/ou Shopee para Janeiro',
    opportunities_risks: 'Destravando ofertas especiais / novos canais de distribuição para além dos nossos proprietários, ao lado do time de Marketing de Produto',
    status: 'not_started' as const,
    priority: 'medium' as const,
    checkboxes: [
      'Definir ofertas especiais',
      'Mapear novos canais de distribuição',
      'Alinhar com time de Marketing',
    ]
  },
  {
    category: 'logistic' as const,
    deadline_days: 60,
    title: 'Priorização de ajustes em programas/processos de logística existentes',
    opportunities_risks: 'A partir do potencial impacto para a base de clientes',
    status: 'not_started' as const,
    priority: 'medium' as const,
    checkboxes: [
      'Definir critérios de priorização',
      'Mapear ajustes necessários',
    ]
  },
  {
    category: 'payment' as const,
    deadline_days: 60,
    title: 'Priorização de ajustes em processos de pagamento',
    opportunities_risks: 'Foco nos meios com maior impacto para expansão e satisfação do cliente',
    status: 'not_started' as const,
    priority: 'medium' as const,
    checkboxes: [
      'Definir próximos ajustes',
      'Criar roadmap de melhorias',
    ]
  },
  {
    category: 'marketplace' as const,
    deadline_days: 90,
    title: 'Execução de Plano de GTM em parceria com Mercado Livre e/ou Shopee',
    opportunities_risks: 'Executando em conjunto com o time de marketing',
    status: 'not_started' as const,
    priority: 'low' as const,
    checkboxes: [
      'Lançar ofertas',
      'Ativar canais de distribuição',
    ]
  },
  {
    category: 'marketplace' as const,
    deadline_days: 90,
    title: 'Colaboração no planejamento de canais para 2026',
    opportunities_risks: 'Identificando oportunidades de expansão com os parceiros existentes, e indícios de canais novos a serem buscados',
    status: 'not_started' as const,
    priority: 'low' as const,
    checkboxes: [
      'Identificar oportunidades de expansão',
      'Mapear novos canais',
    ]
  },
  {
    category: 'logistic' as const,
    deadline_days: 90,
    title: 'Execução de ajustes mapeados em logística',
    opportunities_risks: 'A partir do potencial impacto para a base de clientes',
    status: 'not_started' as const,
    priority: 'low' as const,
    checkboxes: [
      'Implementar melhorias prioritárias',
      'Acompanhar resultados',
    ]
  },
  {
    category: 'payment' as const,
    deadline_days: 90,
    title: 'Execução dos ajustes em meios de pagamento',
    opportunities_risks: 'Implementar melhorias críticas nos fluxos e parcerias',
    status: 'not_started' as const,
    priority: 'low' as const,
    checkboxes: [
      'Implementar melhorias',
      'Acompanhar evolução',
    ]
  },
];

export async function seedExpectations(userId: string) {
  try {
    // Insert milestones
    for (const milestone of INITIAL_MILESTONES) {
      const { checkboxes, ...milestoneData } = milestone;
      
      const { data: insertedMilestone, error: milestoneError } = await supabase
        .from('expectation_milestones')
        .insert({
          ...milestoneData,
          user_id: userId,
        })
        .select()
        .single();

      if (milestoneError) {
        console.error('Error inserting milestone:', milestoneError);
        continue;
      }

      // Insert checkboxes for this milestone
      if (checkboxes && checkboxes.length > 0 && insertedMilestone) {
        const checkboxData = checkboxes.map(label => ({
          milestone_id: insertedMilestone.id,
          label,
        }));

        const { error: checkboxError } = await supabase
          .from('milestone_checkboxes')
          .insert(checkboxData);

        if (checkboxError) {
          console.error('Error inserting checkboxes:', checkboxError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error seeding expectations:', error);
    return { success: false, error };
  }
}
