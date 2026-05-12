/* Floating contact widget */

(function initContactWidget() {
  if (document.querySelector('.contact-widget')) return;

  const contacts = [
    {
      label: 'WeChat',
      detail: 'Add your WeChat ID',
      icon: 'wechat',
      href: 'contact'
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
      href: 'contact'
    },
    {
      label: 'Telegram',
      detail: 'Open Telegram',
      icon: 'telegram',
      href: 'contact'
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

  initDraggableContactWidget(widget, toggle);

  toggle.addEventListener('click', event => {
    if (widget.dataset.dragSuppressClick === 'true') {
      event.preventDefault();
      event.stopPropagation();
      widget.dataset.dragSuppressClick = 'false';
      return;
    }

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

function initDraggableContactWidget(widget, handle) {
  const storageKey = 'esHappyToursContactWidgetPosition';
  const dragState = {
    pointerId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    moved: false
  };

  const getViewportBounds = () => ({
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  });

  const clampPosition = (left, top) => {
    const bounds = getViewportBounds();
    const rect = widget.getBoundingClientRect();
    const margin = bounds.width <= 560 ? 10 : 14;
    const maxLeft = Math.max(margin, bounds.width - rect.width - margin);
    const maxTop = Math.max(margin, bounds.height - rect.height - margin);

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop)
    };
  };

  const setWidgetPosition = (left, top, shouldStore) => {
    const position = clampPosition(left, top);
    widget.style.left = `${position.left}px`;
    widget.style.top = `${position.top}px`;
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
    widget.classList.add('is-positioned');

    if (shouldStore) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(position));
      } catch (error) {
        // The widget still works if storage is unavailable.
      }
    }
  };

  const restorePosition = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
        setWidgetPosition(saved.left, saved.top, false);
      }
    } catch (error) {
      try {
        localStorage.removeItem(storageKey);
      } catch (storageError) {
        // Ignore storage cleanup failures.
      }
    }
  };

  const settlePositionInsideViewport = () => {
    const rect = widget.getBoundingClientRect();
    setWidgetPosition(rect.left, rect.top, widget.classList.contains('is-positioned'));
  };

  requestAnimationFrame(restorePosition);

  handle.addEventListener('pointerdown', event => {
    if (event.button !== undefined && event.button !== 0) return;

    const rect = widget.getBoundingClientRect();
    dragState.pointerId = event.pointerId;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.offsetX = event.clientX - rect.left;
    dragState.offsetY = event.clientY - rect.top;
    dragState.moved = false;
    widget.dataset.dragSuppressClick = 'false';
    widget.classList.add('is-drag-ready');

    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener('pointermove', event => {
    if (dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.moved && Math.hypot(deltaX, deltaY) < 6) return;

    dragState.moved = true;
    widget.classList.add('is-dragging');
    widget.dataset.dragSuppressClick = 'true';
    setWidgetPosition(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY, false);
  });

  const finishDrag = event => {
    if (dragState.pointerId !== event.pointerId) return;

    try {
      handle.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture may already be released by the browser.
    }

    widget.classList.remove('is-drag-ready', 'is-dragging');

    if (dragState.moved) {
      const rect = widget.getBoundingClientRect();
      setWidgetPosition(rect.left, rect.top, true);
    }

    dragState.pointerId = null;
  };

  handle.addEventListener('pointerup', finishDrag);
  handle.addEventListener('pointercancel', finishDrag);
  window.addEventListener('resize', settlePositionInsideViewport);
}

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
