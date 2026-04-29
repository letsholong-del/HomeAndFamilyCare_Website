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
const cleaningFields = document.querySelector('[data-cleaning-fields]');
const babysittingFields = document.querySelector('[data-babysitting-fields]');

const CLEANING_MINIMUM = 300;
const CLEANING_HOURLY_RATE = 150;
const URGENT_FEE = 100;
const SUPPLIES_FEE = 90;

const SERVICE_LABELS = {
  'cleaning-once': 'Once-Off Home Cleaning',
  'cleaning-recurring': 'Recurring Home Cleaning',
  babysitting: 'Babysitting Quote'
};

const SA_PHONE = '27612252597';
const BASE_WHATSAPP_TEXT = 'Hi Home and Family Care, I want to request a quote for home cleaning or babysitting.';
const REVIEW_WHATSAPP_TEXT = 'Hi Home and Family Care, I would like to leave a customer review.';

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

  const reviewLink = document.getElementById('reviewWhatsappLink');
  if (reviewLink) reviewLink.href = whatsappUrl(REVIEW_WHATSAPP_TEXT);
}

function isCleaningService(service) {
  return service === 'cleaning-once' || service === 'cleaning-recurring';
}

function calculateEstimate(service, hours, urgent, supplies) {
  if (!isCleaningService(service)) return null;
  const base = Math.max(CLEANING_MINIMUM, CLEANING_HOURLY_RATE * Number(hours || 0));
  const urgentFee = urgent ? URGENT_FEE : 0;
  const suppliesFee = supplies === 'helper' ? SUPPLIES_FEE : 0;
  return base + urgentFee + suppliesFee;
}

function formatSupplies(value) {
  if (value === 'helper') return 'Please include supplies';
  if (value === 'not-applicable') return 'Not applicable';
  return 'I provide supplies';
}

function buildBookingMessage(data, estimate) {
  const priceLine = estimate
    ? `Guide cleaning price shown: R${estimate}`
    : 'Pricing: Babysitting requires a custom quotation.';

  const lines = [
    'Hi Home and Family Care, I want to request a quote.',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Service: ${SERVICE_LABELS[data.service] || data.service}`,
    `City: ${data.city}`,
    `Suburb: ${data.suburb}`,
    `Preferred date: ${data.date}`,
    `Duration: ${data.hours} hours`,
    `Supplies: ${formatSupplies(data.supplies)}`,
    `Urgent: ${data.urgent ? 'Yes' : 'No'}`,
    `Access notes / priorities: ${data.details}`
  ];

  if (isCleaningService(data.service)) {
    lines.push(
      '',
      'Cleaning details:',
      `Home type: ${data.homeType || 'Not provided'}`,
      `Home condition: ${data.condition || 'Not provided'}`,
      `Bedrooms: ${data.bedrooms || 'Not provided'}`,
      `Bathrooms: ${data.bathrooms || 'Not provided'}`,
      `Cleaning extras: ${data.cleaningExtras || 'None listed'}`
    );
  }

  if (data.service === 'babysitting') {
    lines.push(
      '',
      'Babysitting details:',
      `Number of children: ${data.childrenCount || 'Not provided'}`,
      `Timing: ${data.timing || 'Not provided'}`,
      `Child ages and duties: ${data.babysittingDetails || 'Not provided'}`
    );
  }

  lines.push('', priceLine, '', 'Please confirm the final quote and availability.');
  return lines.join('\n');
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
    homeType: String(formData.get('homeType') || ''),
    condition: String(formData.get('condition') || ''),
    bedrooms: String(formData.get('bedrooms') || ''),
    bathrooms: String(formData.get('bathrooms') || ''),
    cleaningExtras: String(formData.get('cleaningExtras') || '').trim(),
    childrenCount: String(formData.get('childrenCount') || ''),
    timing: String(formData.get('timing') || ''),
    babysittingDetails: String(formData.get('babysittingDetails') || '').trim(),
    details: String(formData.get('details') || '').trim(),
    urgent: Boolean(formData.get('urgent'))
  };
}

function updateFormHints() {
  const service = bookingForm.elements.service.value;
  const supplies = bookingForm.elements.supplies;

  if (service === 'babysitting') {
    supplies.value = 'not-applicable';
  } else if (supplies.value === 'not-applicable') {
    supplies.value = 'customer';
  }

  const cleaningSelected = isCleaningService(service) || service === '';
  const babysittingSelected = service === 'babysitting';
  if (cleaningFields) cleaningFields.classList.toggle('hidden', !cleaningSelected);
  if (babysittingFields) babysittingFields.classList.toggle('hidden', !babysittingSelected);
}

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readBookingForm();
  const estimate = calculateEstimate(data.service, data.hours, data.urgent, data.supplies);
  const message = buildBookingMessage(data, estimate);

  estimateCard.classList.remove('hidden');
  estimateValue.textContent = estimate ? `R${estimate}` : 'Quotation required';
  sendWhatsappRequest.href = whatsappUrl(message);
  sendWhatsappRequest.classList.remove('hidden');
  bookingMsg.textContent = estimate
    ? 'Guide cleaning price prepared. Send the request on WhatsApp so we can confirm the final quote.'
    : 'Babysitting request prepared. Send it on WhatsApp so we can quote based on your family details.';
});

helperForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(helperForm);
  const name = String(formData.get('helperName') || 'Applicant').trim();
  const email = String(formData.get('helperEmail') || '').trim();
  const phone = String(formData.get('helperPhone') || '').trim();
  const skill = String(formData.get('helperType') || 'Helper');
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
    if (select) {
      select.value = service;
      updateFormHints();
    }
  });
});

bookingForm.elements.service.addEventListener('change', updateFormHints);

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
updateFormHints();
