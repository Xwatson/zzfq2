import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatTime } from './format';

describe('formatTime', () => {
  it('25 分钟显示为 25:00', () => {
    expect(formatTime(25 * 60 * 1000)).toBe('25:00');
  });

  it('0 显示为 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('59 秒显示为 00:59', () => {
    expect(formatTime(59 * 1000)).toBe('00:59');
  });

  it('不足一秒向上取整，负数按 0 处理', () => {
    expect(formatTime(59_001)).toBe('01:00');
    expect(formatTime(-500)).toBe('00:00');
  });
});

// 假计时器模板：后续计时用例按此写法，用结束时间戳 - Date.now() 计算剩余时间
// TODO(ZZF-5)：加入计时模块后，把这组用例移到对应的测试文件
describe('假计时器示例', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('推进系统时间后剩余时间随之减少', () => {
    const endAt = Date.now() + 25 * 60 * 1000;

    vi.advanceTimersByTime(61 * 1000);

    expect(formatTime(endAt - Date.now())).toBe('23:59');
  });
});
