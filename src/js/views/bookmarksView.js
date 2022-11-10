import View from './View.js';
import PreviewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector(`.bookmarks__list`);
  _message = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _generateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join(``);
  }
  addRenderHandler(handler) {
    window.addEventListener(`load`, handler);
  }
}
export default new BookmarksView();
