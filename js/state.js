export const ITEMS_PER_PAGE = 9;

export function createState(data) {
  return {
    page: data.page,
    categories: data.categories,
    items: data.items,
    activeCategory: 'all',
    searchQuery: '',
    visibleCount: ITEMS_PER_PAGE,
  };
}

export function getCategoryLabels(categories) {
  return Object.fromEntries(
    categories
      .filter((category) => category.id !== 'all')
      .map((category) => [category.id, category.label]),
  );
}

function matchesSearch(item, query) {
  if (!query) {
    return true;
  }

  return item.title.toLowerCase().includes(query);
}

export function getFilteredItems(state) {
  const query = state.searchQuery.trim().toLowerCase();

  return state.items.filter((item) => {
    const matchesCategory =
      state.activeCategory === 'all' || item.category === state.activeCategory;

    return matchesCategory && matchesSearch(item, query);
  });
}

export function getCategoryCounts(state) {
  const query = state.searchQuery.trim().toLowerCase();
  const items = state.items.filter((item) => matchesSearch(item, query));
  const counts = { all: items.length };

  state.categories.forEach((category) => {
    if (category.id === 'all') {
      return;
    }

    counts[category.id] = items.filter(
      (item) => item.category === category.id,
    ).length;
  });

  return counts;
}

export function hasMoreItems(state, filteredItems) {
  return state.visibleCount < filteredItems.length;
}
