function createCardMarkup(imageCard) {
return `
<div class="photo-card">
    <a href="${imageCard.largeImageURL}"><img src="${imageCard.webformatURL}" alt="${imageCard.tags}" class="img"/></a>
    <div class="info">
    <p class="info-item">
        <b>Likes</b>
        ${imageCard.likes}
    </p>
    <p class="info-item">
        <b>Views</b>
        ${imageCard.views}
    </p>
    <p class="info-item">
        <b>Comments</b>
        ${imageCard.comments}
    </p>
    <p class="info-item">
        <b>Downloads</b>
        ${imageCard.downloads}
    </p>
    </div>
</div>`;
}

function generateContentList(array) {
return array.map(createCardMarkup).join('');
}

export { generateContentList };
