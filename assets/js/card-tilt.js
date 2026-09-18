import { prefersReducedMotion } from './utils.js';

/**
 * 마우스 위치에 따라 요소에 3D 원근 틸트를 적용한다.
 * 단일 책임: 틸트 계산과 적용만 — 어떤 요소에 걸지는 selector로 주입받는다(개방-폐쇄:
 * 새 대상을 틸트시키고 싶으면 이 클래스를 고치지 않고 selector만 바꾸면 된다).
 */
export class CardTilt {
  constructor(selector, options = {}) {
    this.selector = selector;
    this.perspective = options.perspective ?? 900;
    this.maxAngle = options.maxAngle ?? 8;
    this.lift = options.lift ?? -4;
  }

  start() {
    if (prefersReducedMotion()) return;
    document.querySelectorAll(this.selector).forEach((card) => this._bind(card));
  }

  _bind(card) {
    card.addEventListener('mousemove', (e) => this._tilt(card, e));
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });  // CSS hover 상태로 복귀
  }

  _tilt(card, e) {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform =
      `perspective(${this.perspective}px) ` +
      `rotateX(${(-py * this.maxAngle).toFixed(2)}deg) ` +
      `rotateY(${(px * this.maxAngle).toFixed(2)}deg) ` +
      `translateY(${this.lift}px)`;
  }
}
