import View from './view.js';
import icons from 'url:../../img/icons.svg'; 

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this,this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline'); // parent of area where it clicked, btn--inline is parent of that area
            if(!btn) return ;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // console.log(numPages);
        // page 1, and there are other pages
        if(curPage === 1 && numPages > 1){
            return this._generateMarkupRightBtn(curPage);
        }
        
        // last page
        if(curPage === numPages && numPages > 1){
            return this._generateMarkupLeftBtn(curPage);
        }
        // other page
        if(curPage < numPages){
            return [this._generateMarkupLeftBtn(curPage), this._generateMarkupRightBtn(curPage)].join('');
        }

        // page 1, and there are No other pages
        return '';
    }

    _generateMarkupLeftBtn(page){
        return `
            <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>
        `
    }

    _generateMarkupRightBtn(page){
        return `
            <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `
    }
}

export default new PaginationView();