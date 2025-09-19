// Example/Mock embedded Age key for CI/testing
// This contains dummy keys that don't decrypt real secrets

// Mock private key parts (not a real key)
const privateKeyParts = [
  'AGE-SECRET-KEY-1EXAMPLE-MOCK-KEY-FOR-TESTING-ONLY-NOT-REAL',
  'ABCDEF123456'
];

// Mock public key parts (not a real key)
const publicKeyParts = [
  'age1mock-example-key-for-testing-only-not-real-secrets-here',
  'example'
];

// Simple obfuscation function
const getEmbeddedAgeKey = () => {
  return privateKeyParts.join('');
};

const getEmbeddedAgePublicKey = () => {
  return publicKeyParts.join('');
};

export { getEmbeddedAgeKey, getEmbeddedAgePublicKey };