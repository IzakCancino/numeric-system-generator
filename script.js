/**
 * Form with all the numeric systems base and digits
 * @type {HTMLFormElement}
 */
let formNumSys = document.getElementById("numericSystemCreator");

/**
 * The numeric base in use. It has the same value than `inputBase.value`
 * @type {Number}
 */
let base = 2;

/**
 * Div with all the *digits selectors* in the generator
 * @type {HTMLDivElement}
 */
let divGenDigits = document.getElementById("gen-digits");

/**
 * Numeric input with the numeric base selected
 * @type {HTMLInputElement}
 */
let inputBase = document.getElementById("base");

/**
 * Contains all the labels for digit inputs
 * @type {HTMLLabelElement[]}
 */
let labelsDigits = Array.from(document.getElementsByClassName("label-digit"));

/**
 * Contains all the digit inputs
 * @type {HTMLInputElement[]}
 */
let inputsDigits = Array.from(document.getElementsByClassName("digits"));

/**
 * Contains all the buttons for delete digit inputs
 * @type {HTMLButtonElement[]}
 */
let btnsDeleteDigit = Array.from(document.getElementsByClassName("btn-delete-digit"));

/**
 * Number used to count every time the base is added by 1, it doesn't decrease
 * @type {Number}
 */
let auxNumber = base;

/**
 * Array with all the digits of the current numeric system
 * @type {String[]}
 */
let digits = [];

/**
 * Decimal number input in the converter
 * @type {HTMLInputElement}
 */
let inputNumDecimal = document.getElementById("input-decimal");

/**
 * Personalized number input in the converter
 * @type {HTMLInputElement}
 */
let inputNumSystem = document.getElementById("input-system");



/**
 * Executed when a button, for delete a digit input, is clicked
 * @param {PointerEvent} e Event generated by the click
 * @returns {void}
 */
function deleteBtnClicked(e) {
  if (base <= 1) {
    return;
  }

  btn = e.target;
  i = btnsDeleteDigit.indexOf(btn);

  btn.parentElement.remove();
  btnsDeleteDigit.splice(i, 1);
  base = btnsDeleteDigit.length;
  inputBase.value = base;
}

/**
 * Updates some values in labels, and the arrays `labelsDigits` and `inputsDigits`
 * @returns {void}
 */
function updateDigitsInfo() {
  // Updating the number in the labels of the digits inputs
  labelsDigits = Array.from(document.getElementsByClassName("label-digit"));
  labelsDigits.forEach((label, i) => {
    label.innerText = `Digit #${i + 1}`;
  });

  // Updating the array of digit inputs
  inputsDigits = Array.from(document.getElementsByClassName("digits"));
}

/**
 * Adds to "Delete" buttons the ability to delete their digit input
 * @returns {void}
 */
function updateDeleteBtns() {
  btnsDeleteDigit.forEach((btn) => {
    btn.removeEventListener("click", deleteBtnClicked);
    btn.addEventListener("click", deleteBtnClicked);
  });
}

/**
 * Allows only one character (emojis, letters, numbers or symbols)
 * @param {PointerEvent} e On change event
 * @param {HTMLInputElement} input Element that changed
 * @returns {void}
 */
function addDigitInputValidation(e) {
  digitInput = e.target;

  if (/^[\p{Any}]$/u.test(digitInput.value) || !digitInput.value) {
    return
  }

  digitInput.value = digitInput.value[0];
}

/**
 * Makes the conversion of a number from decimal to the numeric system created
 * @param {Number} numSystem Number to convert
 * @returns {String}
 */
function convertDecimalToSystem(numDecimal) {
  let result = [];
  let i = 0;

  if (numDecimal == 0) {
    return digits[0];
  }

  while (base ** i <= numDecimal) {
    i++;
  }

  while (i > 0) {
    i--;

    let j = 0;
    while ((base ** i) * j <= numDecimal) {
      j++;
    }
    j--;

    console.log({ i, j, numDecimal });

    result[i] = digits[j];
    numDecimal -= (base ** i) * j;
  }

  console.log(result);

  return result.reverse().join("");
}

/**
 * Makes the conversion of a number from the numeric system created to decimal
 * @param {String} numSystem Number to convert
 * @returns {String}
 */
function convertSystemToDecimal(numSystem) {
  return numSystem
    .split("")
    .reverse()
    .map((digit, i) => base ** i * digits.indexOf(digit))
    .reduce((a, b) => a + b);
}



updateDeleteBtns();

// Detect when the selected numeric base in `inputBase` changes
inputBase.addEventListener("change", () => {
  if (base > inputBase.value) {
    // The base decreased. Remove the number selected of digits selector 

    while (base > inputBase.value) {
      base--;
      divGenDigits.removeChild(divGenDigits.lastElementChild);
    }

  } else if (base < inputBase.value) {
    // The base increased. Add the number selected of digits selector 
    while (base < inputBase.value) {
      base++;
      auxNumber++;

      let templateGenDigits = document.createElement("div");
      templateGenDigits.innerHTML = `
              <div data-digit-num="${auxNumber}">
                <label for="digit-${auxNumber}" class="label-digit">Digit #${base}</label>
                <input type="text" name="digit-${auxNumber}" class="digits" maxlength="2" required>
                <button type="button" class="btn-delete-digit">Delete</button>
              </div>
              `;
      divGenDigits.append(templateGenDigits);
    }
  }

  btnsDeleteDigit = Array.from(document.getElementsByClassName("btn-delete-digit"));
  updateDeleteBtns();

  updateDigitsInfo();
  inputsDigits[inputsDigits.length - 1].addEventListener("change", addDigitInputValidation);
});

// Adding to digit inputs validation of any character
inputsDigits.forEach(input => {
  input.addEventListener("change", addDigitInputValidation)
});

// Generate the array with all the digits
formNumSys.addEventListener("submit", e => {
  e.preventDefault();
  digits = inputsDigits.map(input => input.value);
});

// Convert decimals numbers to system created numbers
inputNumDecimal.addEventListener("change", e => {
  console.log(e);
  inputNumSystem.value = convertDecimalToSystem(Number(e.target.value));
});

// Convert system created numbers to decimal numbers
inputNumSystem.addEventListener("change", e => {
  inputNumDecimal.value = convertSystemToDecimal(e.target.value);
});