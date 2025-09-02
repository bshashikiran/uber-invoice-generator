// Utility to get a random driver name from the list
export async function getRandomDriverName(): Promise<string> {
  const base = import.meta.env.BASE_URL || '/';
  const response = await fetch(base + 'karnataka_driver_names.txt');
  const text = await response.text();
  const names = text.split('\n').map(n => n.trim()).filter(Boolean);
  if (names.length === 0) return '';
  const idx = Math.floor(Math.random() * names.length);
  return names[idx];
}
