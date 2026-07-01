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
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) {
          return;
        }

        const activeHash = `#${visibleEntries[0].target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.hash === activeHash);
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0.15, 0.35, 0.5]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name')?.toString().trim() || 'A visitor';
      const email = formData.get('email')?.toString().trim() || '';
      const message = formData.get('message')?.toString().trim() || '';
      const to = contactForm.dataset.email || 's.out2527@gmail.com';
      const subject = `New message from ${name}`;

      if (formStatus) {
        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'form-status is-loading';
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      if (formSubject) {
        formSubject.value = subject;
      }

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${to}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: subject,
            _captcha: 'false',
            _template: 'table'
          })
        });

        if (!response.ok) {
          throw new Error('Unable to send message');
        }

        if (formStatus) {
          formStatus.textContent = 'Message sent! Thanks for reaching out.';
          formStatus.className = 'form-status is-success';
        }

        contactForm.reset();
        if (formSubject) {
          formSubject.value = 'New portfolio message';
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent = 'Sorry, something went wrong. Please try again later.';
          formStatus.className = 'form-status is-error';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send message';
        }
      }
    });
  }
});
