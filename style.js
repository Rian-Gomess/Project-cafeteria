document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
}

// close mobile nav when a link is clicked
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 800) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
}));

// smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';

// review form handling
const reviewForm = document.getElementById('reviewForm');
const reviewsGrid = document.getElementById('reviewsGrid');
const toast = document.getElementById('toast');

function escapeHtml(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }

function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2800);
}

if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = (document.getElementById('reviewer').value || 'Anônimo').trim();
        const rating = reviewForm.querySelector('input[name="rating"]:checked')?.value || '5';
        const comment = (document.getElementById('comment').value || '').trim();

        const block = document.createElement('blockquote');
        block.className = 'review';
        block.innerHTML = `<p>${escapeHtml(comment || 'Gostei!')}</p><footer>— ${escapeHtml(name)}, ${escapeHtml(rating)}★</footer>`;
        reviewsGrid.prepend(block);
        reviewForm.reset();
        showToast('Avaliação enviada — obrigado!');

        // persist locally (simples)
        try {
            const stored = JSON.parse(localStorage.getItem('caf_reviews') || '[]');
            stored.unshift({ name, rating, comment, t: Date.now() });
            localStorage.setItem('caf_reviews', JSON.stringify(stored.slice(0, 50)));
        } catch (err) { }
    });
}

// load stored reviews
(function loadStored() {
    try {
        const stored = JSON.parse(localStorage.getItem('caf_reviews') || '[]');
        stored.forEach(r => {
            const block = document.createElement('blockquote');
            block.className = 'review';
            block.innerHTML = `<p>${escapeHtml(r.comment || '')}</p><footer>— ${escapeHtml(r.name || 'Anônimo')}, ${escapeHtml(r.rating || '5')}★</footer>`;
            reviewsGrid.append(block);
        });
    } catch (e) { }
})();

// Theme toggle and persistence
(function themeInit() {
    const KEY = 'caf_theme';
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function applyTheme(t) {
        if (t === 'dark') document.documentElement.classList.add('dark-theme');
        else document.documentElement.classList.remove('dark-theme');
        btn.textContent = t === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-pressed', String(t === 'dark'));
    }

    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { }
    if (!stored) {
        stored = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    applyTheme(stored);

    btn.addEventListener('click', () => {
        const cur = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(KEY, next); } catch (e) { }
    });
})();

// trigger entrance animations after small delay
try {
    setTimeout(() => document.documentElement.classList.add('animate'), 80);
} catch (e) { }