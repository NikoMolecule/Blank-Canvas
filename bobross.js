const rangeInput = document.querySelector(".range");
const valueInp = document.querySelector(".value");
const deleteAll = document.querySelector(".delete");
const fillAll = document.querySelector(".fill");
const eraser = document.querySelector(".eraser");
const colorPallete = document.querySelector(".color-pallete");
const cursor = document.querySelector(".cursor");
const drawingCenter = document.querySelector(".draw-box");
const saveModalBtn = document.querySelector(".save-project");
const loadModalBtn = document.querySelector(".load-projects");
const saveModal = document.querySelector(".modal");
const loadModal = document.querySelector(".new-modal");
const cancelBtn = document.querySelectorAll(".del-button");
const saveBtn = document.querySelector(".save");
const saveInput = document.querySelector(".save-input");
const projectDisplay = document.querySelector(".project-display");
const loadProject = document.querySelector(".load-btn");
const undoBtn = document.querySelector(".undo-btn");
const redoBtn = document.querySelector(".redo-btn");
let childrenchild = colorPallete.children;
window.addEventListener("load", () => {
  if (localStorage.getItem("projects") === null) {
    localStorage.setItem("projects", JSON.stringify([]));
  } else {
    return;
  }
});

import color from "./color.json" assert { type: "json" };

const palette = color.palette;

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
    children[j].addEventListener("click", () => {
      Object.values(children).forEach((child) =>
        child.classList.remove("active")
      );
      children[j].classList.add("active");
    });
  }
};

addColorsAndEvents();
let undoArr = [];
let redoArr = [];
const saveProgress = () => {
  let saveType = "";
  saveType = canvas.toDataURL();
  undoArr.push(saveType);
};

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
  cursor.style.width = `${rangeInput.value}px `;
  cursor.style.height = `${rangeInput.value}px`;
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

// tracking cursor

//div customization too

cursor.style.top = 0;
cursor.style.left = 0;

const trackingCursor = (e) => {
  const x = e.clientX - rangeInput.value / 2;
  const y = e.clientY - rangeInput.value / 2;

  cursor.style.transform = `translate(${x}px, ${y}px)`;
};

window.addEventListener("mousemove", trackingCursor);
// cursor display
const isCursor = () => {
  cursor.style.display = "initial";
};

const isNotCursor = () => {
  cursor.style.display = "none";
};
drawingCenter.addEventListener("mousemove", isNotCursor);
canvas.addEventListener("mousemove", isCursor);

saveModalBtn.addEventListener(
  "click",
  () => (saveModal.style.display = "block")
);

cancelBtn[0].addEventListener(
  "click",
  () => (saveModal.style.display = "none")
);

cancelBtn[1].addEventListener(
  "click",
  () => (loadModal.style.display = "none")
);

const saveCanvas = () => {
  const oldData = JSON.parse(localStorage.getItem("projects"));
  const example = { name: "", elementID: "", canvasID: "" };
  if (saveInput.value.length === 0) {
    alert("TYPE SOMETHING U IDIOT!");
  } else {
    example.name = saveInput.value;
    example.elementID = new Date().getTime().toString();
    example.canvasID = canvas.toDataURL();

    const newData = [...oldData, example];
    localStorage.setItem("projects", JSON.stringify(newData));
    saveInput.value = "";
    saveModal.style.display = "none";
    alert("Your Drawing is Saved, Good Job!");
  }
};
saveBtn.addEventListener("click", saveCanvas);

loadModalBtn.addEventListener("click", () => {
  projectDisplay.innerHTML = "";
  loadModal.style.display = "flex";
  let projectData = JSON.parse(localStorage.getItem("projects"));
  if (projectData.length !== 0) {
    for (let i = 0; i < projectData.length; i++) {
      const eachProject = document.createElement("div");
      eachProject.className = "project";
      const title = document.createElement("div");
      const del_btn = document.createElement("button");
      title.className = "header";
      title.innerHTML = projectData[i].name;
      eachProject.id = projectData[i].elementID;
      del_btn.innerHTML = "delete";
      del_btn.className = "del-btn";
      eachProject.appendChild(del_btn);
      eachProject.appendChild(title);
      projectDisplay.appendChild(eachProject);

      eachProject.addEventListener("click", () => {
        for (let k = 0; k < projectData.length; k++) {
          projectDisplay.children[k].classList = "project";
        }
        eachProject.className = "project choosen";
      });
      del_btn.addEventListener("click", () => {
        let projectData = JSON.parse(localStorage.getItem("projects"));
        let choosenProject = del_btn.parentElement;
        let choosenProjectData = projectData.filter(
          (e) => e.elementID !== choosenProject.id
        );
        localStorage.setItem("projects", JSON.stringify(choosenProjectData));

        del_btn.parentElement.remove();
      });
    }
  }
});

const loadFunc = () => {
  let arr = Array.from(projectDisplay.children);
  let choosenProject = arr.find((a) => a.classList == "project choosen");
  let projectData = JSON.parse(localStorage.getItem("projects"));
  let undoData = JSON.parse(localStorage.getItem("undo"));
  undoData.splice(0, undoData.length);
  localStorage.setItem("undo", JSON.stringify(undoData));
  let choosenProjectData = projectData.find(
    (e) => e.elementID === choosenProject.id
  );
  const dataURL = choosenProjectData.canvasID;
  const img = new Image();
  img.src = dataURL;
  img.onload = function () {
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
    alert("Succsefully Loaded");
    loadModal.style.display = "none";
  };
};
loadProject.addEventListener("click", loadFunc);

const undoFunc = () => {
  if (undoArr.length === 0) {
    context.fillStyle = "white";
    return context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const dataURL = undoArr[undoArr.length - 1];
  redoArr.push(dataURL);
  undoArr.pop();
  const img = new Image();
  img.src = dataURL;
  img.onload = function () {
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
  };
};

const redoFunc = () => {
  if (redoArr.length === 0) {
    context.fillStyle = "white";
    return context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const dataURL = redoArr[redoArr.length - 1];
  undoArr.push(dataURL);
  redoArr.pop();
  const img = new Image();
  img.src = dataURL;
  context.fillStyle = "white";
  context.clearRect(0, 0, canvas.width, canvas.height);
  img.onload = function () {
    context.drawImage(img, 0, 0);
  };
};

undoBtn.addEventListener("click", () => console.log(undoArr));
redoBtn.addEventListener("click", () => redoFunc());

canvas.addEventListener("mousedown", saveProgress);
canvas.addEventListener("mouseup", () => console.log(undoArr));
