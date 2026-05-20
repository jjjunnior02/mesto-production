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

function checkInputValidity(formEl, inputEl, settings) {
  if (inputEl.validity.patternMismatch && inputEl.dataset.errorMessage) {
    inputEl.setCustomValidity(inputEl.dataset.errorMessage);
  } else {
    inputEl.setCustomValidity("");
  }

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
