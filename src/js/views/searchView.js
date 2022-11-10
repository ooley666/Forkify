class SearchView {
  _parentElement = document.querySelector(`.search`);

  getQuery() {
    const query = this._parentElement.querySelector(`.search__field`).value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentElement.querySelector(`.search__field`).value = ``;
  }

  //adding a handler via PUB/SUB
  addSearchHandler(handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
