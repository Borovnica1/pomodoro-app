const upArrows = document.querySelectorAll('.form-default__arrow--up');
const downArrows = document.querySelectorAll('.form-default__arrow--down');
const body = document.querySelector('body');
const modesButtons = document.querySelectorAll('.modes > button');
const modes = document.querySelector('.modes');
const settings = document.querySelector('.settings');
const settingsIcon = document.querySelector('.settings-icon');
const settingIconPath = document.querySelector('.settings-icon > path');
const clockTime = document.querySelector('.clock__time');
const startPause = document.querySelector('.clock__play-pause');
const settingsOverlay = document.querySelector('.settings-overlay');
const closeIcon = document.querySelector('.close-icon');
const applyBtn = document.querySelector('.apply');
const fontsOptions = document.querySelectorAll('.fonts > .selection-range > *');
const colorsOptions = document.querySelectorAll('.colors > .selection-range > *');
const clock = document.querySelector('.clock');



const pomodoroInput = document.querySelector('.pomodoro-input');
const shortBreakInput = document.querySelector('.short-break-input');
const longBreakInput = document.querySelector('.long-break-input');

let pomodoroTime = 25;
let shortTime = 5;
let longTime = 15;
let timeLeft = 25*60;
let timeFull = 25*60;
let timeInterval;

let currColor = window.getComputedStyle(modesButtons[0]).backgroundColor || 'blue';
let shadowColor = window.getComputedStyle(modes).backgroundColor;
let grayColor = settingIconPath.getAttribute('fill');

function incrementValueByOne() {
  const input = this.parentElement.children[0];
  input.value = Number(input.value) + 1;
};

function decrementValueByOne() {
  const input = this.parentElement.children[0];
  if (Number(input.value) > 1) input.value = Number(input.value) - 1;
};

function switchMode() {
  for (let btn of modesButtons) {
    btn.classList.remove('mode--active');
  };
  const modeSelected = this.textContent.split(' ')[0];
  let time;
  switch (modeSelected) {
    case 'pomodoro': time = pomodoroTime;
      break;
    case 'short': time = shortTime;
      break;
    case 'long': time = longTime;
      break;
  };

  context.clearRect(0, 0, canvas.width, canvas.height);
  pauseTime();
  timeLeft = time*60;
  timeFull = time*60;
  clockTime.textContent = `${String(time).padStart(2, '0')}:00`;
  this.classList.add('mode--active');
}


function toggleStartPause() {
  if (startPause.textContent === 'start' || startPause.textContent === 'restart') {
    startTime();
  } else if (startPause.textContent === 'pause') {
    pauseTime();
  }
};

function updateInnerCircle() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  const calculatedAngle = (Math.PI*2)-(((2 * Math.PI)/100)*((timeLeft/timeFull)*100));
  context.arc(canvas.width/2, canvas.height/2, canvas.width/2-45, 0, calculatedAngle, false);
  context.stroke();
}

function startTime() {
  startPause.textContent = 'pause';
  timeInterval = setInterval(() => {
    timeLeft -= 1;
    const timeMinutes = Math.floor(timeLeft / 60);
    const timeSeconds = timeLeft % 60;
    clockTime.textContent = `${String(timeMinutes).padStart(2, '0')}:${String(timeSeconds).padStart(2, '0')}`
    updateInnerCircle();

    if (timeLeft === 0) {
      switchMode.call(document.querySelector('.mode--active'));
      clockTime.textContent = `00:00`;
      context.arc(canvas.width/2, canvas.height/2, canvas.width/2-45, 0, Math.PI*2, false);
      context.stroke();
      startPause.textContent = 'restart';
    }

   }, 1000);
}

function pauseTime() {
  startPause.textContent = 'start';
  timeLeft = clockTime.textContent.split(':');
  timeLeft = Number(timeLeft[0])*60 + Number(timeLeft[1]);

  clearInterval(timeInterval);
};

function openSettings() {
  settingsOverlay.classList.add('settings--active');
};

function closeSettings() {
  settingsOverlay.classList.remove('settings--active');
};

function checkIfClickedOnOverlay(e) {
  if (e.target.classList.contains('settings-overlay')) closeSettings();
};

function switchFont() {
  for (let option of fontsOptions) {
    option.classList.remove('fonts--active');
  };
  this.classList.add('fonts--active');
  changeFontColor()
};

function switchColor() {
  for (let option of colorsOptions) {
    option.classList.remove('colors--active');
  };
  this.classList.add('colors--active');
  changeFontColor();
  let mode;
  for (let btn of modesButtons) {
    if (btn.classList.contains('mode--active')) mode = btn;
  };
  currColor = window.getComputedStyle(mode).backgroundColor;
  context.strokeStyle = currColor;
};

function applySettings() {
  let timeChanged = false;
  const times = [pomodoroTime, shortTime, longTime];
  const newTimes = [pomodoroInput.value, shortBreakInput.value, longBreakInput.value];
  for (let i = 0; i < times.length; i++) {
    if (times[i] !== Number(newTimes[i])) timeChanged = true;
  };
  pomodoroTime = Number(pomodoroInput.value)
  shortTime = Number(shortBreakInput.value);
  longTime = Number(longBreakInput.value);

  let mode;
  for (let btn of modesButtons) {
    if (btn.classList.contains('mode--active')) mode = btn;
  };
  if (timeChanged) switchMode.call(mode);
  closeSettings();
};

function changeFontColor() {
  const fontIndex = Array.from(fontsOptions).findIndex(option => option.classList.contains('fonts--active'));
  const colorIndex = Array.from(colorsOptions).findIndex(option => option.classList.contains('colors--active'));
  Array.from(body.classList).forEach(c => {
    body.classList.remove(c)
  }); 
  body.classList.add(`font-${fontIndex+1}`); 
  body.classList.add(`color-${colorIndex+1}`); 
};

for (let arrow of upArrows) {
  arrow.addEventListener('click', incrementValueByOne);
};

for (let arrow of downArrows) {
  arrow.addEventListener('click', decrementValueByOne);
};

for (let btn of modesButtons) {
  btn.addEventListener('click', switchMode);
}

startPause.addEventListener('click', toggleStartPause);

settingsIcon.addEventListener('click', openSettings);
settingsOverlay.addEventListener('click', checkIfClickedOnOverlay);
closeIcon.addEventListener('click', closeSettings);
applyBtn.addEventListener('click', applySettings);

for (let option of fontsOptions) {
  option.addEventListener('click', switchFont);
};
for (let option of colorsOptions) {
  option.addEventListener('click', switchColor);
};


 



var canvas = document.getElementById("canvas");
canvas.style.transform = 'rotate(-90deg)'
var context = canvas.getContext("2d");
canvas.width = clock.clientWidth;
canvas.height = clock.clientWidth;


//ctx.arc(75, 75, 40, 0, endAngle, counterclockwise);

context.strokeStyle = currColor;


var canvasOuter = document.getElementById("canvas-outer");
var ctx = canvasOuter.getContext("2d");
canvasOuter.width = clock.clientWidth;
canvasOuter.height = clock.clientWidth;
var grad = ctx.createLinearGradient(canvasOuter.width/3, canvasOuter.width/3, canvasOuter.width*4, canvasOuter.width*4);
grad.addColorStop(0, shadowColor);
grad.addColorStop(1, grayColor);
//ctx.arc(75, 75, 40, 0, endAngle, counterclockwise);




canvas.style.position = 'absolute';
canvasOuter.style.position = 'absolute';

function clockSizeChanged() {
  canvas.width = clock.clientWidth;
  canvas.height = clock.clientWidth;
  canvasOuter.width = clock.clientWidth;
  canvasOuter.height = clock.clientWidth;
  context.beginPath();

  context.strokeStyle = currColor;
  context.lineWidth = 15;
  context.lineCap = 'round';
  ctx.lineWidth = 23;
  ctx.strokeStyle = grad;
  ctx.lineCap = 'round';

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.stroke();

  ctx.arc(canvasOuter.width/2, canvasOuter.width/2, canvasOuter.width/2-12, 0, Math.PI * 2, true);
  ctx.stroke();
};

clockSizeChanged();

new ResizeObserver(clockSizeChanged).observe(clock);


/* const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineWidth = 15;
ctx.lineCap = 'round';
ctx.lineTo(100, 100);
ctx.stroke(); */


/* function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        ctx.beginPath();
        var x = 25 + j * 50; // x coordinate
        var y = 25 + i * 50; // y coordinate
        var radius = 20; // Arc radius
        var startAngle = 0; // Starting point on circle
        var endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
        var counterclockwise = i % 2 !== 0; // clockwise or counterclockwise

        ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

        if (i > 1) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }
  }
}
draw(); */