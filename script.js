if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

const yearElement = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
const formSubject = document.getElementById('formSubject');

document.addEventListener('DOMContentLoaded', () => {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

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
