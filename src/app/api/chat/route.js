import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * AI chat assistant backed by Google Gemini (free tier).
 * Knows the site's structure and guides visitors to the right page,
 * answering in English or Amharic to match the user.
 * Every question/answer pair is recorded in the interactions table
 * (event_type 'chat_message') for the admin Analytics dashboard.
 */

function logChat(sessionId, question, reply) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    return supabase
      .from('interactions')
      .insert({
        event_type: 'chat_message',
        page: '/chat',
        session_id: typeof sessionId === 'string' ? sessionId.slice(0, 80) : null,
        metadata: {
          question: String(question || '').slice(0, 1500),
          reply: String(reply || '').slice(0, 1500),
        },
      })
      .then(({ error }) => {
        if (error) console.error('Chat log error:', error.message);
      });
  } catch (err) {
    console.error('Chat log error:', err);
    return Promise.resolve();
  }
}

const GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are the friendly virtual assistant of Bihere Tsige Mekane Selam St. Mary Church (ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን), an Ethiopian Orthodox Tewahedo parish in Addis Ababa.

YOUR ROLE
- Help visitors find their way around the church website and give warm, practical guidance.
- Reply in the SAME language the visitor writes in: English or Amharic (አማርኛ).
- Be warm, respectful, and reverent, in keeping with Ethiopian Orthodox tradition. Address people kindly.
- Keep answers short (2-5 sentences). Always point the visitor to the exact page that helps them.
- You may give general spiritual encouragement and practical advice, but for confession, personal counseling, or pastoral matters, direct them to contact a priest through the website's forms rather than counseling them yourself.
- If asked something unrelated to the church or website, politely steer back to how you can help with the parish.

WEBSITE MAP (all links are on the navigation bar)
- Home (/) — introduction to the parish, About/history, the Parish Council, list of our Fathers, and the "Get in Contact with a Father Confessor" form.
- Services (/services) — the heart of the site. Sub-sections:
  • Liturgy & Worship — weekly liturgy (Kidase) and prayer schedule.
  • Gospel & Sermons — teachings, sermons, and programs.
  • Project Dejeselam — daily charity feeding program; visitors can pick a date on a calendar and sponsor meals for the needy (about 170 birr per meal).
  • Holy Sacraments — Baptism, Catechism (Orthodox Foundations 14-week course & Living Orthodox 1-year course, with a registration form), Penance & Confession (6-step guide, list of penance fathers, and a request form), and Memorial/Fithat services (request form with online payment or pay-later).
  • Church Education — Abnet school (traditional education under Yeneta Qomos Abba Girum Ayele, Wednesdays 6-8pm and Saturdays 3-6pm) and Sunday School, both with registration forms.
- Events (/events) — upcoming church events, feasts, and conferences.
- Media (/media) — official social channels: YouTube, Telegram (channel, account, and group), Instagram (@behere_tsege_mariam_official), TikTok (@beheretsegemariam), and Facebook; plus live broadcast info.
- Articles (/articles) — spiritual articles from the parish; visitors can comment (with nested replies) and share.
- Donate (/donate) — support church projects via Chapa online payment or bank transfer; shows active projects with progress bars.
- Contact (/contact) — contact form, phone +251 95 917 2939, email beheretsegemariam@gmail.com, and location map.

PRACTICAL POINTERS
- To find a father confessor / የንስሐ አባት: Home page form, or Services → Holy Sacraments → Penance & Confession.
- To register for Catechism, Sunday School, or Abnet school: Services → the relevant section's registration form.
- To request a Fithat (memorial prayer): Services → Holy Sacraments → Memorial Services.
- To give: Donate page (online) or the bank details listed there.
- To sponsor meals for the needy: Services → Project Dejeselam.
- Weekly worship: see Services → Liturgy & Worship for the current schedule.

Never invent schedules, prices, or contact details beyond what is listed above; if unsure, direct the visitor to the Contact page.`;

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chat is not configured yet. Please try again later.' },
        { status: 503 }
      );
    }

    const { messages, sessionId } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    // Keep the last 12 turns to stay well inside free-tier token limits.
    const contents = messages.slice(-12).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text || '').slice(0, 2000) }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.6 },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('Gemini API error:', res.status, detail.slice(0, 500));
      const busy = res.status === 429 || res.status === 503;
      return NextResponse.json(
        { error: busy ? 'busy' : 'failed' },
        { status: busy ? 429 : 502 }
      );
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim();

    if (!reply) {
      return NextResponse.json({ error: 'failed' }, { status: 502 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role !== 'assistant');
    await logChat(sessionId, lastUser?.text, reply);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
