const SEARCH_ICON = `
  <svg class="search__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 12.5C10.0376 12.5 12.5 10.0376 12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7C1.5 10.0376 3.96243 12.5 7 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 14L11.1 11.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderHeader(container, page) {
  container.innerHTML = `
    <p class="courses__subtitle">${escapeHtml(page.subtitle)}</p>
    <h1 class="courses__title">${escapeHtml(page.title)}</h1>
  `;
}

export function renderFilters(container, categories, activeCategory, counts) {
  const buttons = categories
    .map((category) => {
      const isActive = category.id === activeCategory;
      const activeClass = isActive ? ' filter__button--active' : '';

      return `
        <li class="filter__item">
          <button
            class="filter__button${activeClass}"
            type="button"
            data-category="${escapeHtml(category.id)}"
            ${isActive ? 'aria-current="true"' : ''}
          >
            <span class="filter__label">${escapeHtml(category.label)}</span><sup class="filter__count">${escapeHtml(counts[category.id] ?? 0)}</sup>
          </button>
        </li>
      `;
    })
    .join('');

  container.innerHTML = `
    <ul class="filter__list">
      ${buttons}
    </ul>
  `;
}

export function renderSearch(container, searchQuery) {
  container.innerHTML = `
    <div class="search">
      <input
        class="search__input"
        type="search"
        name="search"
        placeholder="Search course..."
        value="${escapeHtml(searchQuery)}"
        autocomplete="off"
        aria-label="Search course"
      />
      ${SEARCH_ICON}
    </div>
  `;
}

function createCourseCard(item, categoryLabels) {
  const categoryLabel = categoryLabels[item.category] ?? item.category;

  return `
    <li class="courses__item">
      <article class="course-card">
        <div class="course-card__image-wrap">
          <img
            class="course-card__image"
            src="${escapeHtml(item.image)}"
            alt="${escapeHtml(item.title)}"
            loading="lazy"
            width="390"
            height="240"
          />
        </div>
        <div class="course-card__body">
          <span class="course-card__badge course-card__badge--${escapeHtml(item.category)}">
            ${escapeHtml(categoryLabel)}
          </span>
          <h2 class="course-card__title">${escapeHtml(item.title)}</h2>
          <div class="course-card__meta">
            <span class="course-card__price">$${escapeHtml(item.price)}</span>
            <span class="course-card__divider">|</span>
            <span class="course-card__author">by ${escapeHtml(item.author)}</span>
          </div>
        </div>
      </article>
    </li>
  `;
}

export function renderCourseList(container, items, categoryLabels) {
  container.innerHTML = items
    .map((item) => createCourseCard(item, categoryLabels))
    .join('');
}

export function renderEmptyState(container, isVisible) {
  container.hidden = !isVisible;
}

export function renderLoadMore(container, isVisible) {
  if (!isVisible) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <button class="load-more" type="button">
      <img
        class="load-more__icon"
        src="images/icons/load.svg"
        alt=""
        width="24"
        height="24"
        aria-hidden="true"
      />
      <span class="load-more__text">Load more</span>
    </button>
  `;
}
