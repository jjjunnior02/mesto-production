function showInputError(formEl, inputEl, errorMsg, settings) {
  const errorSpan = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(settings.inputErrorClass);
  errorSpan.textContent = errorMsg;
  errorSpan.classList.add(settings.errorClass);
}

function hideInputError(formEl, inputEl, settings) {
  const errorSpan = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(settings.inputErrorClass);
  errorSpan.textContent = "";
  errorSpan.classList.remove(settings.errorClass);
}

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

const doubleSpaceRegex = /  /;
const doubleHyphenRegex = /--/;
const letterRegex = /[a-zA-Zа-яА-ЯёЁ]/;

function checkInputValidity(formEl, inputEl, settings) {
  let customError = "";

  if (inputEl.type === "url" && inputEl.value && !urlRegex.test(inputEl.value)) {
    customError = "Введите корректную ссылку, например: https://example.com/image.jpg";
  } else if (inputEl.value) {

    const trimmed = inputEl.value.trim();

    if (!letterRegex.test(trimmed)) {
      customError = "Поле должно содержать хотя бы одну букву";
    }

    else if (doubleSpaceRegex.test(inputEl.value)) {
      customError = "Два пробела подряд не допускаются";
    }

    else if (doubleHyphenRegex.test(inputEl.value)) {
      customError = "Два дефиса подряд не допускаются";
    }

    else if (inputEl.validity.patternMismatch && inputEl.dataset.errorMessage) {
      customError = inputEl.dataset.errorMessage;
    }
  }

  inputEl.setCustomValidity(customError);

  if (inputEl.validity.valid) {
    hideInputError(formEl, inputEl, settings);
  } else {
    showInputError(formEl, inputEl, inputEl.validationMessage, settings);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputEl) => !inputEl.validity.valid);
}

function disableSubmitButton(buttonEl, settings) {
  buttonEl.classList.add(settings.inactiveButtonClass);
  buttonEl.disabled = true;
}

function enableSubmitButton(buttonEl, settings) {
  buttonEl.classList.remove(settings.inactiveButtonClass);
  buttonEl.disabled = false;
}

function toggleButtonState(inputList, buttonEl, settings) {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonEl, settings);
  } else {
    enableSubmitButton(buttonEl, settings);
  }
}

function setEventListeners(formEl, settings) {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const submitBtn = formEl.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, submitBtn, settings);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      // inputEl.value = inputEl.value.trimStart();

      checkInputValidity(formEl, inputEl, settings);
      toggleButtonState(inputList, submitBtn, settings);
    });
  });
}

export function clearValidation(formEl, settings) {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const submitBtn = formEl.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, settings);
    inputEl.setCustomValidity("");
  });

  disableSubmitButton(submitBtn, settings);
}

export function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formEl) => {
    setEventListeners(formEl, settings);
  });
}
