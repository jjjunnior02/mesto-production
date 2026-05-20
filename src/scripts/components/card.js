const ACTIVE_LIKE_CLASS = "card__like-button_is-active";

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const removeCardElement = (cardElement) => {
  cardElement.remove();
};

export const renderLikes = (cardElement, likes, userId) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  likeCountElement.textContent = likes.length;

  if (likes.some((user) => user._id === userId)) {
    likeButton.classList.add(ACTIVE_LIKE_CLASS);
  } else {
    likeButton.classList.remove(ACTIVE_LIKE_CLASS);
  }
};

export const createCardElement = (
  cardData,
  userId,
  { onPreviewPicture, onLikeClick, onDeleteClick, onInfoClick }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;

  renderLikes(cardElement, cardData.likes, userId);

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else if (onDeleteClick) {
    deleteButton.addEventListener("click", () => {
      onDeleteClick({ cardId: cardData._id, cardElement });
    });
  }

  if (onLikeClick) {
    likeButton.addEventListener("click", () => {
      const isLiked = likeButton.classList.contains(ACTIVE_LIKE_CLASS);
      onLikeClick({ cardId: cardData._id, cardElement, isLiked });
    });
  }

  if (onInfoClick) {
    infoButton.addEventListener("click", () => {
      onInfoClick(cardData._id);
    });
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => {
      onPreviewPicture({ name: cardData.name, link: cardData.link });
    });
  }

  return cardElement;
};
