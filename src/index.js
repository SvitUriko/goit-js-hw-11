import './css/style.css';
import fetchImages from './js/apiService';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { generateContentList } from './js/markupList';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

let page;
let totalPage;
let searchQueryValue;

const form = document.querySelector('.search-form');
const wrapper = document.querySelector('.gallery');

form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  searchQueryValue = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchQueryValue) {
    return;
  }

  page = 1;

  wrapper.innerHTML = '';
  renderContainer(searchQueryValue, page);
}

async function renderContainer(value, page) {
    try {
    const { hits, totalHits } = await fetchImages(value, page);
    checkTotalPages(totalHits);

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (page === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    wrapper.insertAdjacentHTML('beforeend', generateContentList(hits));
    window.addEventListener('scroll', scroll);
    lightbox.refresh();

  } catch (error) {
    console.log(error);
  }
}

function checkTotalPages(totalHits) {
  totalPage = Math.ceil(totalHits / 40);
}

function scroll() {
    const contentHeight = wrapper.offsetHeight - 500;
    const yOffset = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrolledHeight = yOffset + viewportHeight;
  
    if (scrolledHeight >= contentHeight) {
      page += 1;
      window.removeEventListener('scroll', scroll);
  
      if (page > totalPage) {
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
  
      renderContainer(searchQueryValue, page).then(() => {
        window.addEventListener('scroll', scroll);
      });
    }
  }
  
  