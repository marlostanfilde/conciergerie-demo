const CONTACTS = {
  phoneDisplay: '07 68 40 75 33',
  phoneRaw: '33768407533',
  email: 'contact@atlasprestigeconcierge.com',
  instagramUrl: 'https://instagram.com/atlasprestigeconcierge',
  instagramHandle: '@atlasprestigeconcierge'
};

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = header?.querySelector('.main-nav');

function syncMobileMenuState(isOpen) {
  if (!header || !navToggle) return;
  header.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.textContent = isOpen ? 'Fermer' : 'Menu';
  document.body.classList.toggle('menu-open', isOpen && window.innerWidth <= 760);
}

if (navToggle && header) {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'site-navigation');
  if (mainNav) mainNav.id = 'site-navigation';

  navToggle.addEventListener('click', () => {
    syncMobileMenuState(!header.classList.contains('open'));
  });

  mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => syncMobileMenuState(false));
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth > 760 || !header.classList.contains('open')) return;
    if (header.contains(event.target)) return;
    syncMobileMenuState(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      document.body.classList.remove('menu-open');
      syncMobileMenuState(false);
    }
  });
}

function whatsappUrl(message) {
  return `https://wa.me/${CONTACTS.phoneRaw}?text=${encodeURIComponent(message)}`;
}

function replaceStrongText(anchor, value) {
  const strong = anchor.querySelector('strong');
  if (strong) strong.textContent = value;
}

function updateContacts() {
  document.querySelectorAll('[data-contact="phone_link"]').forEach((el) => {
    el.href = `tel:+${CONTACTS.phoneRaw}`;
    replaceStrongText(el, CONTACTS.phoneDisplay);
    if (el.children.length === 0 && !el.textContent.includes('Telephone')) {
      el.textContent = CONTACTS.phoneDisplay;
    }
  });

  document.querySelectorAll('[data-contact="email_link"]').forEach((el) => {
    el.href = `mailto:${CONTACTS.email}`;
    replaceStrongText(el, CONTACTS.email);
    if (el.children.length === 0 && el.textContent.includes('@')) {
      el.textContent = CONTACTS.email;
    }
  });

  document.querySelectorAll('[data-contact="whatsapp_link"]').forEach((el) => {
    el.href = `https://wa.me/${CONTACTS.phoneRaw}`;
  });

  document.querySelectorAll('[data-contact="instagram_link"]').forEach((el) => {
    el.href = CONTACTS.instagramUrl;
    replaceStrongText(el, CONTACTS.instagramHandle);
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3600);
}

function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = today;
  });
}

function handleBookingForm(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = form.dataset.type || 'service';
    const item = form.dataset.item || 'demande';
    const price = form.dataset.price || 'sur demande';
    const page = form.dataset.page || window.location.pathname.split('/').pop() || 'site';
    const dateStart = data.get('date_start') || data.get('date') || 'a confirmer';
    const dateEnd = data.get('date_end') || 'a confirmer';
    const guests = data.get('guests') || 'a confirmer';
    const offer = data.get('offer');
    const firstName = data.get('first_name') || 'Non renseigne';
    const name = data.get('name') || 'Client';
    const phone = data.get('phone') || 'Non renseigne';
    const email = data.get('email') || 'Non renseigne';
    const city = data.get('city') || 'Non precisee';
    const message = data.get('message') || '';

    let text;
    if (type === 'contact') {
      text = [
        'Bonjour, je souhaite etre recontacte par Atlas Prestige Concierge.',
        '',
        `Nom: ${name}`,
        `Telephone: ${phone}`,
        `Email: ${email}`,
        `Ville / destination: ${city}`,
        `A partir du: ${dateStart}`,
        `Jusqu'au: ${dateEnd}`,
        `Nombre de personnes: ${guests}`,
        `Service: ${offer}`,
        `Message: ${message || 'Aucun message complementaire.'}`,
        `Source: ${page}`
      ].join('\n');
      showToast('Votre demande est prete. Ouverture de WhatsApp en cours.');
    } else {
      const details = [
        'Bonjour, je souhaite recevoir une proposition pour cette prestation.',
        '',
        `Service: ${type}`,
        `Produit: ${item}`,
        `Prenom: ${firstName}`,
        `Nom: ${name}`,
        `Telephone: ${phone}`,
        `Email: ${email}`,
        `Du: ${dateStart}`,
        `Au: ${dateEnd}`,
        `Nombre de personnes: ${guests}`,
        `Budget indicatif: ${price}`,
        `Message: ${message || 'Merci de me confirmer la disponibilite et les conditions.'}`,
        `Source: ${page}`
      ];
      if (offer) {
        details.splice(11, 0, `Option souhaitee: ${offer}`);
      }
      text = details.join('\n');
      showToast(`Demande preparee pour ${item}. Ouverture de WhatsApp...`);
    }

    window.open(whatsappUrl(text), '_blank', 'noopener');
    form.reset();
  });
}

function handleClickableCards() {
  document.querySelectorAll('[data-href]').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button, input, select, textarea, label, option')) return;
      window.location.href = card.dataset.href;
    });
  });
}

updateContacts();
setMinDates();
document.querySelectorAll('.booking-form').forEach(handleBookingForm);
handleClickableCards();
