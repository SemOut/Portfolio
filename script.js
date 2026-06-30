const yearElement = document.getElementById('currentYear');
const emailBtn = document.querySelector('.email-btn');

document.addEventListener('DOMContentLoaded', () => {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      const addr = emailBtn.dataset.email;
      if (addr) window.location.href = `mailto:${addr}`;
    });
  }
});
