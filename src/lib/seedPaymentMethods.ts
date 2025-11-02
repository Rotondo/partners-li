import { supabase } from "@/integrations/supabase/client";
import { generatePaymentMethodsWithIds } from "@/data/paymentMethodsSeed";
import { toast } from "sonner";

export async function checkExistingPaymentMethods(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  if (error) {
    console.error('Error checking existing payment methods:', error);
    return false;
  }

  return (data && data.length > 0);
}

export async function seedPaymentMethods(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Usuário não autenticado");
    throw new Error("User not authenticated");
  }

  const paymentMethods = generatePaymentMethodsWithIds();
  const ids: string[] = [];

  for (const method of paymentMethods) {
    const { error } = await supabase
      .from('payment_methods')
      .insert({
        id: method.id,
        user_id: user.id,
        data: method as any,
      });

    if (error) {
      console.error(`Error seeding ${method.company.tradeName}:`, error);
      toast.error(`Erro ao cadastrar ${method.company.tradeName}`);
    } else {
      ids.push(method.id);
    }
  }

  return ids;
}

export async function seedPaymentMethodsIfNeeded(): Promise<{
  seeded: boolean;
  count: number;
  ids: string[];
}> {
  const hasExisting = await checkExistingPaymentMethods();

  if (hasExisting) {
    return {
      seeded: false,
      count: 0,
      ids: [],
    };
  }

  const ids = await seedPaymentMethods();
  
  toast.success(`${ids.length} métodos de pagamento cadastrados com sucesso!`);

  return {
    seeded: true,
    count: ids.length,
    ids,
  };
}
