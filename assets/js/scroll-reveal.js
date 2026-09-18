import { prefersReducedMotion } from './utils.js';

/**
 * (선택자, 순차 딜레이) 쌍마다 요소에 등장 애니메이션을 건다.
 * 화면에 들어오면 .is-visible을 붙여 CSS 트랜지션(main.scss의 .reveal)이 실행되게 한다.
 * 단일 책임: 오직 "언제 .is-visible을 붙일지"만 결정한다 — 실제 애니메이션 값은 CSS의 몫이다.
 */
export class ScrollReveal {
  constructor(groups, options = {}) {
    this.groups = groups;
    this.threshold = options.threshold ?? 0.12;
    this.rootMargin = options.rootMargin ?? '0px 0px -40px 0px';
    this.maxDelay = options.maxDelay ?? 320;
  }

  start() {
    const targets = this._prepareTargets();
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: this.threshold, rootMargin: this.rootMargin });
    targets.forEach((el) => observer.observe(el));
  }

  _prepareTargets() {
    const targets = [];
    this.groups.forEach(([selector, delayStep]) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(i * delayStep, this.maxDelay)}ms`;
        targets.push(el);
      });
    });
    return targets;
  }
}
