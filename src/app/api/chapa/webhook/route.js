import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-chapa-signature') || request.headers.get('Chapa-Signature');
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

    if (!chapaSecretKey) {
      console.error('Missing CHAPA_SECRET_KEY env variable in webhook');
      return NextResponse.json({ error: 'Gateway misconfigured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    }

    // Verify HMAC-SHA256 signature
    const computedSignature = crypto
      .createHmac('sha256', chapaSecretKey)
      .update(bodyText)
      .digest('hex');

    if (computedSignature !== signature) {
      console.warn('Webhook signature mismatch:', { computedSignature, signature });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const txRef = payload.tx_ref;

    if (!txRef) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    // Verify transaction directly with Chapa API to prevent tampering
    const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${chapaSecretKey}`
      }
    });

    const chapaData = await chapaRes.json();
    if (chapaData.status !== 'success' || chapaData.data?.status !== 'success') {
      console.warn('Chapa verification failed for tx_ref:', txRef, chapaData);
      return NextResponse.json({ error: 'Transaction not verified by Chapa' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Process Donations
    if (txRef.startsWith('don_')) {
      const { data: contribution, error: fetchErr } = await supabase
        .from('contributions')
        .select('*')
        .eq('chapa_tx_ref', txRef)
        .single();

      if (fetchErr || !contribution) {
        console.error('Contribution not found for reference:', txRef, fetchErr);
        return NextResponse.json({ error: 'Contribution record not found' }, { status: 404 });
      }

      if (contribution.status === 'completed') {
        return NextResponse.json({ message: 'Transaction already processed' });
      }

      // Update contribution status to completed
      const { error: updateErr } = await supabase
        .from('contributions')
        .update({ status: 'completed' })
        .eq('id', contribution.id);

      if (updateErr) {
        console.error('Failed to update contribution status:', updateErr);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      // Increment raised_amount in donation_projects if associated
      if (contribution.project_id) {
        const { data: project, error: projErr } = await supabase
          .from('donation_projects')
          .select('raised_amount')
          .eq('id', contribution.project_id)
          .single();

        if (!projErr && project) {
          const newRaisedAmount = Number(project.raised_amount) + Number(contribution.amount);
          const { error: projUpdateErr } = await supabase
            .from('donation_projects')
            .update({ raised_amount: newRaisedAmount })
            .eq('id', contribution.project_id);

          if (projUpdateErr) {
            console.error('Failed to update project raised amount:', projUpdateErr);
          }
        }
      }

      console.log(`Donation contribution ${contribution.id} fulfilled successfully.`);
      return NextResponse.json({ message: 'Donation fulfilled successfully' });
    }

    // 2. Process Memorial Orders
    if (txRef.startsWith('memo_')) {
      const { data: order, error: fetchErr } = await supabase
        .from('memorial_orders')
        .select('*')
        .eq('chapa_tx_ref', txRef)
        .single();

      if (fetchErr || !order) {
        console.error('Memorial order not found for reference:', txRef, fetchErr);
        return NextResponse.json({ error: 'Memorial order not found' }, { status: 404 });
      }

      if (order.payment_status === 'completed') {
        return NextResponse.json({ message: 'Transaction already processed' });
      }

      // Update order status to completed
      const { error: updateErr } = await supabase
        .from('memorial_orders')
        .update({ payment_status: 'completed' })
        .eq('id', order.id);

      if (updateErr) {
        console.error('Failed to update memorial order status:', updateErr);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`Memorial order ${order.id} fulfilled successfully.`);
      return NextResponse.json({ message: 'Memorial order fulfilled successfully' });
    }

    return NextResponse.json({ error: 'Unsupported transaction reference format' }, { status: 400 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
