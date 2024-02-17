const allowedCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateRandomString(length: number) {
    let result = '';

    for (let i = length; i > 0; --i) {
        result += allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)];
    }

    return result;
}
