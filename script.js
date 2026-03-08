/* ══════════════════════════════════════════════════════════════
   FAROUZ ULTIMATE DATA SCIENCE ROADMAP — INTERACTIVE SCRIPT
   ══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initParticles();
        initNavbar();
        initScrollProgress();
        initScrollAnimations();
        initCounters();
        initCards();
        initOverviewCards();
        initSearch();
        initBackToTop();
        initKeyboard();
        initKonami();
    }

    /* ══════════ PARTICLES ══════════ */
    function initParticles() {
        const c = document.getElementById('particles');
        if (!c) return;
        const ctx = c.getContext('2d');
        let W, H;
        const mouse = { x: null, y: null };
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];
        const particles = [];

        function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout', function () { mouse.x = null; mouse.y = null; });

        function Particle() { this.reset(); }
        Particle.prototype.reset = function () {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.8 + .5;
            this.dx = (Math.random() - .5) * .35;
            this.dy = (Math.random() - .5) * .35;
            this.o = Math.random() * .35 + .1;
            this.col = colors[Math.floor(Math.random() * colors.length)];
        };
        Particle.prototype.update = function () {
            this.x += this.dx;
            this.y += this.dy;
            if (mouse.x !== null) {
                var dx = mouse.x - this.x, dy = mouse.y - this.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < 130) {
                    this.x -= dx * .006;
                    this.y -= dy * .006;
                    this.o = Math.min(this.o + .015, .6);
                }
            }
            if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
        };
        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.col;
            ctx.globalAlpha = this.o;
            ctx.fill();
            ctx.globalAlpha = 1;
        };

        var count = Math.min(70, Math.floor(W / 20));
        for (var i = 0; i < count; i++) particles.push(new Particle());

        function lines() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = '#3b82f6';
                        ctx.globalAlpha = .05 * (1 - d / 130);
                        ctx.lineWidth = .5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        (function loop() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(function (p) { p.update(); p.draw(); });
            lines();
            requestAnimationFrame(loop);
        })();
    }

    /* ══════════ NAVBAR ══════════ */
    function initNavbar() {
        var nav = document.getElementById('navbar');
        var toggle = document.getElementById('navToggle');
        var links = document.getElementById('navLinks');

        toggle.addEventListener('click', function () {
            links.classList.toggle('open');
            var icon = toggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        links.querySelectorAll('.nav-link').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('open');
                var icon = toggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });

        var secs = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 50);

            var cur = '';
            secs.forEach(function (s) {
                if (window.scrollY >= s.offsetTop - 130) cur = s.id;
            });
            navLinks.forEach(function (l) {
                l.classList.remove('active');
                if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
            });
        }, { passive: true });
    }

    /* ══════════ SCROLL PROGRESS ══════════ */
    function initScrollProgress() {
        var bar = document.getElementById('scrollProgress');
        window.addEventListener('scroll', function () {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (window.scrollY / h * 100) + '%';
        }, { passive: true });
    }

    /* ══════════ SCROLL ANIMATIONS ══════════ */
    function initScrollAnimations() {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll('.anim').forEach(function (el) { obs.observe(el); });
    }

    /* ══════════ COUNTERS ══════════ */
    function initCounters() {
        var done = false;
        var area = document.querySelector('.hero-stats');
        if (!area) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting && !done) {
                    done = true;
                    document.querySelectorAll('.stat').forEach(function (s) {
                        var target = parseInt(s.dataset.count, 10);
                        var el = s.querySelector('.counter');
                        var cur = 0;
                        var inc = target / 55;
                        var t = setInterval(function () {
                            cur += inc;
                            if (cur >= target) { el.textContent = target + '+'; clearInterval(t); }
                            else el.textContent = Math.floor(cur);
                        }, 22);
                    });
                }
            });
        }, { threshold: 0.5 });
        obs.observe(area);
    }

    /* ══════════ CARD TOGGLE ═���════════ */
    function initCards() {
        document.querySelectorAll('.card-top').forEach(function (top) {
            top.addEventListener('click', function () {
                top.closest('.card').classList.toggle('collapsed');
            });
        });
    }

    /* ══════════ OVERVIEW CARDS ══════════ */
    function initOverviewCards() {
        document.querySelectorAll('.ov-card').forEach(function (c) {
            c.addEventListener('click', function () {
                var t = document.getElementById(c.dataset.target);
                if (t) t.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ══════════ SEARCH ══════════ */
    function initSearch() {
        var input = document.getElementById('searchInput');
        var count = document.getElementById('searchCount');
        if (!input) return;

        input.addEventListener('input', function () {
            var q = input.value.toLowerCase().trim();
            var cards = document.querySelectorAll('.card');
            var n = 0;

            if (!q) {
                cards.forEach(function (c) {
                    c.style.display = '';
                    c.querySelectorAll('.tl li').forEach(function (li) {
                        li.style.display = '';
                        li.innerHTML = li.textContent;
                    });
                });
                if (count) count.textContent = '';
                return;
            }

            var esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var re = new RegExp('(' + esc + ')', 'gi');

            cards.forEach(function (c) {
                var items = c.querySelectorAll('.tl li');
                var hit = false;

                items.forEach(function (li) {
                    var txt = li.textContent;
                    if (txt.toLowerCase().indexOf(q) !== -1) {
                        li.style.display = '';
                        li.innerHTML = txt.replace(re, '<mark>$1</mark>');
                        hit = true;
                        n++;
                    } else {
                        li.style.display = 'none';
                        li.innerHTML = txt;
                    }
                });

                var title = c.querySelector('h3');
                if (title && title.textContent.toLowerCase().indexOf(q) !== -1) hit = true;

                c.style.display = hit ? '' : 'none';
                if (hit) c.classList.remove('collapsed');
            });

            if (count) {
                count.textContent = n > 0
                    ? n + ' topic' + (n !== 1 ? 's' : '') + ' found'
                    : 'No topics found';
            }
        });
    }

    /* ══════════ BACK TO TOP ══════════ */
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', function () {
            btn.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ══════════ KEYBOARD SHORTCUTS ══════════ */
    function initKeyboard() {
        var input = document.getElementById('searchInput');
        document.addEventListener('keydown', function (e) {
            if (e.key === '/' && document.activeElement !== input) {
                e.preventDefault();
                if (input) input.focus();
            }
            if (e.key === 'Escape' && input) {
                input.value = '';
                input.dispatchEvent(new Event('input'));
                input.blur();
            }
        });
    }

    /* ══════════ KONAMI CODE ══════════ */
    function initKonami() {
        var code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
        var idx = 0;
        document.addEventListener('keydown', function (e) {
            if (e.key === code[idx]) {
                idx++;
                if (idx === code.length) {
                    idx = 0;
                    document.body.style.transition = 'filter 1s';
                    document.body.style.filter = 'hue-rotate(180deg)';
                    setTimeout(function () { document.body.style.filter = ''; }, 3000);
                }
            } else {
                idx = 0;
            }
        });
    }

})();