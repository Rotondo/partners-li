# Queries para Verificar Estado do Supabase

Execute estas queries no SQL Editor do Supabase para verificar o estado atual e depois me envie os resultados:

## 1. Verificar se a tabela `partner_monthly_metrics` existe

```sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'partner_monthly_metrics'
ORDER BY ordinal_position;
```

**Resultado esperado:** Deve mostrar todas as colunas da tabela, incluindo:
- `gmv_share`, `rebate_share`, `gmv_amount`, `rebate_amount`
- `number_of_stores`, `approval_rate`, `number_of_orders` (se Migration 2 foi aplicada)

## 2. Verificar se os campos de priorização existem na tabela `partners`

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'partners'
  AND column_name IN ('is_important', 'priority_rank', 'pareto_focus')
ORDER BY column_name;
```

**Resultado esperado:** Deve mostrar os 3 campos:
- `is_important` (boolean)
- `priority_rank` (integer)
- `pareto_focus` (text)

## 3. Verificar se os campos adicionais existem na tabela `partner_monthly_metrics`

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'partner_monthly_metrics'
  AND column_name IN ('number_of_stores', 'approval_rate', 'number_of_orders')
ORDER BY column_name;
```

**Resultado esperado:** Deve mostrar os 3 campos:
- `number_of_stores` (integer)
- `approval_rate` (numeric/decimal)
- `number_of_orders` (integer)

## 4. Verificar RLS Policies da tabela `partner_monthly_metrics`

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'partner_monthly_metrics';
```

**Resultado esperado:** Deve mostrar 4 policies (SELECT, INSERT, UPDATE, DELETE)

## 5. Verificar Indexes criados

```sql
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND (tablename = 'partner_monthly_metrics' OR tablename = 'partners')
  AND (indexname LIKE '%partner_metrics%' OR indexname LIKE '%partners_important%' OR indexname LIKE '%partners_priority%')
ORDER BY tablename, indexname;
```

**Resultado esperado:** Deve mostrar os índices criados

## 6. Verificar Triggers

```sql
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'partner_monthly_metrics';
```

**Resultado esperado:** Deve mostrar o trigger `update_partner_monthly_metrics_updated_at`

---

## Resumo Rápido - Query Tudo de Uma Vez

Execute esta query para ver tudo de uma vez:

```sql
-- Verificação completa do estado do Supabase
SELECT 
  'Tabela partner_monthly_metrics existe?' as verificacao,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'partner_monthly_metrics'
    ) THEN '✅ SIM'
    ELSE '❌ NÃO'
  END as status
UNION ALL
SELECT 
  'Campos de priorização na tabela partners?',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'partners' 
        AND column_name IN ('is_important', 'priority_rank', 'pareto_focus')
    ) THEN '✅ SIM (' || 
      (SELECT COUNT(*) FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = 'partners' 
       AND column_name IN ('is_important', 'priority_rank', 'pareto_focus'))::text || ' campos)'
    ELSE '❌ NÃO'
  END
UNION ALL
SELECT 
  'Campos adicionais na tabela partner_monthly_metrics?',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'partner_monthly_metrics' 
        AND column_name IN ('number_of_stores', 'approval_rate', 'number_of_orders')
    ) THEN '✅ SIM (' || 
      (SELECT COUNT(*) FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = 'partner_monthly_metrics' 
       AND column_name IN ('number_of_stores', 'approval_rate', 'number_of_orders'))::text || ' campos)'
    ELSE '❌ NÃO'
  END
UNION ALL
SELECT 
  'RLS Policies criadas?',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'partner_monthly_metrics'
    ) THEN '✅ SIM (' || 
      (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'partner_monthly_metrics')::text || ' policies)'
    ELSE '❌ NÃO'
  END
UNION ALL
SELECT 
  'Trigger criado?',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE event_object_schema = 'public' 
        AND event_object_table = 'partner_monthly_metrics'
    ) THEN '✅ SIM'
    ELSE '❌ NÃO'
  END;
```

---

## Próximos Passos

Depois de executar as queries, me envie:
1. Os resultados das queries
2. Quaisquer erros que aparecerem

Com essas informações, posso:
- Identificar o que já está aplicado
- Identificar o que falta aplicar
- Criar as migrations necessárias para completar a configuração

