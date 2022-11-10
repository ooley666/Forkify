import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector(`.pagination`);
  addClickHandler(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--inline`);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.pageN;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    //PAGE 1 THERE ARE OTHER PAGES
    if (currentPage === 1 && numPages > 1)
      return this._generateButton(`next`, currentPage);

    //OTHER PAGE
    if (numPages > currentPage)
      return (
        this._generateButton(`prev`, currentPage) +
        this._generateButton(`next`, currentPage)
      );
    //LAST PAGE
    if (currentPage === numPages)
      return this._generateButton(`prev`, currentPage);
    //PAGE 1 NO OTHER PAGES
    return ``;
  }
  _generateButton(type, currentPage) {
    return `
    <button class="btn--inline pagination__btn--${type}" data-goto="${
      type === `prev` ? +currentPage - 1 : +currentPage + 1
    }" = >
                      <svg class="search__icon">
                        <use href="${icons}#icon-arrow-${
      type === `prev` ? `left` : `right`
    }"></use>
                      </svg>
                      <span>Page ${
                        type === `prev` ? +currentPage - 1 : +currentPage + 1
                      }</span>
                    </button>
    `;
  }
}
export default new PaginationView();
