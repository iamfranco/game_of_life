var gridSize = 4;
var gridColor = '#56a';
var framePause = 10;

///////////////////// MODEL /////////////////////
var patterns;
var defaultPattern = "patterns = {glider: [[0,0], [1,-1], [2,-1], [2,0], [2,1]],blinker: [[0,0], [0,-1], [0,1]],glider_gun: [[0,-1],[-1,-1],[-1,0],[-1,-2],[-2,-3],[-2,1],[-3,-1],[-4,2],[-5,2],[-4,-4],[-5,-4],[-6,-3],[-6,1],[-7,0],[-7,-1],[-7,-2],[-16,0],[-16,-1],[-17,0],[-17,-1],[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[5,3],[5,-1],[7,3],[7,-1],[7,4],[7,-2],[17,1],[18,1],[17,2],[18,2]],acorn: [ [0,0], [-2,1], [-2,-1], [-3,-1], [1,-1], [2,-1], [3,-1] ]}";
eval(defaultPattern);
var life_array = patterns.acorn;

var limits = [life_array.length, life_array.length, life_array.length];

// VIEW
var canvas = $('canvas');
var frameCounter = $('.frameCounter');
var cellCounter = $('.cellCounter');
var gridSizeText = $('.gridSize');
var c = canvas.getContext('2d');

var menu = $('.menu');
var menuBtn = $('.menuBtn');
var patternPickerItem = document.getElementsByClassName('pattern-picker-item');
var gridSizeBtnLeft = $('.gridSizeBtn.btn--left');
var gridSizeBtnRight = $('.gridSizeBtn.btn--right');

function init() {
  canvas.width = window.innerWidth*window.devicePixelRatio;
  canvas.height = window.innerHeight*window.devicePixelRatio;
  canvas.style.width = canvas.width/window.devicePixelRatio+'px';
  canvas.style.height = canvas.height/window.devicePixelRatio+'px';
  c.scale(window.devicePixelRatio,window.devicePixelRatio);
}
init();

function updateGraphic() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  for (var i=0; i<limits[1]; i++) {
    var x = Math.floor(innerWidth/2+ (life_array[i][0]-1/2)*gridSize);
    var y = Math.floor(innerHeight/2+ (life_array[i][1]-1/2)*gridSize);
    c.fillStyle = gridColor;
    c.fillRect(x,y, gridSize, gridSize);
  }
}

window.addEventListener('resize', function(){
  init();
  updateGraphic();
})

function updateGridSizeDisplay() {
  gridSizeText.innerHTML = gridSize;
  if (gridSize > 1) {
    gridSizeBtnLeft.classList.remove('inactive');
  } else {
    gridSizeBtnLeft.classList.add('inactive');
  }
}
updateGridSizeDisplay();

// INTERNAL
var count = 0;
function tick() {
  updateModel();
  updateGraphic();
  count++;
  frameCounter.innerHTML = "frame: " + count;
  cellCounter.innerHTML = limits[2] + " cells";
  if (count == 5206) clearInterval(play);
}

function updateModel() {
  spawnCells();
  curseCells();
  // life_array = life_array.slice(0,limits[1]);
  limits[0] = limits[1];
  limits[2] = limits[1];
}

function swap(i,j) {
  var temp = life_array[i];
  life_array[i] = life_array[j];
  life_array[j] = temp;
}

function isNeighbour(x,y,i) {
  var ix = life_array[i][0];
  var iy = life_array[i][1];
  if (x == ix && y == iy) return false;
  if (x <= ix + 1 && x + 1 >= ix && y <= iy + 1 && y + 1 >= iy) return true;
  return false;
}

function countNeighbours(x,y) {
  var n = 0;
  for (var i=0; i<limits[0]; i++) {
    if (isNeighbour(x,y,i)) n++;
  }
  for (var i=limits[1]; i<limits[2]; i++) {
    if (isNeighbour(x,y,i)) n++;
  }
  return n;
}

function isAlive(x,y,lim) {
  for (var i=0; i<lim; i++) {
    if (x == life_array[i][0] && y == life_array[i][1]) return true;
  }
  return false;
}

function spawnCells() {
  for (var i=0; i<limits[0]; i++) {
    for (var dx = -1; dx <=1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        var x = life_array[i][0] + dx;
        var y = life_array[i][1] + dy;
        if (!isAlive(x, y, limits[1]) && countNeighbours(x, y)==3) {
          addCell(x,y);
        }
      }
    }
  }
}

function curseCells() {
  for (var i=0; i<limits[0]; i++) {
    var nb = countNeighbours(life_array[i][0],life_array[i][1]);
    if (nb < 2 || nb > 3) {
      deleteCell(i);
      i--;
    }
  }
}

function addCell(x,y) {
  life_array[limits[1]] = [x,y];
  limits[1]++;
  limits[2]++;
}

function deleteCell(i) {
  swap(i,limits[1]-1);
  swap(i,limits[0]-1);
  limits[0]--;
  limits[1]--;
}

var play = setInterval( tick, framePause);

// CONTROLLER

menuBtn.addEventListener('mousedown', function() {
  menu.classList.toggle('active');
  menuBtn.classList.toggle('active');
})

for (var i=0; i<patternPickerItem.length; i++) {
  patternPickerItem[i].addEventListener('mousedown', function() {
    clearInterval(play);
    eval(defaultPattern);
    life_array = patterns[this.dataset.name];
    limits = [life_array.length, life_array.length, life_array.length];
    play = setInterval( tick, framePause);
    count = 0;
    menu.classList.remove('active');
    menuBtn.classList.toggle('active');
  })
}

gridSizeBtnLeft.addEventListener('mousedown', function() {
  if (gridSize>1) {
    gridSize /= 2;
    updateGridSizeDisplay();
  }
})

gridSizeBtnRight.addEventListener('mousedown', function() {
  gridSize *= 2;
  updateGridSizeDisplay();
})

//////////////// helper function ////////////////////
function $(x) {return document.querySelector(x)}
