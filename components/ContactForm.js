'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState({ kind: '', message: '' });
  async function submit(event) {
    event.preventDefault();
    if (status.kind === 'pending') return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.consent = data.consent === 'on';
    setStatus({ kind: 'pending', message: 'Saving your details…' });
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'We couldn’t save your details. Please try again.');
      form.reset(); setMethod('');
      setStatus({ kind: 'success', message: 'Thank you! Your details and preferences have been shared with the reunion committee.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'Please check your connection and try again.' });
    }
  }
  return <form onSubmit={submit} aria-label="Stay connected" aria-busy={status.kind === 'pending'}>
    <div className="fields">
      <label>First name *<input name="firstName" required maxLength={80} autoComplete="given-name" /></label>
      <label>Last name *<input name="lastName" required maxLength={80} autoComplete="family-name" /></label>
      <label className="full">Email address *<input name="email" type="email" required maxLength={180} autoComplete="email" /></label>
      <label>Phone number{method === 'text' || method === 'phone' ? ' *' : ''}<input name="phone" type="tel" maxLength={40} autoComplete="tel" required={method === 'text' || method === 'phone'} /></label>
      <label>Preferred communication *<select name="preferredCommunication" required value={method} onChange={e => setMethod(e.target.value)}><option value="">Choose one</option><option value="email">Email</option><option value="text">Text message</option><option value="phone">Phone call</option></select></label>
      <label className="full">Interested in a 25-year reunion? *<select name="reunionInterest" required defaultValue=""><option value="">Choose one</option><option value="yes">Yes, count me in!</option><option value="maybe">Maybe — keep me posted</option><option value="no">No, not at this time</option></select></label>
      <label className="full">Interested in helping plan the next event? *<select name="planningInterest" required defaultValue=""><option value="">Choose one</option><option value="yes">Yes, I’d love to help</option><option value="maybe">Maybe — tell me more</option><option value="no">No, not at this time</option></select></label>
      <label className="full">A memory, suggestion, or note (optional)<textarea name="message" rows={3} maxLength={1500} placeholder="We’d love to hear from you." /></label>
    </div>
    <label className="trap" aria-hidden="true">Leave blank<input name="company" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent"><input type="checkbox" name="consent" required />It’s okay for the reunion committee to contact me about class updates using my preferred method.</label>
    <button className="pill" type="submit" disabled={status.kind === 'pending'}>{status.kind === 'pending' ? 'Saving…' : 'Keep me connected →'}</button>
    <small>* Required fields. Phone is required when choosing text or phone.</small>
    <p className={`form-${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>{status.message}</p>
  </form>;
}
