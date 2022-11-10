import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the reieved object to the DOM
   * @param {Object | Object[]} data The data to render
   * @param {boolean} [render = true ] If it is false, just creates markup string instead of rendering
   * @returns {undefined | string} A markup string is returned in case "render" is false
   * @this {Object} a View instane
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderMsg(`message`);
    //data comes from the model.js. Everything is controlled by the controller.js
    this._data = data;
    const markup = this._generateMarkup();
    //if this works out, ten the method only returns generated markup without showing it on the page
    if (!render) return markup;
    this._clear(this._parentElement);
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
  update(data) {
    //new data from the model
    this._data = data;
    //copy of existing markup but with new data
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //new elements based on new DOm
    const newElements = Array.from(newDOM.querySelectorAll(`*`));
    //taking the current rendered elements from the page (not changed yet)
    const currentElements = Array.from(
      this._parentElement.querySelectorAll(`*`)
    );

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      //checking for nodes being different and not being parent elements (we only need text nodes)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ``
      )
        //substituting old(existing textcontent) with a newly computed one
        curEl.textContent = newEl.textContent;
      //doing the same for button dataset attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear(element) {
    element.innerHTML = ``;
  }

  //rendering spinner as the fetching goes on
  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear(this._parentElement);
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
  //renders message depending on its type (error/message) and message itself
  renderMsg(type, message = this._message) {
    const markup = ` <div class="${type}">
            <div>
              <svg>
                <use href="${icons}#icon-${
      type === `error` ? `alert-triangle` : `smile`
    }"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear(this._parentElement);
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
}
