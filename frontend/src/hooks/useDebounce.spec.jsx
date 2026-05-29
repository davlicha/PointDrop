import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Оновлюємо значення
    rerender({ value: 'updated', delay: 500 });

    // Значення ще не повинно змінитися, бо таймер не закінчився
    expect(result.current).toBe('initial');

    // Перемотуємо час наполовину
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    // Перемотуємо час до кінця затримки
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Тепер значення має оновитися
    expect(result.current).toBe('updated');
  });

  it('should clear timeout if value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'updated 1', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Оновлюємо ще раз до того, як закінчився попередній таймер
    rerender({ value: 'updated 2', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 300 + 300 = 600ms пройшло з першого оновлення, але воно було скасоване
    // Тому значення все ще 'initial'
    expect(result.current).toBe('initial');

    // Перемотуємо час для завершення другого таймера (залишилось 200ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('updated 2');
  });
});
