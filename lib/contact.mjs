const options = {
  preferredCommunication: ['email', 'text', 'phone'],
  reunionInterest: ['yes', 'maybe', 'no'],
  planningInterest: ['yes', 'maybe', 'no'],
};
export function validateContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Please complete the form.');
  const payload = { action: 'contact', consent: input.consent === true };
  for (const [key, max] of Object.entries({ firstName: 80, lastName: 80, email: 180, phone: 40, preferredCommunication: 20, reunionInterest: 10, planningInterest: 10, message: 1500 })) {
    if (input[key] != null && typeof input[key] !== 'string') throw new Error('Please check your form entries.');
    payload[key] = (input[key] || '').trim();
    if (payload[key].length > max) throw new Error('One of your entries is too long.');
  }
  payload.email = payload.email.toLowerCase();
  if (!payload.firstName || !payload.lastName || !/^\S+@\S+\.\S+$/.test(payload.email)) throw new Error('Please enter your name and a valid email address.');
  for (const [key, allowed] of Object.entries(options)) {
    if (!allowed.includes(payload[key])) throw new Error('Please select your communication and reunion preferences.');
  }
  if ((payload.phone || payload.preferredCommunication !== 'email') && payload.phone.replace(/\D/g, '').length < 7) throw new Error('Please enter a valid phone number for text messages or phone calls.');
  if (!payload.consent) throw new Error('Please confirm that the committee may contact you.');
  return payload;
}
