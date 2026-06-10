import { loadCatalog } from './api.js';
import {
  createState,
  getCategoryLabels,
  getCategoryCounts,
  getFilteredItems,
  hasMoreItems,
  ITEMS_PER_PAGE,
} from './state.js';
import {
  renderHeader,
  renderFilters,
  renderSearch,
  renderCourseList,
  appendCourseCards,
  renderEmptyState,
  renderLoadMore,
} from './render.js';

const headerEl = document.getElementById('courses-header');
const filtersEl = document.getElementById('courses-filters');
const searchEl = document.getElementById('courses-search');
const listEl = document.getElementById('courses-list');
const emptyEl = document.getElementById('courses-empty');
const loadMoreEl = document.getElementById('courses-load-more');

let state = null;
let categoryLabels = {};

function render(options = {}) {
  const { updateFilters = true, updateSearch = true } = options;
  const filteredItems = getFilteredItems(state);
  const visibleItems = filteredItems.slice(0, state.visibleCount);
  const counts = getCategoryCounts(state);

  if (updateFilters) {
    renderFilters(filtersEl, state.categories, state.activeCategory, counts);
  }

  if (updateSearch) {
    renderSearch(searchEl, state.searchQuery);
  }

  renderCourseList(listEl, visibleItems, categoryLabels);
  renderEmptyState(emptyEl, filteredItems.length === 0);
  renderLoadMore(loadMoreEl, hasMoreItems(state, filteredItems));
}

function handleClick(event) {
  const categoryButton = event.target.closest('[data-category]');

  if (categoryButton && filtersEl.contains(categoryButton)) {
    state.activeCategory = categoryButton.dataset.category;
    state.visibleCount = ITEMS_PER_PAGE;
    render({ updateSearch: false });
    return;
  }

  const loadMoreButton = event.target.closest('.load-more');

  if (loadMoreButton && loadMoreEl.contains(loadMoreButton)) {
    const filteredItems = getFilteredItems(state);
    const startIndex = state.visibleCount;

    state.visibleCount += ITEMS_PER_PAGE;

    appendCourseCards(
      listEl,
      filteredItems.slice(startIndex, state.visibleCount),
      categoryLabels,
    );
    renderLoadMore(loadMoreEl, hasMoreItems(state, filteredItems));
  }
}

function handleInput(event) {
  const searchInput = event.target.closest('.search__input');

  if (!searchInput || !searchEl.contains(searchInput)) {
    return;
  }

  state.searchQuery = searchInput.value;
  state.visibleCount = ITEMS_PER_PAGE;
  render({ updateSearch: false });
}

async function init() {
  const data = await loadCatalog();

  state = createState(data);
  categoryLabels = getCategoryLabels(state.categories);

  renderHeader(headerEl, state.page);
  render();

  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
}

init().catch((error) => {
  console.error(error);
  listEl.innerHTML = '';
  emptyEl.hidden = false;
  emptyEl.textContent = 'Failed to load catalog.';
});
