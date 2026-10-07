const SHARE_CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SHARE_CODE_LENGTH = 6;

// Each character is drawn uniformly from 0-9 and A-Z. Random bytes of 252 or
// more are discarded, since 256 isn't a multiple of 36 and keeping them would
// favor the first few characters.
export function createShareCode() {
  const limit = 256 - (256 % SHARE_CODE_ALPHABET.length);
  let code = '';
  while (code.length < SHARE_CODE_LENGTH) {
    const bytes = crypto.getRandomValues(new Uint8Array(SHARE_CODE_LENGTH * 2));
    for (const byte of bytes) {
      if (byte < limit && code.length < SHARE_CODE_LENGTH) {
        code += SHARE_CODE_ALPHABET[byte % SHARE_CODE_ALPHABET.length];
      }
    }
  }
  return code;
}
