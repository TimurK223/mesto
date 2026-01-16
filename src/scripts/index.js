/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getCardList, getUserInfo, setUserInfo, setUserAvatar, addNewCard, deleteCardApi,changeLikeCardStatus } from "./components/api.js";
// DOM узлы
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

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const deleteCardModalWindow = document.querySelector(".popup_type_remove-card");
const deleteCardForm = deleteCardModalWindow.querySelector(".popup__form");
const deleteCardButton = deleteCardForm.querySelector(".popup__button");


const infoModalWindow = document.querySelector(".popup_type_info");
const infoTitle = infoModalWindow.querySelector(".popup__title");
const infoList = infoModalWindow.querySelector(".popup__info");
const infoText = infoModalWindow.querySelector(".popup__text");
const infoUserList = infoModalWindow.querySelector(".popup__list");

const logo = document.querySelector(".header__logo"); 

// Настройки валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

let currentUserId = null;


const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.classList.add(validationSettings.inactiveButtonClass)
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name; // имя
      profileDescription.textContent = userData.about; 
      closeModalWindow(profileFormModalWindow)
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.classList.add(validationSettings.inactiveButtonClass)
  setUserAvatar({avatar: avatarInput.value})
  .then((userData) => {
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    closeModalWindow(avatarFormModalWindow);
  })
  .catch((err) => {
      console.log(err);
    })
  .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = cardForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  submitButton.classList.add(validationSettings.inactiveButtonClass)
  addNewCard({name: cardNameInput.value, link: cardLinkInput.value})
  .then((cardData )=>{
    const cardElement = createCardElement(
          {
            name: cardData.name,
            link: cardData.link,
            likes: cardData.likes, 
            cardId: cardData._id, 
            ownerId: cardData.owner._id, 
            userId: currentUserId,
          },
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: handleLikeCard,
            onDeleteCard: deleteCard,
          }
        );
  placesWrap.prepend(cardElement);
  
  })
  .catch((err) => {
      console.log(err);
    })
  .finally(() => {
    closeModalWindow(cardFormModalWindow);
    cardForm.reset(); 
    submitButton.textContent = originalText;
  });
  
};

const handleDeleteCard = (cardElement, cardId) => {
  openModalWindow(deleteCardModalWindow)
  deleteCardForm.addEventListener("submit", () => {
    const deleteButton = deleteCardForm.querySelector('.popup__button');
    const originalText = deleteButton.textContent;
    deleteButton.textContent = 'Удаление...';
    submitButton.classList.add(validationSettings.inactiveButtonClass)
    deleteCardApi(cardId)
      .then(() => {
          cardElement.remove();
          closeModalWindow(deleteCardModalWindow);
        })
      .catch((err) => {
        console.log( err);})
      .finally(() => {
      deleteButton.textContent = originalText;
    });
      
    })
};

const handleLikeCard = (likeButton, cardId, isLiked, likeCountElement) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((card) => {
      likeCountElement.textContent = card.likes.length;
      likeCard(likeButton)
    })
    .catch((err) => {
      console.log( err);
    })  
};


// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

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



//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});


enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
      
      profileTitle.textContent = userData.name; // имя
      profileDescription.textContent = userData.about; 
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`; // ава
      currentUserId = userData._id
      placesWrap.innerHTML = ''; 
      cards.forEach((cardData) => {
        const cardElement = createCardElement(
          {
            name: cardData.name,
            link: cardData.link,
            likes: cardData.likes, 
            cardId: cardData._id, 
            ownerId: cardData.owner._id, 
            userId: userData._id,
          },
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: handleLikeCard,
            onDeleteCard: handleDeleteCard
          }
        );
        placesWrap.append(cardElement);
      });
  })
  .catch((err) => {
    console.log(err); 
  });


logo.addEventListener('click', () => {
  openModalWindow(infoModalWindow);
  
  const infoTitle = infoModalWindow.querySelector(".popup__title");
  const infoList = infoModalWindow.querySelector(".popup__info");
  
  infoTitle.textContent = 'Статистика';
  infoList.innerHTML = 'Загрузка...';
  
  getCardList()
    .then((cards) => {
      // Считаем пользователей и лайки
      const userCount = new Set(cards.map(card => card.owner._id)).size;
      const likeCount = cards.reduce((sum, card) => sum + card.likes.length, 0);
      
      
      const ownerLikes = {};
      cards.forEach(card => {
        const ownerId = card.owner._id;
        const ownerName = card.owner.name;
        const cardLikes = card.likes.length;
        
        if (!ownerLikes[ownerId]) {
          ownerLikes[ownerId] = {
            name: ownerName,
            likes: 0
          };
        }
        ownerLikes[ownerId].likes += cardLikes;
      });
      
      
      const userGivenLikes = {};
      cards.forEach(card => {
        card.likes.forEach(like => {
          const userId = like._id;
          const userName = like.name ;
          
          if (!userGivenLikes[userId]) {
            userGivenLikes[userId] = {
              name: userName,
              likesGiven: 0
            };
          }
          userGivenLikes[userId].likesGiven += 1;
        });
      });
      
      
      let mostLikedCard = null;
      let maxCardLikes = 0;
      
      cards.forEach(card => {
        if (card.likes.length > maxCardLikes) {
          maxCardLikes = card.likes.length;
          mostLikedCard = card;
        }
      });
      
      
      let maxLikesOwner = null;
      let maxLikesReceived = 0;
      
      Object.values(ownerLikes).forEach(owner => {
        if (owner.likes > maxLikesReceived) {
          maxLikesReceived = owner.likes;
          maxLikesOwner = owner;
        }
      });
      
      
      let maxLikesGivenUser = null;
      let maxLikesGiven = 0;
      
      Object.values(userGivenLikes).forEach(user => {
        if (user.likesGiven > maxLikesGiven) {
          maxLikesGiven = user.likesGiven;
          maxLikesGivenUser = user;
        }
      });
      
      infoList.innerHTML = '';
      
      
      const usersTemplate = document.getElementById('popup-info-definition-template').content.cloneNode(true);
      usersTemplate.querySelector('.popup__info-term').textContent = 'Пользователей:';
      usersTemplate.querySelector('.popup__info-description').textContent = userCount;
      infoList.appendChild(usersTemplate);
     
      const likesTemplate = document.getElementById('popup-info-definition-template').content.cloneNode(true);
      likesTemplate.querySelector('.popup__info-term').textContent = 'Всего лайков:';
      likesTemplate.querySelector('.popup__info-description').textContent = likeCount;
      infoList.appendChild(likesTemplate);
      
      
      const championTemplate = document.getElementById('popup-info-definition-template').content.cloneNode(true);
      championTemplate.querySelector('.popup__info-term').textContent = 'Лидер по лайкам:';
      
      if (maxLikesOwner) {
        championTemplate.querySelector('.popup__info-description').textContent = 
          `${maxLikesOwner.name} `;
      } else {
        championTemplate.querySelector('.popup__info-description').textContent = '';
      }
      infoList.appendChild(championTemplate);
      
     
      const maxGivenTemplate = document.getElementById('popup-info-definition-template').content.cloneNode(true);
      maxGivenTemplate.querySelector('.popup__info-term').textContent = 'Максимум поставлено:';
      
      
        maxGivenTemplate.querySelector('.popup__info-description').textContent = 
          ` ${maxLikesGiven} `;
      infoList.appendChild(maxGivenTemplate);
      
      
      const cardTemplate = document.getElementById('popup-info-definition-template').content.cloneNode(true);
      cardTemplate.querySelector('.popup__info-term').textContent = 'Популярная карточка:';
      
      if (mostLikedCard) {
        cardTemplate.querySelector('.popup__info-description').textContent = 
          `${mostLikedCard.name} `;
      } else {
        cardTemplate.querySelector('.popup__info-description').textContent = '';
      }
      infoList.appendChild(cardTemplate);
    });
});

setCloseModalWindowEventListeners(infoModalWindow);