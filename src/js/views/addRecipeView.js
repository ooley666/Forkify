import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector(`.upload`);
  _message = 'Recipe was successfully uploaded✅';
  _window = document.querySelector(`.add-recipe-window`);
  _overlay = document.querySelector(`.overlay`);
  _btnOpenModal = document.querySelector(`.nav__btn--add-recipe`);
  _btnCloseModal = document.querySelector(`.btn--close-modal`);
  constructor() {
    super();
    this._addOpenModalHandler();
    this._addCloseModalHandler();
  }
  _toggleHidden() {
    this._overlay.classList.toggle(`hidden`);
    this._window.classList.toggle(`hidden`);
  }
  _addOpenModalHandler() {
    this._btnOpenModal.addEventListener(`click`, this._toggleHidden.bind(this));
  }

  _addCloseModalHandler() {
    [this._btnCloseModal, this._overlay].forEach(target =>
      target.addEventListener(`click`, this._toggleHidden.bind(this))
    );
  }

  addUploadHandler(handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}
export default new AddRecipeView();
