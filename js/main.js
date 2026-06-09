const tabsEl = document.getElementById('tabs');
const catalogEl = document.getElementById('catalog');

async function loadData() {
  const response = await fetch('./data/catalog.json');

  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные: ${response.status}`);
  }

  return response.json();
}

async function init() {
  const data = await loadData();

  console.log('Данные загружены', data);
}

init().catch((error) => {
  console.error(error);
  catalogEl.textContent = 'Не удалось загрузить каталог.';
});
