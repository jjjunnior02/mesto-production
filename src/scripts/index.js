import "../pages/index.css";
import { createCardElement, removeCardElement, renderLikes } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
  deleteCard,
  changeLikeCardStatus,
} from "./components/api.js";

const placesWrap = document.querySelector(".places__list");

const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const removeCardModalWindow = document.querySelector(".popup_type_remove-card");
const removeCardForm = removeCardModalWindow.querySelector(".popup__form");

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalText = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalUserList = cardInfoModalWindow.querySelector(".popup__list");

const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template");
const infoUserPreviewTemplate = document.querySelector("#popup-info-user-preview-template");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

let currentUserId = null;
let cardToRemove = null;

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const setSubmitButtonState = (button, { isLoading, loadingText, defaultText }) => {
  button.textContent = isLoading ? loadingText : defaultText;
  button.disabled = isLoading;
};

const renderUserData = (userData) => {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleLikeClick = ({ cardId, cardElement, isLiked }) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      renderLikes(cardElement, updatedCard.likes, currentUserId);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleDeleteClick = ({ cardId, cardElement }) => {
  cardToRemove = { cardId, cardElement };
  openModalWindow(removeCardModalWindow);
};

const createInfoDefinition = (term, description) => {
  const item = infoDefinitionTemplate.content
    .querySelector(".popup__info-item")
    .cloneNode(true);
  item.querySelector(".popup__info-term").textContent = term;
  item.querySelector(".popup__info-description").textContent = description;
  return item;
};

const createInfoUserBadge = (name) => {
  const badge = infoUserPreviewTemplate.content
    .querySelector(".popup__list-item")
    .cloneNode(true);
  badge.textContent = name;
  return badge;
};

const handleInfoClick = (cardId) => {
  getCardList()
    .then((cards) => {
      const cardData = cards.find((item) => item._id === cardId);
      if (!cardData) return;

      cardInfoModalTitle.textContent = cardData.name;
      cardInfoModalInfoList.replaceChildren(
        createInfoDefinition("Автор:", cardData.owner.name),
        createInfoDefinition("Дата создания:", formatDate(new Date(cardData.createdAt))),
        createInfoDefinition("Количество лайков:", String(cardData.likes.length))
      );

      if (cardData.likes.length > 0) {
        cardInfoModalText.textContent = "Лайкнули карточку:";
        cardInfoModalUserList.replaceChildren(
          ...cardData.likes.map((user) => createInfoUserBadge(user.name))
        );
      } else {
        cardInfoModalText.textContent = "Никто ещё не лайкнул эту карточку";
        cardInfoModalUserList.replaceChildren();
      }

      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

const cardCallbacks = {
  onPreviewPicture: handlePreviewPicture,
  onLikeClick: handleLikeClick,
  onDeleteClick: handleDeleteClick,
  onInfoClick: handleInfoClick,
};

const renderInitialCards = (cards) => {
  cards.forEach((cardData) => {
    placesWrap.append(createCardElement(cardData, currentUserId, cardCallbacks));
  });
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(".popup__button");
  setSubmitButtonState(submitButton, {
    isLoading: true,
    loadingText: "Сохранение...",
    defaultText: "Сохранить",
  });

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      renderUserData(userData);
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonState(submitButton, {
        isLoading: false,
        loadingText: "Сохранение...",
        defaultText: "Сохранить",
      });
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(".popup__button");
  setSubmitButtonState(submitButton, {
    isLoading: true,
    loadingText: "Сохранение...",
    defaultText: "Сохранить",
  });

  setUserAvatar({ avatar: avatarInput.value })
    .then((userData) => {
      renderUserData(userData);
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonState(submitButton, {
        isLoading: false,
        loadingText: "Сохранение...",
        defaultText: "Сохранить",
      });
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(".popup__button");
  setSubmitButtonState(submitButton, {
    isLoading: true,
    loadingText: "Создание...",
    defaultText: "Создать",
  });

  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCardData) => {
      placesWrap.prepend(createCardElement(newCardData, currentUserId, cardCallbacks));
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonState(submitButton, {
        isLoading: false,
        loadingText: "Создание...",
        defaultText: "Создать",
      });
    });
};

const handleRemoveCardSubmit = (evt) => {
  evt.preventDefault();
  if (!cardToRemove) return;

  const submitButton = evt.target.querySelector(".popup__button");
  setSubmitButtonState(submitButton, {
    isLoading: true,
    loadingText: "Удаление...",
    defaultText: "Да",
  });

  deleteCard(cardToRemove.cardId)
    .then(() => {
      removeCardElement(cardToRemove.cardElement);
      cardToRemove = null;
      closeModalWindow(removeCardModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonState(submitButton, {
        isLoading: false,
        loadingText: "Удаление...",
        defaultText: "Да",
      });
    });
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
removeCardForm.addEventListener("submit", handleRemoveCardSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationSettings);

Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    renderUserData(userData);
    renderInitialCards(cards);
  })
  .catch((err) => {
    console.log(err);
  });
