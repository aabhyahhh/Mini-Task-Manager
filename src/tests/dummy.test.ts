// src/tests/dummy.test.ts
import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should run a dummy test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have vitest globals available', () => {
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
    expect(expect).toBeDefined();
  });
});

