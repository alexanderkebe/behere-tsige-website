import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, amount, email, message } = body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY;
    if (!chapaSecretKey) {
      console.error('Missing CHAPA_SECRET_KEY environment variable');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Determine redirect origin
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const txId = crypto.randomUUID();

    let txRef = '';
    let chapaPayload = {};

    if (type === 'donation') {
      const { projectId, name, isAnonymous } = body;
      txRef = `don_${txId}`;

      // Insert pending contribution in database
      const { error: dbError } = await supabase
        .from('contributions')
        .insert({
          project_id: projectId || null,
          donor_name: name || 'Anonymous',
          donor_email: email || null,
          amount: Number(amount),
          currency: 'ETB',
          method: 'chapa',
          status: 'pending',
          is_anonymous: !!isAnonymous,
          message: message || null,
          chapa_tx_ref: txRef
        });

      if (dbError) {
        console.error('Database error inserting pending contribution:', dbError);
        return NextResponse.json({ error: 'Failed to record donation request' }, { status: 500 });
      }

      // Prepare Chapa payload
      const nameParts = (name || 'Anonymous Donor').trim().split(/\s+/);
      const firstName = nameParts[0] || 'Anonymous';
      const lastName = nameParts.slice(1).join(' ') || 'Donor';

      chapaPayload = {
        amount: String(amount),
        currency: 'ETB',
        email: email || 'info@beheretsigestmary.org',
        first_name: firstName,
        last_name: lastName,
        tx_ref: txRef,
        callback_url: `${origin}/api/chapa/webhook`,
        return_url: `${origin}/donate?status=success&tx_ref=${txRef}`,
        customization: {
          title: 'Parish Contribution',
          description: projectId ? 'Donation to specific sanctuary project' : 'General sanctuary support'
        }
      };

    } else if (type === 'memorial') {
      const { serviceId, sponsorName, departedName, phone, preferredDate } = body;
      txRef = `memo_${txId}`;

      if (!serviceId || !sponsorName || !departedName || !phone) {
        return NextResponse.json({ error: 'Missing required memorial fields' }, { status: 400 });
      }

      // Insert pending memorial order in database
      const { error: dbError } = await supabase
        .from('memorial_orders')
        .insert({
          service_id: serviceId,
          requester_name: sponsorName,
          requester_phone: phone,
          requester_email: email || null,
          deceased_name: departedName,
          preferred_date: preferredDate || null,
          amount: Number(amount),
          payment_status: 'pending',
          chapa_tx_ref: txRef
        });

      if (dbError) {
        console.error('Database error inserting pending memorial order:', dbError);
        return NextResponse.json({ error: 'Failed to record memorial request' }, { status: 500 });
      }

      // Prepare Chapa payload
      const nameParts = sponsorName.trim().split(/\s+/);
      const firstName = nameParts[0] || 'Sponsor';
      const lastName = nameParts.slice(1).join(' ') || 'Requester';

      chapaPayload = {
        amount: String(amount),
        currency: 'ETB',
        email: email || 'info@beheretsigestmary.org',
        first_name: firstName,
        last_name: lastName,
        tx_ref: txRef,
        callback_url: `${origin}/api/chapa/webhook`,
        return_url: `${origin}/services?status=success&tx_ref=${txRef}`,
        customization: {
          title: 'Memorial Service Request',
          description: `Memorial prayer for departed soul: ${departedName}`
        }
      };

    } else {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    // Call Chapa to initialize the transaction
    const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chapaSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chapaPayload)
    });

    const chapaData = await chapaRes.json();

    if (chapaData.status !== 'success' || !chapaData.data?.checkout_url) {
      console.error('Chapa API Error:', chapaData);
      return NextResponse.json({ error: chapaData.message || 'Payment initiation failed' }, { status: 500 });
    }

    return NextResponse.json({ checkout_url: chapaData.data.checkout_url });

  } catch (error) {
    console.error('Error in initiate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
