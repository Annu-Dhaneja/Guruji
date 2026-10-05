import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

let serverSupabase: SupabaseClient | null = null;

if (isServerSupabaseConfigured) {
  try {
    serverSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });
    console.log('[Supabase Server] Connected to Supabase backend service.');
  } catch (err) {
    console.warn('[Supabase Server] Initialization error:', err);
  }
}

export function getServerSupabase(): SupabaseClient | null {
  return serverSupabase;
}

/**
 * Sync Order to Supabase if available
 */
export async function syncOrderToSupabase(orderData: any) {
  if (!serverSupabase) return;
  try {
    const { error } = await serverSupabase
      .from('orders')
      .upsert({
        id: orderData.id,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        payment_status: orderData.paymentStatus,
        payment_id: orderData.paymentId,
        metadata: orderData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase Server] Order sync warning:', error.message);
    }
  } catch (err: any) {
    console.warn('[Supabase Server] Order sync failed silently:', err.message);
  }
}

/**
 * Sync Payment & Webhook event to Supabase
 */
export async function syncPaymentToSupabase(paymentRecord: any) {
  if (!serverSupabase) return;
  try {
    await serverSupabase
      .from('payments')
      .upsert({
        id: paymentRecord.paymentId || paymentRecord.id,
        order_id: paymentRecord.orderId,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency || 'INR',
        status: paymentRecord.status,
        method: paymentRecord.method,
        gateway: 'razorpay',
        raw_payload: paymentRecord,
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' });
  } catch (err: any) {
    console.warn('[Supabase Server] Payment sync error:', err.message);
  }
}

/**
 * E-commerce Visual Production Projects
 */
export async function syncVisualProjectToSupabase(project: any) {
  if (!serverSupabase) return;
  try {
    await serverSupabase
      .from('ecom_production_projects')
      .upsert({
        id: project.id,
        title: project.title,
        brand_name: project.brandName,
        target_marketplaces: project.targetMarketplaces,
        sku_count: project.skuCount,
        status: project.status,
        client_email: project.clientEmail,
        deliverables: project.deliverables,
        metadata: project,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
  } catch (err: any) {
    console.warn('[Supabase Server] Project sync error:', err.message);
  }
}
