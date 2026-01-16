
export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");
  likeCountElement.textContent = data.likes.length;
  const isLiked = data.likes && data.likes.some(like => like._id === data.userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  likeButton.addEventListener("click", () => {
      const currentIsLiked = likeButton.classList.contains("card__like-button_is-active");
      onLikeIcon(likeButton, data.cardId, currentIsLiked, likeCountElement, currentIsLiked);
    });
  
  deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data.cardId));
  cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
   if (data.ownerId !== data.userId) {
    deleteButton.remove();
   }
    
   

  return cardElement;
};