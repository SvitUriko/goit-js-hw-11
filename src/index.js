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

let page = 1;
let totalPage;
let searchQueryValue;

const form = document.querySelector('.search-form');
const wrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';

loadMoreBtn.addEventListener('click', onLoadMore);
form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  searchQueryValue = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchQueryValue) {
    return;
  }
  loadMoreBtn.style.display = 'block';
  wrapper.innerHTML = '';
  renderContainer(searchQueryValue, page);
}

function onLoadMore() {
  page += 1;
  renderContainer(searchQueryValue, page);
}

async function renderContainer(value, page) {
  const { hits, totalHits } = await fetchImages(value, page);
  checkTotalPages(totalHits);
  addEventListener('scroll', scroll);
  
  try {
    wrapper.insertAdjacentHTML('beforeend', generateContentList(hits));
    addEventListener('scroll', scroll);
    lightbox.refresh();
    
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    
    if (page >= totalPage) {
      loadMoreBtn.style.display = 'none';
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (page === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
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
        renderContainer(searchQueryValue, page);
    }
  }
  