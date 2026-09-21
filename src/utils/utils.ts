export function createShareCode() {
  try {
    const random = new Uint32Array(6);
    crypto.getRandomValues(random);
    const allNumbers = random.join('');
    const integer = parseInt(allNumbers, 10);
    // a-z, 0-9 = 26 letters + 10 numbers = 36
    const allCharactersString = integer.toString(36);
    const sixCharacters = allCharactersString.slice(0, 6).toUpperCase();
    return sixCharacters;
  } catch (error: any) {
    console.error('unable to create shareCode', {error});
    return '';
  }
}
