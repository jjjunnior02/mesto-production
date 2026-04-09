// --- Приватные функции (не экспортируются) ---
// Вспомогательные функции для работы валидации, используются только внутри модуля

// Функция отображения ошибки для конкретного поля ввода
function showInputError(formEl, inputEl, errorMsg, settings) {
  const errorSpan = formEl.querySelector(`#${inputEl.id}-error`); // Находим span для ошибки
  inputEl.classList.add(settings.inputErrorClass); // Добавляем класс ошибки полю
  errorSpan.textContent = errorMsg; // Устанавливаем текст ошибки
  errorSpan.classList.add(settings.errorClass); // Показываем ошибку (добавляем класс видимости)
}

// Функция скрытия ошибки для конкретного поля ввода
function hideInputError(formEl, inputEl, settings) {
  const errorSpan = formEl.querySelector(`#${inputEl.id}-error`); // Находим span для ошибки
  inputEl.classList.remove(settings.inputErrorClass); // Убираем класс ошибки у поля
  errorSpan.textContent = ""; // Очищаем текст ошибки
  errorSpan.classList.remove(settings.errorClass); // Скрываем ошибку (убираем класс видимости)
}

// Функция проверки валидности одного поля ввода
function checkInputValidity(formEl, inputEl, settings) {
  // Если символы не соответствуют паттерну, устанавливаем пользовательское сообщение
  if (inputEl.validity.patternMismatch && inputEl.dataset.errorMessage) {
    inputEl.setCustomValidity(inputEl.dataset.errorMessage); // Устанавливаем кастомное сообщение
  } else {
    inputEl.setCustomValidity(""); // Сбрасываем кастомное сообщение
  }

  // Если поле валидно, скрываем ошибку, иначе показываем
  if (inputEl.validity.valid) {
    hideInputError(formEl, inputEl, settings);
  } else {
    showInputError(formEl, inputEl, inputEl.validationMessage, settings);
  }
}

// Функция проверки наличия хотя бы одного невалидного поля в списке
function hasInvalidInput(inputList) {
  // Возвращает true, если есть хотя бы одно невалидное поле
  return inputList.some((inputEl) => !inputEl.validity.valid);
}

// Функция отключения кнопки отправки формы
function disableSubmitButton(buttonEl, settings) {
  buttonEl.classList.add(settings.inactiveButtonClass); // Добавляем класс неактивной кнопки
  buttonEl.disabled = true; // Блокируем кнопку
}

// Функция включения кнопки отправки формы
function enableSubmitButton(buttonEl, settings) {
  buttonEl.classList.remove(settings.inactiveButtonClass); // Убираем класс неактивной кнопки
  buttonEl.disabled = false; // Разблокируем кнопку
}

// Функция переключения состояния кнопки в зависимости от валидности всех полей
function toggleButtonState(inputList, buttonEl, settings) {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonEl, settings); // Если есть ошибки, отключаем кнопку
  } else {
    enableSubmitButton(buttonEl, settings); // Если всё валидно, включаем кнопку
  }
}

// Функция установки слушателей событий на форму и её поля
function setEventListeners(formEl, settings) {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector)); // Все поля ввода
  const submitBtn = formEl.querySelector(settings.submitButtonSelector); // Кнопка отправки

  toggleButtonState(inputList, submitBtn, settings); // Устанавливаем начальное состояние кнопки

  // Навешиваем обработчик на каждое поле ввода
  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, settings); // Проверяем валидность при вводе
      toggleButtonState(inputList, submitBtn, settings); // Обновляем состояние кнопки
    });
  });
}

// --- Публичные функции (экспортируются) ---
// Эти функции используются извне модуля (в index.js)

// Функция очистки валидации формы (вызывается при открытии модального окна)
export function clearValidation(formEl, settings) {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector)); // Все поля
  const submitBtn = formEl.querySelector(settings.submitButtonSelector); // Кнопка

  // Сбрасываем ошибки для каждого поля
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, settings); // Скрываем визуальные ошибки
    inputEl.setCustomValidity(""); // Очищаем кастомные сообщения валидации
  });

  disableSubmitButton(submitBtn, settings); // Отключаем кнопку (форма будет считаться невалидной)
}

// Функция включения валидации для всех форм на странице
export function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector)); // Находим все формы
  formList.forEach((formEl) => {
    setEventListeners(formEl, settings); // Навешиваем обработчики на каждую форму
  });
}
