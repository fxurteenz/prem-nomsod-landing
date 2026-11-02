/**
 * มอมอนมสด (Mo Mo Nomsod) - Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatus();
  initMobileDrawer();
  initMenuFilter();
  initImageDialog();
  initScrollSpy();
  initCurrentYear();
});

/**
 * 1. Live Store Status (17:00 - 22:00)
 */
function initLiveStatus() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (!statusDot || !statusText) return;

  function updateStatus() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;

    // 17:00 = 17 * 60 = 1020 minutes
    // 22:00 = 22 * 60 = 1320 minutes
    const openTimeInMinutes = 17 * 60;
    const closeTimeInMinutes = 22 * 60;

    if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
      statusDot.classList.remove('closed');
      statusText.textContent = 'ตอนนี้ร้านเปิดบริการอยู่ (17:00 - 22:00 น.)';
      statusText.style.color = '#86efac';
    } else {
      statusDot.classList.add('closed');
      statusText.textContent = 'ตอนนี้ร้านปิด (เปิดบริการวันนี้ 17:00 - 22:00 น.)';
      statusText.style.color = '#fca5a5';
    }
  }

  updateStatus();
  // Refresh every minute
  setInterval(updateStatus, 60000);
}

/**
 * 2. Mobile Drawer Navigation
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 3. Menu Category Filter
 */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 4. Image Lightbox with native <dialog>
 */
function initImageDialog() {
  const dialog = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('dialogCloseBtn');
  const viewButtons = document.querySelectorAll('.view-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!dialog || !modalImg || !modalCaption) return;

  function openModal(imgSrc, titleText) {
    modalImg.src = imgSrc;
    modalImg.alt = titleText;
    modalCaption.textContent = titleText;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dialog.close();
    document.body.style.overflow = '';
  }

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      openModal(imgSrc, title);
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const heading = item.querySelector('h4');
      if (img) {
        const title = heading ? heading.textContent : 'บรรยากาศร้านมอมอนมสด';
        openModal(img.src, title);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click outside to close (dialog backdrop)
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeModal();
    }
  });

  dialog.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });
}

/**
 * 5. ScrollSpy & Navigation Active State
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

/**
 * 6. Dynamic Year in Footer
 */
function initCurrentYear() {
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
