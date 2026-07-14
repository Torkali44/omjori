const crypto = require('crypto');
const { COURSE_DATA, resolveCourse, buildEmailHtml } = require('./courses');

function getHeader(req, name) {
  const key = Object.keys(req.headers || {}).find((h) => h.toLowerCase() === name.toLowerCase());
  return key ? req.headers[key] : '';
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const parts = String(signatureHeader).split(',').map((p) => p.trim());
  const timestamp = parts.find((p) => p.startsWith('t='));
  const signatures = parts.filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!timestamp || !signatures.length) return false;

  const ts = timestamp.slice(2);
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(Number(ts)) || age > 60 * 5) return false;

  const payload = ts + '.' + rawBody.toString('utf8');
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');

  return signatures.some((sig) => {
    try {
      const a = Buffer.from(sig, 'hex');
      const b = Buffer.from(expected, 'hex');
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('missing_resend_key');
  }

  const from = process.env.EMAIL_FROM || 'Omjori <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to: [to], subject, html })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error('email_failed');
    err.details = data;
    throw err;
  }
  return data;
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ ok: false, error: 'server_config' });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const signature = getHeader(req, 'stripe-signature');
  if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
    return res.status(400).json({ ok: false, error: 'invalid_signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ ok: false, error: 'invalid_json' });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const session = event.data && event.data.object ? event.data.object : null;
  if (!session) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  if (session.payment_status && session.payment_status !== 'paid') {
    return res.status(200).json({ ok: true, skipped: 'not_paid' });
  }

  const email = session.customer_details && session.customer_details.email
    ? session.customer_details.email
    : session.customer_email;

  if (!email) {
    return res.status(200).json({ ok: true, skipped: 'no_email' });
  }

  const courseKey = resolveCourse(session);
  if (!courseKey || !COURSE_DATA[courseKey]) {
    return res.status(200).json({ ok: true, skipped: 'unknown_course' });
  }

  const course = COURSE_DATA[courseKey];
  const subject = 'تم الدفع بنجاح — روابط دورة ' + course.title.replace(/^[^ ]+ /, '');
  const html = buildEmailHtml(courseKey, course);

  try {
    await sendEmail({ to: email, subject, html });
    return res.status(200).json({ ok: true, emailed: true, course: courseKey });
  } catch (err) {
    console.error('email_error', err && err.details ? err.details : err);
    return res.status(500).json({ ok: false, error: 'email_failed' });
  }
};

handler.config = { api: { bodyParser: false } };
module.exports = handler;
