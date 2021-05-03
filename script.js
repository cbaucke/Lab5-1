// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');
context.textAlign = "center";
context.font = 'bold 36px sans-serif';
const imgInput = document.getElementById('image-input');
const form = document.getElementById('generate-meme');
const clearBtn = document.querySelector("[type='reset']");
const readBtn = document.querySelector("[type='button']");
const volume = document.querySelector("[type='range']");

imgInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.alt = imgInput.files[0].name;
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  //TODO
  //Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  //Disable clear, read text buttons
  clearBtn.disabled = true;
  readBtn.disabled = true;
  //Fill context with black
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  //Draw image
  const imgDims = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, imgDims.startX, imgDims.startY, imgDims.width, imgDims.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

form.addEventListener('submit', (event) => {
  //Add text to canvas
  const topText = document.getElementById('text-top').value;
  const botText = document.getElementById('text-bottom').value;
  context.fillText(topText, canvas.width/2, 35);
  context.fillText(botText, canvas.width/2, canvas.height - 15);
  //Enable clear, read text buttons
  clearBtn.disabled = false;
  readBtn.disabled = false;
  document.getElementById('voice-selection').disabled = false;

  event.preventDefault();

  //Generate voice list
  let voices = speechSynthesis.getVoices();

  for(let i = 0; i < voices.length; i++) {
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    option.setAttribute('value', voices[i]);
    document.getElementById("voice-selection").appendChild(option);
  }
});

clearBtn.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  clearBtn.disabled = true;
  readBtn.disabled = true;
});

readBtn.addEventListener('click', () => {
  //Create string
  const topText = document.getElementById('text-top').value;
  const botText = document.getElementById('text-bottom').value;
  const toSpeak = new SpeechSynthesisUtterance(topText + " " + botText);
  //Update properties
  console.log("value being assigned: " + document.getElementById('voice-selection').value);
  toSpeak.voice = document.getElementById('voice-selection').value;
  toSpeak.volume = document.querySelector("[type='range']").value/100;
  speechSynthesis.speak(toSpeak);
});

volume.addEventListener('input', () => {
  //Update volume icon
  let volImg = document.getElementById('volume-group').getElementsByTagName('img')[0];
  if(volume.value >= 67){
    volImg.src = "icons/volume-level-3.svg";
  }
  else if(volume.value >= 34){
    volImg.src = "icons/volume-level-2.svg";
  }
  else if(volume.value >= 1){
    volImg.src = "icons/volume-level-1.svg";
  }
  else{
    volImg.src = "icons/volume-level-0.svg";
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
