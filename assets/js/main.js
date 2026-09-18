import { ScrollReveal } from './scroll-reveal.js';
import { CardTilt } from './card-tilt.js';
import { ModalController } from './modal.js';
import { ThemeToggle } from './theme-toggle.js';
import { BackToTop } from './back-to-top.js';

new ScrollReveal([
  ['.section__title', 0],
  ['.hero__bio, .hero__cta', 80],
  ['.card', 60],
  ['.timeline__item', 50],
  ['.skill', 25],
]).start();

new CardTilt('.card').start();

new ModalController().start();

new ThemeToggle({
  button: document.getElementById('themeToggle'),
  icon: document.getElementById('themeIcon'),
  label: document.getElementById('themeLabel'),
}).start();

new BackToTop(document.getElementById('toTop')).start();
