import { describe, it, expect } from 'vitest';
import { ACCEPT_HINT } from '@/utils/fileValidation';

// fileValidation intentionally does not gate on file name or MIME type — see the
// module's doc comment. This just locks in the `<input accept>` hint shape.
describe('ACCEPT_HINT', () => {
  it('hints at .dat for the file picker', () => {
    expect(ACCEPT_HINT).toContain('.dat');
  });
});
