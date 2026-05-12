/* Floating contact widget.
   Edit the href values below when the official contact links are ready. */

(function initContactWidget() {
  if (document.querySelector('.contact-widget')) return;

  const contacts = [
    {
      label: 'WeChat',
      detail: 'Add your WeChat ID',
      icon: 'wechat',
      href: '#wechat-id-placeholder'
    },
    {
      label: 'Messenger',
      detail: 'Open Facebook chat',
      icon: 'messenger',
      href: 'https://www.facebook.com/ESHappyTours'
    },
    {
      label: 'Message / Email',
      detail: 'info@eshappytours.com',
      icon: 'email',
      href: 'mailto:info@eshappytours.com'
    },
    {
      label: 'Telegram',
      detail: 'Open Telegram',
      icon: 'telegram',
      href: 'https://t.me/YOUR_TELEGRAM_USERNAME'
    }
  ];

  const widget = document.createElement('div');
  widget.className = 'contact-widget';

  const panel = document.createElement('div');
  panel.className = 'contact-widget-panel';
  panel.id = 'contact-widget-panel';

  contacts.forEach(contact => {
    const link = document.createElement('a');
    link.className = 'contact-widget-link';
    link.href = contact.href;

    if (/^https?:\/\//.test(contact.href)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    const icon = document.createElement('span');
    icon.className = `contact-widget-icon contact-widget-icon--${contact.icon}`;
    icon.appendChild(buildContactIcon(contact.icon));

    const text = document.createElement('span');
    text.className = 'contact-widget-text';

    const label = document.createElement('strong');
    label.textContent = contact.label;

    const detail = document.createElement('span');
    detail.textContent = contact.detail;

    text.append(label, detail);
    link.append(icon, text);
    panel.appendChild(link);
  });

  const toggle = document.createElement('button');
  toggle.className = 'contact-widget-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', 'contact-widget-panel');
  toggle.setAttribute('aria-expanded', 'false');

  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'contact-widget-toggle-icon';
  toggleIcon.appendChild(buildMessageIcon());

  const toggleText = document.createElement('span');
  toggleText.textContent = 'Contact';

  toggle.append(toggleIcon, toggleText);
  widget.append(panel, toggle);
  document.body.appendChild(widget);

  toggle.addEventListener('click', () => {
    const isOpen = widget.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && widget.classList.contains('open')) {
      widget.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

function buildMessageIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z');
  svg.appendChild(path);

  return svg;
}

function buildContactIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  const addPath = d => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  };

  if (name === 'telegram') {
    addPath('M21.8 4.4 18.6 19.5c-.2 1-.8 1.2-1.6.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.2 1.7 11.7c-1-.3-1-1 .2-1.4L20.5 3.1c.9-.3 1.7.2 1.3 1.3z');
    return svg;
  }

  if (name === 'messenger') {
    addPath('M12 2C6.5 2 2.2 6 2.2 11.4c0 2.8 1.1 5.2 3.1 6.9v3.5l3.4-1.9c1 .3 2.1.5 3.3.5 5.5 0 9.8-4 9.8-9.4S17.5 2 12 2zm1 12.6-2.5-2.7-4.9 2.7 5.4-5.8 2.6 2.7 4.8-2.7-5.4 5.8z');
    return svg;
  }

  if (name === 'wechat') {
    addPath('M9.4 4.1c-4.2 0-7.4 2.8-7.4 6.3 0 2 1.1 3.7 2.9 4.8l-.7 2.2 2.6-1.3c.8.2 1.7.3 2.6.3.3 0 .6 0 .9-.1-.2-.6-.3-1.2-.3-1.8 0-3.1 2.9-5.7 6.5-5.7h.5c-.8-2.7-3.8-4.7-7.6-4.7zm-2.5 4.7c-.5 0-.9-.4-.9-.9s.4-.8.9-.8.9.4.9.8-.4.9-.9.9zm5 0c-.5 0-.9-.4-.9-.9s.4-.8.9-.8.9.4.9.8-.4.9-.9.9z');
    addPath('M22 14.4c0-2.8-2.6-5-5.8-5s-5.8 2.2-5.8 5 2.6 5 5.8 5c.7 0 1.4-.1 2-.3l2.1 1-.5-1.8c1.3-.9 2.2-2.3 2.2-3.9zm-7.7-.9c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm3.8 0c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z');
    return svg;
  }

  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '3');
  rect.setAttribute('y', '5');
  rect.setAttribute('width', '18');
  rect.setAttribute('height', '14');
  rect.setAttribute('rx', '2');
  svg.appendChild(rect);
  addPath('m3 7 9 6 9-6');

  return svg;
}
