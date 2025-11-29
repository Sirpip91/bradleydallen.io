const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
  toggle.textContent = savedTheme === 'dark' ? 'Light' : 'Dark';
}

// Toggle theme on click
toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  // Update button text
  toggle.textContent = next === 'dark' ? 'Light' : 'Dark';
});
