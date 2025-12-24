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

  // Add copy buttons to code blocks
  const codeBlocks = document.querySelectorAll('.post-content pre');
  codeBlocks.forEach(function(pre) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.innerHTML = '<i class="fa fa-copy"></i><span>Copy</span>';

    button.addEventListener('click', function() {
      const code = pre.querySelector('code');
      const text = code.textContent;

      // Use Clipboard API with fallback
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          showCopiedFeedback(button);
        }).catch(function() {
          fallbackCopy(text, button);
        });
      } else {
        fallbackCopy(text, button);
      }
    });

    pre.appendChild(button);
  });

  // Fallback copy method for older browsers
  function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      showCopiedFeedback(button);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }

    document.body.removeChild(textarea);
  }

  // Show copied feedback
  function showCopiedFeedback(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fa fa-check"></i><span>Copied!</span>';
    button.classList.add('copied');

    setTimeout(function() {
      button.innerHTML = originalHTML;
      button.classList.remove('copied');
    }, 2000);
  }

  // Lazy loading for images
  const images = document.querySelectorAll('.post-content img');

  // Skip if no images or IntersectionObserver not supported
  if (images.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    images.forEach(function(img) {
      // Skip navigation logo and images already loaded
      if (img.closest('.navbar')) return;

      // Move src to data-src for lazy loading
      const src = img.getAttribute('src');
      if (src && !img.hasAttribute('data-src')) {
        img.setAttribute('data-src', src);
        img.removeAttribute('src');
        img.setAttribute('loading', 'lazy');
      }

      imageObserver.observe(img);
    });
  } else {
    // Fallback: Add native lazy loading attribute
    images.forEach(function(img) {
      if (!img.closest('.navbar')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
});
