export const CapricePrompts = {
  greetings: "Hi, I'm Caprice. Your fun buddy.",
  askName: 'May i please know yor name.',
  howAreYou: 'How are you doing today?',
};

// Since NER models were performing very badly
// This is a temp solution, Although they perform better for non indian names
export const NameResponseTemplate = [
  'my name is',
  'my name',
  'name is',
  'yes ',
  'sure ',
  'yeah ',
];

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
