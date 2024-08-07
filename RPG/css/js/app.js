"use strict";

const passwordDisplay = document.querySelector(".password_display");
const passwordPlaceHolder = document.querySelector(".password_placeholder");
const passwordCopyText = document.querySelector(".copy_text");
const passwordCopyBtn = document.querySelector(".copy_btn");

const passwordForm = document.querySelector(".password_setting");
const CharCount = document.querySelector(".char_count");
const char_length_slider = document.querySelector(".char_length_slider");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");

const strengthDesc = document.querySelector(".strength_rating_text");
const strengthBars = document.querySelectorAll(".bar");

const Character_sets = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  numbers: ["1234567890", 10],
  symbols: ["!@#$%^&*()", 10],
};

let canCopy = false;

const getSliderVal = () => {
  CharCount.textContent = char_length_slider.value;
};

const styleRangeSlider = () => {
  const min = char_length_slider.min;
  const max = char_length_slider.max;
  const val = char_length_slider.value;
  char_length_slider.style.backgroundSize =
    ((val - min) * 100) / (max - min) + "% 100%";
};

const handleSliderInput = () => {
  getSliderVal();
  styleRangeSlider();
};

// Reset Bar Styles
const resetBarStyles = () => {
  strengthBars.forEach((bar) => {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "hsl(252, 11%, 91%)";
  });
};

const styleBars = (barElements, color) => {
  barElements.forEach((bar) => {
    bar.style.backgroundColor = color;
    bar.style.borderColor = color;
  });
};

const styleMeter = (rating) => {
  const text = rating[0];
  const numBars = rating[1];
  const barsToFill = Array.from(document.querySelectorAll(".bar")).slice(0, numBars);
  resetBarStyles();
  strengthDesc.textContent = text;
  switch (numBars) {
    case 1:
      return styleBars(barsToFill, "hsl(0, 91%, 63%)");
    case 2:
      return styleBars(barsToFill, "hsl(13, 95%, 66%)");
    case 3:
      return styleBars(barsToFill, "hsl(42, 91%, 68%)");
    case 4:
      return styleBars(barsToFill, "hsl(127, 100%, 82%)");
    default:
      throw new Error("Invalid Value for Num Bars");
  }
};

//--------------------------//
// Password Generate
//-------------------------//
const calcStrength = (passwordLength, charPoolSize) => {
  const strength = passwordLength * Math.log2(charPoolSize);
  if (strength < 25) {
    return ["Too Weak", 1];
  } else if (strength >= 25 && strength < 50) {
    return ["Weak", 2];
  } else if (strength >= 50 && strength < 75) {
    return ["Medium", 3];
  } else {
    return ["Strong", 4];
  }
};

const generatePassword = (e) => {
  e.preventDefault();
  
  if (!validInput()) {
    console.log("Invalid input: No checkboxes selected.");
    return;
  }

  let generatedPassword = "";
  let includeSets = [];
  let charPool = 0;

  checkBoxes.forEach((box) => {
    if (box.checked) {
      includeSets.push(Character_sets[box.value][0]);
      charPool += Character_sets[box.value][1];
    }
  });

  if (includeSets.length) {
    for (let i = 0; i < char_length_slider.value; i++) {
      const randSetIndex = Math.floor(Math.random() * includeSets.length);
      const randSet = includeSets[randSetIndex];
      const randCharIndex = Math.floor(Math.random() * randSet.length);
      const randChar = randSet[randCharIndex];
      generatedPassword += randChar;
    }
  } else {
    console.log("No character sets included.");
  }

  const strength = calcStrength(char_length_slider.value, charPool);
  styleMeter(strength);
  passwordDisplay.textContent = generatedPassword;

  console.log(`Generated password: ${generatedPassword}`);
};

// Valid Input
const validInput = () => {
  if (Array.from(checkBoxes).every((box) => !box.checked)) {
    alert("Make sure to check at least one checkbox");
    return false;
  }
  return true;
};

// Copy password
const copyPassword = async () => {
  if (!passwordDisplay.textContent || passwordCopyText.textContent) return;
  if (!canCopy) return;

  setTimeout(() => {
    passwordCopyText.style.transition = "all 1s";
    passwordCopyText.style.opacity = 0;
  }, 1000);
  setInterval(() => {
    passwordCopyText.style.removeProperty("opacity");
    passwordCopyText.style.removeProperty("transition");
    passwordCopyText.textContent = "";
  }, 1000);
  await navigator.clipboard.writeText(passwordDisplay.textContent);
  passwordCopyText.textContent = "Copied!";
};

CharCount.textContent = char_length_slider.value;

char_length_slider.addEventListener("input", handleSliderInput);
passwordForm.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);
