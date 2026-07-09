if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const cookieConsentName = 'portfolio_cookie_consent';
const cookieConsentBannerId = 'cookie-consent-banner';
const cookieSettingsTriggerId = 'cookie-settings-trigger';
const cookieMaxAgeSeconds = 60 * 60 * 24 * 180;

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

function getCookie(cookieName) {
  const cookieEntry = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${cookieName}=`));

  return cookieEntry ? decodeURIComponent(cookieEntry.split('=').slice(1).join('=')) : '';
}

function setCookie(cookieName, cookieValue, maxAgeSeconds = cookieMaxAgeSeconds) {
  const secureAttribute = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secureAttribute}`;
}

function deleteCookie(cookieName) {
  document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function ensureCookieSettingsTrigger() {
  let trigger = document.getElementById(cookieSettingsTriggerId);

  if (trigger) {
    return trigger;
  }

  trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.id = cookieSettingsTriggerId;
  trigger.className = 'cookie-settings-trigger';
  trigger.textContent = 'Cookie settings';

  trigger.addEventListener('click', () => {
    const banner = document.getElementById(cookieConsentBannerId);

    if (banner) {
      banner.classList.add('is-visible');
      document.body.classList.add('cookie-banner-open');
      trigger.hidden = true;
    }
  });

  document.body.appendChild(trigger);
  return trigger;
}

function showCookieBanner() {
  const banner = document.getElementById(cookieConsentBannerId);
  const trigger = ensureCookieSettingsTrigger();

  if (!banner) {
    return;
  }

  banner.classList.add('is-visible');
  document.body.classList.add('cookie-banner-open');
  trigger.hidden = true;
}

function hideCookieBanner() {
  const banner = document.getElementById(cookieConsentBannerId);
  const trigger = ensureCookieSettingsTrigger();

  if (!banner) {
    return;
  }

  banner.classList.remove('is-visible');
  document.body.classList.remove('cookie-banner-open');
  trigger.hidden = false;
}

function mountCookieConsentBanner() {
  if (document.getElementById(cookieConsentBannerId)) {
    return;
  }

  const banner = document.createElement('aside');
  banner.id = cookieConsentBannerId;
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Cookie preferences');

  banner.innerHTML = `
    <div class="cookie-banner__copy">
      <p class="cookie-banner__eyebrow">Cookies</p>
      <p class="cookie-banner__title">A single first-party cookie remembers your choice.</p>
      <p class="cookie-banner__text">This portfolio uses one cookie to store whether you accepted or declined the notice. No analytics, ad tracking, or third-party cookies are used. Read the <a href="privacy-policy.html">privacy and cookie policy</a>.</p>
    </div>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-button cookie-button--ghost" data-cookie-choice="decline">Decline</button>
      <button type="button" class="cookie-button" data-cookie-choice="accept">Accept</button>
    </div>
  `;

  banner.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const choiceButton = target.closest('[data-cookie-choice]');

    if (!(choiceButton instanceof HTMLElement)) {
      return;
    }

    const choice = choiceButton.getAttribute('data-cookie-choice');

    if (choice === 'accept') {
      setCookie(cookieConsentName, 'accepted');
    } else if (choice === 'decline') {
      setCookie(cookieConsentName, 'declined');
    }

    hideCookieBanner();
  });

  document.body.appendChild(banner);
}

function initializeCookieConsent() {
  mountCookieConsentBanner();

  const consent = getCookie(cookieConsentName);

  if (consent === 'accepted' || consent === 'declined') {
    hideCookieBanner();
    return;
  }

  deleteCookie(cookieConsentName);
  showCookieBanner();
}

const yearElement = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
const formSubject = document.getElementById('formSubject');

document.addEventListener('DOMContentLoaded', () => {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  initializeCookieConsent();

  const revealSelectors = [
    '.site-header',
    '.hero-content > div',
    '.hero-card',
    '.section-header',
    '.card-panel',
    '#about .grid > div',
    '.about-list > div',
    '.project-card',
    '.skill-group',
    '.section-contact > .container',
    '.contact-form',
    '.footer-panel'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(','));

  if (revealElements.length) {
    revealElements.forEach((element) => element.classList.add('reveal'));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  if (sections.length && navLinks.length) {
    const sectionStates = new Map();

    const updateActiveLink = (activeHash) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === activeHash);
      });
    };

    const getActiveSectionHash = () => {
      const offset = window.innerHeight * 0.3;
      const targetLine = window.scrollY + offset;
      let activeSection = sections[0];

      sections.forEach((section) => {
        if (section.offsetTop <= targetLine) {
          activeSection = section;
        }
      });

      return activeSection ? `#${activeSection.id}` : '';
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => sectionStates.set(entry.target.id, entry));

        const visibleEntries = Array.from(sectionStates.values())
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        let activeHash = '';
        if (visibleEntries.length) {
          activeHash = `#${visibleEntries[0].target.id}`;
        } else if (sectionStates.size) {
          const closestEntry = Array.from(sectionStates.values()).sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          )[0];
          activeHash = `#${closestEntry.target.id}`;
        }

        updateActiveLink(activeHash);
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const refreshActiveLink = () => updateActiveLink(getActiveSectionHash());
    window.addEventListener('load', refreshActiveLink);
    window.addEventListener('resize', refreshActiveLink);
    window.addEventListener('scroll', refreshActiveLink);
    window.addEventListener('hashchange', refreshActiveLink);
    refreshActiveLink();
  }

  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const formData = new FormData(contactForm);
      const name = formData.get('name')?.toString().trim() || 'A visitor';
      const subject = `New message from ${name}`;

      if (formSubject) {
        formSubject.value = subject;
      }

      if (formStatus) {
        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'form-status is-loading';
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      // Allow native browser POST to FormSubmit for maximum reliability.
    });
  }
});
