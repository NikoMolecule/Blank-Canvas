const rangeInput = document.querySelector(".range");
const valueInp = document.querySelector(".value");
const deleteAll = document.querySelector(".delete");
const fillAll = document.querySelector(".fill");
const eraser = document.querySelector(".eraser");
const colorPallete = document.querySelector(".color-pallete");
let childrenchild = colorPallete.children;

const palette = [
  "black",
  "yellow",
  "blue",
  "red",
  "green",
  "brown",
  "teal",
  "purple",
  "orange",
  "crimson",
];

console.log(colorPallete.children);
// adding colors to the color-pallete div

const pickColor = (event) => {
  context.strokeStyle = event.target.style.background;
  context.fillStyle = event.target.style.background;
};

const addColorsAndEvents = () => {
  let children = colorPallete.children;
  for (let j = 0; j < children.length; j++) {
    children[j].style.background = palette[j];
    children[j].addEventListener("click", pickColor);
  }
};

addColorsAndEvents();

// canvas

const canvas = document.querySelector(".paint");
const context = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let drawing = false;

let drawActive = (event) => {
  drawing = true;
  creatingCanvas(event);
};

let drawInactive = () => {
  drawing = false;
  context.beginPath();
};

let creatingCanvas = (event, width, color) => {
  if (!drawing) return;
  context.lineWidth = width;
  context.lineCap = "round";
  context.strokeStyle = color;

  context.lineTo(event.clientX, event.clientY);
  context.stroke();
  context.beginPath();
  context.moveTo(event.clientX, event.clientY);
};

canvas.addEventListener("mousedown", drawActive);
canvas.addEventListener("mouseup", drawInactive);
canvas.addEventListener("mousemove", creatingCanvas);

// input and value connection

rangeInput.addEventListener("input", () => {
  valueInp.textContent = rangeInput.value;
  context.lineWidth = rangeInput.value;
});
valueInp.textContent = rangeInput.value;

//delete func

const deleteScreen = () => {
  context.fillStyle = "white";
  context.clearRect(0, 0, canvas.width, canvas.height);
};
deleteAll.addEventListener("click", deleteScreen);

// fill func
const fillScreen = (color) => {
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
};
fillAll.addEventListener("click", fillScreen);

// eraser func
const eraseDrawing = () => {
  context.strokeStyle = "white";
};

eraser.addEventListener("click", eraseDrawing);
