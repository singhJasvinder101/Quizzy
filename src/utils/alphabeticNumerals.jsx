export const alphanumeric = (index) => {
    const asciiCode = index + 65;
    const letter = String.fromCharCode(asciiCode);
    return letter + ". ";
};