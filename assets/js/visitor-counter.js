/**
 * 네비게이션의 방문자 수(오늘 / 누적)를 GoatCounter 공개 카운터 API에서 받아 채운다.
 * GoatCounter 사이트 설정의 "Allow adding visitor counts on your website"가 켜져 있어야 한다.
 * 응답은 GoatCounter 쪽에서 최대 4시간 캐시되므로 숫자가 실시간은 아니다.
 * 받아오지 못하면(설정 꺼짐·네트워크 오류) 요소를 숨긴 채로 둔다.
 */
export class VisitorCounter {
  constructor({ root, today, total, endpoint } = {}) {
    this.root = root;
    this.today = today;
    this.total = total;
    this.endpoint = endpoint;
  }

  async start() {
    if (!this.root || !this.endpoint) return;
    try {
      const [today, total] = await Promise.all([
        this._fetchCount({ start: this._localDate() }),
        this._fetchCount(),
      ]);
      this.today.textContent = today;
      this.total.textContent = total;
      this.root.hidden = false;
    } catch (e) {
      // 통계는 부가 정보라 실패해도 조용히 숨긴다.
    }
  }

  async _fetchCount(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${this.endpoint}/counter/TOTAL.json${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (res.status === 404) return '0';            // 해당 기간에 기록이 없을 때
    if (!res.ok) throw new Error(`counter ${res.status}`);
    const data = await res.json();
    return data.count;                              // 천 단위 구분자가 들어간 문자열
  }

  _localDate() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}
