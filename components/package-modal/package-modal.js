(function initPackageModal() {
  const data = window.PACKAGE_DATA || {};
  let modal;
  let currentPackage;
  let activePaxButton;

  const formatPrice = value => (
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value)
  );

  const createEl = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === 'string') el.textContent = text;
    return el;
  };

  const clearNode = node => {
    while (node.firstChild) node.removeChild(node.firstChild);
  };

  const createList = (items, iconText, iconClass) => {
    const list = createEl('ul', 'package-modal__list');
    (items || []).forEach((item, index) => {
      const li = createEl('li', 'package-modal__item');
      const icon = createEl('span', `package-modal__icon ${iconClass || ''}`.trim(), iconText === 'step' ? String(index + 1) : iconText);
      const text = createEl('span', '', item);
      li.append(icon, text);
      list.append(li);
    });
    return list;
  };

  const createSection = (title, list, options) => {
    const section = createEl('section', `package-modal__section${options && options.wide ? ' package-modal__section--wide' : ''}`);
    section.append(createEl('h3', 'package-modal__section-title', title), list);
    return section;
  };

  const createActivitiesSection = activities => {
    const section = createEl('section', 'package-modal__section package-modal__section--wide');
    const grid = createEl('div', 'package-modal__activities');

    (activities || []).forEach((activity, index) => {
      const card = createEl('article', 'package-modal__activity');
      card.append(
        createEl('div', 'package-modal__activity-label', `Activity ${index + 1}`),
        createEl('h4', 'package-modal__activity-title', activity.title),
        createList(activity.items, 'step')
      );

      if (activity.optional && activity.optional.length) {
        card.append(
          createEl('h5', 'package-modal__activity-subtitle', 'Optional Activities / Guest Expense'),
          createList(activity.optional, '!', 'package-modal__icon--optional')
        );
      }

      grid.append(card);
    });

    section.append(createEl('h3', 'package-modal__section-title', 'Itinerary Activities'), grid);
    return section;
  };

  const updatePrivatePrice = (price, main, sub, button) => {
    if (!price || !main || !sub) return;
    if (activePaxButton) activePaxButton.classList.remove('is-active');
    activePaxButton = button || null;
    if (activePaxButton) activePaxButton.classList.add('is-active');

    main.textContent = `${formatPrice(price.pricePerPax)} / pax`;
    sub.textContent = `Selected: ${price.pax} pax. Estimated total: ${formatPrice(price.pax * price.pricePerPax)}`;
  };

  const buildPricing = pkg => {
    const panel = createEl('div', 'package-modal__price-panel');
    panel.append(createEl('div', 'package-modal__price-label', 'Price Information'));

    const main = createEl('div', 'package-modal__price-main');
    const sub = createEl('div', 'package-modal__price-sub');

    if (Array.isArray(pkg.prices) && pkg.prices.length) {
      const grid = createEl('div', 'package-modal__pax-grid');
      pkg.prices.forEach((price, index) => {
        const button = createEl('button', 'package-modal__pax-btn', `${price.pax} pax`);
        button.type = 'button';
        button.addEventListener('click', () => updatePrivatePrice(price, main, sub, button));
        grid.append(button);
        if (index === 0) {
          window.setTimeout(() => updatePrivatePrice(price, main, sub, button), 0);
        }
      });
      panel.append(main, sub, grid);
      return panel;
    }

    main.textContent = `${formatPrice(pkg.pricePerPax || 0)} / pax`;
    sub.textContent = `Minimum ${pkg.minimumPax || 1} pax for this joiner package.`;
    panel.append(main, sub);
    return panel;
  };

  const buildModal = () => {
    modal = createEl('div', 'package-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    const dialog = createEl('div', 'package-modal__dialog');
    const scroll = createEl('div', 'package-modal__scroll');
    const close = createEl('button', 'package-modal__close', 'x');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close package details');
    close.addEventListener('click', closeModal);

    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });

    dialog.append(close, scroll);
    modal.append(dialog);
    document.body.append(modal);
  };

  const openModal = pkg => {
    if (!modal) buildModal();
    currentPackage = pkg;
    activePaxButton = null;

    const scroll = modal.querySelector('.package-modal__scroll');
    clearNode(scroll);

    const hero = createEl('div', 'package-modal__hero');
    const intro = createEl('div', 'package-modal__intro');
    const meta = createEl('div', 'package-modal__meta');
    meta.append(
      createEl('span', 'package-modal__pill', pkg.duration || 'Tour Package'),
      createEl('span', 'package-modal__pill', pkg.category || 'Package')
    );
    intro.append(meta, createEl('h2', 'package-modal__title', pkg.title), buildPricing(pkg));

    if (pkg.image) {
      const imageWrap = createEl('div', 'package-modal__image-wrap');
      const image = createEl('img', 'package-modal__image');
      image.src = pkg.image;
      image.alt = pkg.title;
      image.loading = 'lazy';
      imageWrap.append(image);
      hero.append(imageWrap);
    }

    hero.append(intro);

    const content = createEl('div', 'package-modal__content');
    const hasActivities = Boolean(pkg.activities && pkg.activities.length);
    const hasActivityOptional = hasActivities && pkg.activities.some(activity => activity.optional && activity.optional.length);
    if (hasActivities) {
      content.append(createActivitiesSection(pkg.activities));
    } else {
      content.append(createSection('Itinerary', createList(pkg.itinerary, 'step'), { wide: true }));
    }

    content.append(createSection('Inclusions', createList(pkg.inclusions, '✓')));
    if (!hasActivities || !hasActivityOptional) {
      content.append(createSection('Guest Expense / Optional Activities', createList(pkg.optionalActivities, '!', 'package-modal__icon--optional')));
    }
    content.append(createSection('Exclusions', createList(pkg.exclusions, '-', 'package-modal__icon--excluded')));

    if (pkg.notes && pkg.notes.length) {
      content.append(createSection('Notes', createList(pkg.notes, 'i'), { wide: true }));
    }

    const actions = createEl('div', 'package-modal__actions');
    const closeBtn = createEl('button', 'package-modal__btn package-modal__btn--ghost', 'Close');
    closeBtn.type = 'button';
    closeBtn.addEventListener('click', closeModal);

    const inquireBtn = createEl('button', 'package-modal__btn package-modal__btn--primary', 'Inquire This Package');
    inquireBtn.type = 'button';
    inquireBtn.addEventListener('click', () => {
      window.location.href = `contact?package=${encodeURIComponent(currentPackage.title)}`;
    });

    actions.append(closeBtn, inquireBtn);
    scroll.append(hero, content, actions);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('package-modal-open');
  };

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('package-modal-open');
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('.btn-details[data-package-id]');
    if (!trigger) return;

    const pkg = data[trigger.dataset.packageId];
    if (!pkg) return;

    event.preventDefault();
    openModal(pkg);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
})();
