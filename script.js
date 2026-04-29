const bookingForm = document.getElementById('bookingForm');
const helperForm = document.getElementById('helperForm');
const bookingMsg = document.getElementById('bookingMsg');
const helperMsg = document.getElementById('helperMsg');
const estimateCard = document.getElementById('estimateCard');
const estimateValue = document.getElementById('estimateValue');
const sendWhatsappRequest = document.getElementById('sendWhatsappRequest');
const sendHelperWhatsapp = document.getElementById('sendHelperWhatsapp');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('navLinks');

const RATE_PER_HOUR = {
  cleaning: 140,
  gardening: 160,
  babysitting: 95,
  homehelp: 125
};

const SERVICE_LABELS = {
  cleaning: 'Home Cleaning',
  gardening: 'Gardening',
  babysitting: 'Babysitting',
  homehelp: 'General Home Help'
};

const SA_PHONE = '27612252597';
const BASE_WHATSAPP_TEXT = 'Hi Home and Family Care, I want to request a quote for a household service.';

function whatsappUrl(message) {
  return `https://wa.me/${SA_PHONE}?text=${encodeURIComponent(message)}`;
}

function setStaticWhatsappLinks() {
  [
    'navWhatsappLink',
    'heroWhatsappLink',
    'contactWhatsappLink',
    'footerWhatsappLink',
    'floatingWhatsapp'
  ].forEach((id) => {
    const link = document.getElementById(id);
    if (link) link.href = whatsappUrl(BASE_WHATSAPP_TEXT);
  });
}

function calculateEstimate(service, hours, urgent, supplies) {
  const base = (RATE_PER_HOUR[service] || 120) * Number(hours);
  const urgentFee = urgent ? 80 : 0;
  const suppliesFee = supplies === 'helper' ? 70 : 0;
  return base + urgentFee + suppliesFee;
}

function buildBookingMessage(data, estimate) {
  return [
    'Hi Home and Family Care, I want to request a quote.',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Service: ${SERVICE_LABELS[data.service] || data.service}`,
    `City: ${data.city}`,
    `Suburb: ${data.suburb}`,
    `Preferred date: ${data.date}`,
    `Duration: ${data.hours} hours`,
    `Supplies: ${data.supplies === 'helper' ? 'Please include supplies' : 'I provide supplies'}`,
    `Urgent: ${data.urgent ? 'Yes' : 'No'}`,
    `Guide price shown: R${estimate}`,
    '',
    'Please confirm the final quote and availability.'
  ].join('\n');
}

function readBookingForm() {
  const formData = new FormData(bookingForm);
  return {
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    service: String(formData.get('service') || ''),
    city: String(formData.get('city') || ''),
    suburb: String(formData.get('suburb') || '').trim(),
    date: String(formData.get('date') || ''),
    hours: Number(formData.get('hours') || 0),
    supplies: String(formData.get('supplies') || 'customer'),
    urgent: Boolean(formData.get('urgent'))
  };
}

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readBookingForm();
  const estimate = calculateEstimate(data.service, data.hours, data.urgent, data.supplies);
  const message = buildBookingMessage(data, estimate);

  estimateCard.classList.remove('hidden');
  estimateValue.textContent = `R${estimate}`;
  sendWhatsappRequest.href = whatsappUrl(message);
  sendWhatsappRequest.classList.remove('hidden');
  bookingMsg.textContent = 'Guide price calculated. Send the request on WhatsApp so we can confirm the final quote.';
});

helperForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(helperForm);
  const name = String(formData.get('helperName') || 'Applicant').trim();
  const email = String(formData.get('helperEmail') || '').trim();
  const phone = String(formData.get('helperPhone') || '').trim();
  const skill = String(formData.get('helperType') || 'General Helper');
  const area = String(formData.get('helperArea') || 'your area').trim();
  const experience = String(formData.get('experience') || '');
  const message = [
    'Hi Home and Family Care, I want to apply as a helper.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Primary skill: ${skill}`,
    `Area: ${area}`,
    `Experience: ${experience}`,
    '',
    'I consent to the next screening step.'
  ].join('\n');

  sendHelperWhatsapp.href = whatsappUrl(message);
  sendHelperWhatsapp.classList.remove('hidden');
  helperMsg.textContent = `Thanks ${name}. Send your ${skill} application on WhatsApp so we can start the next screening step.`;
});

document.querySelectorAll('[data-service-link]').forEach((link) => {
  link.addEventListener('click', () => {
    const service = link.getAttribute('data-service-link');
    const select = bookingForm.elements.service;
    if (select) select.value = service;
  });
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

setStaticWhatsappLinks();
