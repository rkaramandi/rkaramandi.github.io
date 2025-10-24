// Post page JavaScript

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Auto-generate Table of Contents
document.addEventListener('DOMContentLoaded', function() {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  const postContent = document.querySelector('.post-content');
  const headings = postContent.querySelectorAll('h2, h3');

  if (headings.length === 0) return;

  const ul = document.createElement('ul');
  headings.forEach((heading, index) => {
    const id = 'heading-' + index;
    heading.id = id;

    const li = document.createElement('li');
    if (heading.tagName === 'H3') {
      li.classList.add('toc-h3');
    }

    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = heading.textContent;
    li.appendChild(a);
    ul.appendChild(li);
  });

  tocList.appendChild(ul);

  // Toggle Table of Contents
  const tocToggle = document.getElementById('toc-toggle');
  if (tocToggle) {
    tocToggle.style.cursor = 'pointer';
    tocToggle.addEventListener('click', function() {
      tocList.classList.toggle('toc-collapsed');
      const chevron = tocToggle.querySelector('.toc-chevron');
      if (chevron) {
        chevron.classList.toggle('rotated');
      }
    });
  }
});
