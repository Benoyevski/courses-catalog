export async function loadCatalog() {
  const response = await fetch('./data/catalog.json');

  if (!response.ok) {
    throw new Error(`Failed to load catalog: ${response.status}`);
  }

  return response.json();
}
