import { prefersReducedMotion } from './utils.js';

/**
 * 일정 높이 이상 스크롤하면 나타나는 "맨 위로" 버튼.
 * 단일 책임: 버튼의 표시 여부와 스크롤 동작만 담당한다.
 * 나타나는 기준 높이는 생성자 옵션으로 주입받는다(개방-폐쇄).
 */
export class BackToTop {
  constructor(button, options = {}) {
    this.button = button;
    this.showAfter = options.showAfter ?? 400;
  }

  start() {
    if (!this.button) return;
    const sync = () => {
      this.button.classList.toggle('is-shown', window.scrollY > this.showAfter);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }
}
