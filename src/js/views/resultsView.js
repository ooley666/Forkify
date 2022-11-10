import View from './View';
import PreviewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector(`.results`);
  _message = `No recipies found, try again`;
  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join(``);
  }
}
export default new ResultsView();
