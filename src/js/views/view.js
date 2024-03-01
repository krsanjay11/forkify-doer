import icons from 'url:../../img/icons.svg'; // parcel 2 - static assest that are not programming files like images, videos or sound files 

export default class View {    
    _data;
    /**
     * Render the received obect to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe ) // {what we expect} varName
     * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM //{expect} []- optional representation
     * @returns {undefined | string} A markup string is return if render=false
     * @this {Object} View instance
     * @author Sanjay Kumar
     * @todo Finish implementation
     */
    render(data, render = true){
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        // console.log('render complete');
    }

    update(data){
        // if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup); // convert string into real DOM node object, a virtual DOM, which live in memory not page
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        // console.log(curElements);
        // console.log(newElements);

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl)); // compare content, <svg class="search__icon"> true
            // update changed TEXT
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                // console.log('------->', newEl.firstChild.nodeValue.trim());// -------> 1 1/4
                curEl.textContent = newEl.textContent; 
            }

            // updates changed ATTRIBUTES
            if(!newEl.isEqualNode(curEl)){
                // console.log(newEl.attributes);// NamedNodeMap {0: class, 1: data-update-to, class: class, data-update-to: data-update-to, length: 2}
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        });
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage){
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message){
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}