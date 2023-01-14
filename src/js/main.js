//Открытие и закрытие всплывающего(модального) окна
const buttonForm = document.querySelector('.header-top__button-form');
const buttonCancel = document.querySelector('.pop_up__button--cancel');
const xClose = document.querySelector('.pop_up__close-icon');
const popUpOverlap = document.querySelector('.overlap-container');
const bodyTag = document.getElementsByTagName('body');
const popUp = document.getElementById('pop_up');
const submitButton = document.querySelector('.pop_up__button--submit');

function openPopUp() {
  popUpOverlap.classList.toggle('overlap-container--show');
  bodyTag[0].style.overflow = 'hidden';
  submitButton.disabled = isSubmitDisabled;
}

function closePopUp() {
  popUpOverlap.classList.toggle('overlap-container--show');
  bodyTag[0].style.overflow = 'auto';
  resetFormState();
}

function resetFormState() {
  resetPhone();
  resetName();
}

function resetPhone() {
  textErrorOfPhone.style.display = 'none';
  inputPhone.value = '';
  hasPhoneError = false;
  inputPhone.classList.remove('pop_up__phone--error');
}

function resetName() {
  inputName.value = '';
  hasNameError = false;
  textErrorOfName.style.display = 'none';
  inputName.classList.remove('pop_up__name--error');
}

buttonForm.addEventListener('click', openPopUp);
buttonCancel.addEventListener('click', closePopUp);
xClose.addEventListener('click', closePopUp);
popUpOverlap.addEventListener('click', closePopUp);
popUp.addEventListener('click', function (event) {
  event.stopPropagation();
});

//Валидации
const inputPhone = document.querySelector('.pop_up__phone');
const inputName = document.querySelector('.pop_up__name');
const textErrorOfPhone = document.querySelector('.pop_up__phone-error-text');
const textErrorOfName = document.querySelector('.pop_up__name-error-text');

//Переменные для 2-ух инпутов, которые отслеживают ошибку в форме
let hasPhoneError = false;
let hasNameError = false;

//Переменная, которая отвечает за состояние disabled
let isSubmitDisabled = true;

//Проверка поля inputPhone
function handlePhoneInput(event) {
  const number = event.target.value;
  const regexp = /^(8|\+7)\d{10}$/;

  if (!regexp.test(number)) {
    inputPhone.classList.add('pop_up__phone--error');
    textErrorOfPhone.style.display = 'block';
    hasPhoneError = true;
  } else {
    inputPhone.classList.remove('pop_up__phone--error');
    textErrorOfPhone.style.display = 'none';
    hasPhoneError = false;
  }
}

//Проверка поля inputName
function handleNameInput(event) {
  const name = event.target.value;
  const regexp = /^\D{3,}$/;

  if (!regexp.test(name)) {
    inputName.classList.add('pop_up__name--error');
    textErrorOfName.style.display = 'block';
    hasNameError = true;
  } else {
    inputName.classList.remove('pop_up__name--error');
    textErrorOfName.style.display = 'none';
    hasNameError = false;
  }
}

//Проверка одновременно двух полей, корректно ли они заполнены
//Если оба поля заполнены верно - убрать disabled
function checkValidateForm() {
  const isPhoneInputCorrect = !hasPhoneError;
  const isNameInputCorrect = !hasNameError;

  const isSubmitDisabled = !isPhoneInputCorrect || !isNameInputCorrect;
  submitButton.disabled = isSubmitDisabled;
}

//Вешаем события на оба инпута
inputPhone.addEventListener('input', (event) => {
  handlePhoneInput(event);
  checkValidateForm();
});

inputName.addEventListener('input', (event) => {
  handleNameInput(event);
  checkValidateForm();
});

//Отправка формы на сервер
function fetchTableData() {
  const modalWindowContainer = document.querySelector('.pop_up__container');
  modalWindowContainer.style.display = 'none';

  const preloader = document.querySelector('.preloader');
  preloader.style.display = 'flex';

  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((arr) => {
      const filteredArr = filterArr(arr);
      createTable(filteredArr);
    })
    .catch((error) => {
      showError();
      setTimeout(() => {
        closePopUp();
        const requestErrorTitle = document.querySelector('.request-error');
        requestErrorTitle.style.display = 'none';
      }, 2500);
    })
    .finally(() => (preloader.style.display = 'none'));
}

function showError() {
  const requestErrorTitle = document.querySelector('.request-error');
  requestErrorTitle.style.display = 'block';
}

function filterArr(arg) {
  return arg.filter((elem) => elem.userId === 5 || elem.completed === false);
}

submitButton.addEventListener('click', fetchTableData);

//Отрисовка таблицы
function createTable(data) {
  const tableTag = document.getElementById('table');
  const theadTag = document.createElement('thead');
  const tbodyTag = document.createElement('tbody');
  const trTag = document.createElement('tr');
  tableTag.append(theadTag);
  tableTag.append(tbodyTag);
  theadTag.append(trTag);

  const arrKeysObject = Object.keys(data[0]);

  arrKeysObject.forEach((elem) => {
    const thTag = document.createElement('th');
    thTag.innerHTML = elem;
    thTag.className = 'table__th';
    trTag.append(thTag);
  });

  data.forEach((obj) => {
    const trTag = document.createElement('tr');
    tbodyTag.append(trTag);

    const arrValuesObj = Object.values(obj);

    arrValuesObj.forEach((elem) => {
      const tdTag = document.createElement('td');
      tdTag.innerHTML = elem;
      tdTag.className = 'table__td';
      trTag.append(tdTag);
    });
  });
}
