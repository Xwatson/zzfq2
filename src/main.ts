import './style.css';
import { formatTime } from './timer/format';

const POMODORO_MS = 25 * 60 * 1000;

// 占位渲染，只证明骨架可运行；正式页面见 ZZF-4
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = `<main class="timer"><p class="time" data-testid="time">${formatTime(POMODORO_MS)}</p></main>`;
}
