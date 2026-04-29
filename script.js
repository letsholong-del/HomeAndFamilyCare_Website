const bookingForm = document.getElementById('bookingForm');
const helperForm = document.getElementById('helperForm');
const bookingMsg = document.getElementById('bookingMsg');
const helperMsg = document.getElementById('helperMsg');
const bookingLeads = document.getElementById('bookingLeads');
const helperLeads = document.getElementById('helperLeads');
const estimateCard = document.getElementById('estimateCard');
const estimateValue = document.getElementById('estimateValue');

const RATE_PER_HOUR = {
  cleaning: 140,
  gardening: 160,
  babysitting: 95,
  homehelp: 125
};

const SA_PHONE = '27612252597';

document.getElementById('year').textContent = new Date().getFullYear();

const whatsappText = 'Hi Home and Family Care, I want to request a quote for a household service.';
document.getElementById('whatsappLink').href = `https://wa.me/${SA_PHONE}?text=${encodeURIComponent(whatsappText)}`;
document.getElementById('heroWhatsappLink').href = `https://wa.me/${SA_PHONE}?text=${encodeURIComponent(whatsappText)}`;

function readStore(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderLeads() {
  const bookings = readStore('bookings').slice(-5).reverse();
  const helpers = readStore('helpers').slice(-5).reverse();

  bookingLeads.innerHTML = bookings.length
    ? bookings.map((b) => `<li><strong>${b.name}</strong> - ${b.service} - ${b.city} - R${b.estimate}</li>`).join('')
    : '<li>No booking leads yet.</li>';

  helperLeads.innerHTML = helpers.length
    ? helpers.map((h) => `<li><strong>${h.name}</strong> - ${h.skill} - ${h.area}</li>`).join('')
    : '<li>No helper applications yet.</li>';
}

function calculateEstimate(service, hours, urgent) {
  const base = (RATE_PER_HOUR[service] || 120) * Number(hours);
  const urgentFee = urgent ? 80 : 0;
  return base + urgentFee;
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(bookingForm);

  const name = String(formData.get('name') || 'Customer');
  const service = String(formData.get('service') || 'service');
  const city = String(formData.get('city') || 'city');
  const hours = Number(formData.get('hours') || 2);
  const urgent = Boolean(formData.get('urgent'));

  const estimate = calculateEstimate(service, hours, urgent);
  estimateCard.classList.remove('hidden');
  estimateValue.textContent = `R${estimate}`;

  const bookings = readStore('bookings');
  bookings.push({ name, service, city, estimate, timestamp: new Date().toISOString() });
  writeStore('bookings', bookings);

  bookingMsg.textContent = `Thanks ${name}. Your guide price is R${estimate}. We will confirm the final quote after checking the job details.`;
  bookingMsg.style.color = '#0f766e';

  bookingForm.reset();
  renderLeads();
});

helperForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(helperForm);

  const name = String(formData.get('helperName') || 'Applicant');
  const skill = String(formData.get('helperType') || 'General Helper');
  const area = String(formData.get('helperArea') || 'Unknown Area');

  const helpers = readStore('helpers');
  helpers.push({ name, skill, area, timestamp: new Date().toISOString() });
  writeStore('helpers', helpers);

  helperMsg.textContent = `Thanks ${name}. Application received for ${skill} in ${area}.`;
  helperMsg.style.color = '#0f766e';

  helperForm.reset();
  renderLeads();
});

renderLeads();
