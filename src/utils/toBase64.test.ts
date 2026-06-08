import { describe, expect, it } from 'vitest';
import { toBase64 } from './toBase64';

describe('toBase64', () => {
  it('converts a file to a data URL string', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const result = await toBase64(file);

    expect(result).toMatch(/^data:image\/png;base64,/);
  });
});
