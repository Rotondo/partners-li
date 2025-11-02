import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCalculation {
  partner_id: string;
  performance_score: number;
  engagement_score: number;
  commercial_score: number;
  overall_score: number;
  health_status: 'excellent' | 'good' | 'warning' | 'critical';
  last_activity_date: string | null;
  days_since_last_contact: number;
  meetings_this_month: number;
  open_issues_count: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`Calculating health scores for user: ${user.id}`);

    // Get all partners for this user
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('id, name, type, user_id')
      .eq('user_id', user.id);

    if (partnersError) {
      console.error('Error fetching partners:', partnersError);
      throw partnersError;
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const healthCalculations: HealthCalculation[] = [];
    const alerts = [];

    // OPTIMIZATION: Fetch all activities and tasks for all partners at once (2 queries instead of N*2)
    const partnerIds = (partners || []).map(p => p.id);

    const { data: allActivities } = await supabase
      .from('partner_activities')
      .select('*')
      .in('partner_id', partnerIds)
      .order('created_at', { ascending: false });

    const { data: allTasks } = await supabase
      .from('partner_tasks')
      .select('*')
      .in('partner_id', partnerIds);

    // Group activities and tasks by partner_id for O(1) lookup
    const activitiesByPartner = new Map<string, any[]>();
    const tasksByPartner = new Map<string, any[]>();

    (allActivities || []).forEach(activity => {
      if (!activitiesByPartner.has(activity.partner_id)) {
        activitiesByPartner.set(activity.partner_id, []);
      }
      activitiesByPartner.get(activity.partner_id)!.push(activity);
    });

    (allTasks || []).forEach(task => {
      if (!tasksByPartner.has(task.partner_id)) {
        tasksByPartner.set(task.partner_id, []);
      }
      tasksByPartner.get(task.partner_id)!.push(task);
    });

    for (const partner of partners || []) {
      // Get activities and tasks for this partner from pre-fetched data
      const activities = activitiesByPartner.get(partner.id) || [];
      const tasks = tasksByPartner.get(partner.id) || [];

      // Calculate metrics
      const completedActivities = activities.filter(a => a.status === 'completed');
      const recentActivities = activities.filter(a =>
        new Date(a.created_at) >= thirtyDaysAgo
      );
      
      const lastActivity = activities.length > 0 ? activities[0] : null;
      const lastActivityDate = lastActivity ? new Date(lastActivity.created_at) : null;
      const daysSinceContact = lastActivityDate 
        ? Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const meetingsThisMonth = recentActivities.filter(a =>
        a.activity_type === 'meeting' || a.activity_type === 'call' || a.activity_type === 'video_call'
      ).length;

      const openIssues = tasks.filter(t =>
        t.status !== 'done' && t.priority === 'high'
      ).length;

      // Calculate scores (0-100)
      const performanceScore = Math.min(100, Math.max(0, 
        100 - (openIssues * 10) - (daysSinceContact > 30 ? 20 : 0)
      ));

      const engagementScore = Math.min(100, Math.max(0,
        (meetingsThisMonth * 20) + (recentActivities.length * 5)
      ));

      const commercialScore = Math.min(100, Math.max(0,
        (completedActivities.length * 10) - (daysSinceContact * 2)
      ));

      const overallScore = Math.round(
        (performanceScore * 0.4) + 
        (engagementScore * 0.3) + 
        (commercialScore * 0.3)
      );

      // Determine health status
      let healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
      if (overallScore >= 80) healthStatus = 'excellent';
      else if (overallScore >= 60) healthStatus = 'good';
      else if (overallScore >= 40) healthStatus = 'warning';
      else healthStatus = 'critical';

      healthCalculations.push({
        partner_id: partner.id,
        performance_score: Math.round(performanceScore),
        engagement_score: Math.round(engagementScore),
        commercial_score: Math.round(commercialScore),
        overall_score: overallScore,
        health_status: healthStatus,
        last_activity_date: lastActivityDate?.toISOString().split('T')[0] || null,
        days_since_last_contact: daysSinceContact,
        meetings_this_month: meetingsThisMonth,
        open_issues_count: openIssues,
      });

      // Generate alerts based on health status
      if (daysSinceContact > 30) {
        alerts.push({
          partner_id: partner.id,
          user_id: user.id,
          alert_type: 'no_contact',
          severity: daysSinceContact > 60 ? 'high' : 'medium',
          title: 'Sem contato há muito tempo',
          message: `Não há atividades com ${partner.name} há ${daysSinceContact} dias.`,
          metadata: { days_since_contact: daysSinceContact }
        });
      }

      if (openIssues > 3) {
        alerts.push({
          partner_id: partner.id,
          user_id: user.id,
          alert_type: 'high_priority_issues',
          severity: 'high',
          title: 'Muitas tarefas de alta prioridade',
          message: `${partner.name} tem ${openIssues} tarefas de alta prioridade em aberto.`,
          metadata: { open_issues_count: openIssues }
        });
      }

      if (healthStatus === 'critical') {
        alerts.push({
          partner_id: partner.id,
          user_id: user.id,
          alert_type: 'health_critical',
          severity: 'critical',
          title: 'Saúde da parceria crítica',
          message: `A parceria com ${partner.name} está em estado crítico (score: ${overallScore}).`,
          metadata: { overall_score: overallScore, health_status: healthStatus }
        });
      }
    }

    // Upsert health metrics
    if (healthCalculations.length > 0) {
      const { error: metricsError } = await supabase
        .from('partner_health_metrics')
        .upsert(
          healthCalculations.map(calc => ({
            ...calc,
            user_id: user.id,
            calculated_at: now.toISOString()
          })),
          { onConflict: 'partner_id' }
        );

      if (metricsError) {
        console.error('Error upserting health metrics:', metricsError);
        throw metricsError;
      }
    }

    // Insert new alerts (avoiding duplicates)
    if (alerts.length > 0) {
      const { error: alertsError } = await supabase
        .from('partner_alerts')
        .insert(alerts);

      if (alertsError) {
        console.error('Error inserting alerts:', alertsError);
      }
    }

    console.log(`Calculated health scores for ${healthCalculations.length} partners`);
    console.log(`Generated ${alerts.length} new alerts`);

    return new Response(
      JSON.stringify({
        success: true,
        partners_processed: healthCalculations.length,
        alerts_generated: alerts.length,
        health_calculations: healthCalculations
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in calculate-health-scores:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});