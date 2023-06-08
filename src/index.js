import './sass/index.css';

const axios = require('axios');
import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const apiKey = '28056380-7ebf030984661b6034d156d96';

const form = document.querySelector('#search-form');
const input = document.querySelector('.search-form__input');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let page = 0;
let remainingHits = 0;

form.addEventListener("submit", search);
loadBtn.addEventListener("click", loadMore)
loadBtn.classList.add('is-not-visible');
function loadMore() {
    page += 1;
    searchPhotos();
}

function search(event) {
    event.preventDefault();
    page = 1;
    gallery.innerHTML = "";

    searchPhotos();
}

function searchPhotos() {
  fetchPhotos()
      .then(photo => {
        console.log(photo);
      renderPhotos(photo.hits, photo.totalHits);   
     if (remainingHits > 0 && remainingHits < photo.totalHits) {
       loadBtn.classList.remove('is-not-visible');
     } else {
          loadBtn.classList.add('is-not-visible');
     }
    })
    .catch(error => 
      console.log(error));
    
}
  
async function fetchPhotos() {
    const params = new URLSearchParams({
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page,
    });
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${input.value}&${params}`);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

    
function renderPhotos(hits, totalHits) {
    console.log(hits)
        const markup = hits
          .map(({
              largeImageURL,
              webformatURL,
              tags,
              likes,
              views,
              comments,
              downloads,
          }) => {
           return `
            <div class="gallery__photo-card">
                <a class="gallery-link" href="${largeImageURL}"> <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
             <div class="info">
                <p class="info-item">
                    <b>Likes</b>${likes}
                </p>
                <p class="info-item">
                    <b>Views</b>${views}
                </p>
                <p class="info-item">
                    <b>Comments</b>${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>${downloads}
                </p>
            </div>
        </div>
          `;
        })
        .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    let lightbox;
     lightbox = new SimpleLightbox('.gallery a', {
       captionDelay: '250',
     });

   remainingHits = totalHits - page * 40;
    
    if (remainingHits <= 0) {
        Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
    } else if (remainingHits > 0 && remainingHits === totalHits) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        )
    } else if (remainingHits > 0 && page === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
    }

}


    
   //new simpleLightbox('.gallery a')
//    const { height: cardHeight } = document
//      .querySelector('.gallery')
//       .firstElementChild.getBoundingClientRect();

//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });
