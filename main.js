var width = 5;
var height = 5;
var gridColor = '#56a';
var framePause = 0;

// MODEL
var life_array;
// life_array = [[0,0], [1,-1], [2,-1], [2,0], [2,1]]; // Glider
// life_array = [[0,0], [0,-1], [0,1]]; // Blinker

// life_array = [
//   [0,-1],[-1,-1],[-1,0],[-1,-2],[-2,-3],[-2,1],[-3,-1],[-4,2],[-5,2],
//   [-4,-4],[-5,-4],[-6,-3],[-6,1],[-7,0],[-7,-1],[-7,-2],[-16,0],[-16,-1],
//   [-17,0],[-17,-1],
//   [3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[5,3],[5,-1],[7,3],[7,-1],[7,4],[7,-2],
//   [17,1],[18,1],[17,2],[18,2]
// ]; // Gosper glider gun

life_array = [ [0,0], [-2,1], [-2,-1], [-3,-1], [1,-1], [2,-1], [3,-1] ]; // Acorn pattern

var limits = [life_array.length, life_array.length, life_array.length];

// VIEW
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var frameCounter = document.querySelector('.frameCounter');
var cellCounter = document.querySelector('.cellCounter');

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
    var x = Math.floor(innerWidth/2+ life_array[i][0]*width);
    var y = Math.floor(innerHeight/2+ life_array[i][1]*height);
    c.fillStyle = gridColor;
    c.fillRect(x,y, width, height);
  }
}

window.addEventListener('resize', function(){
  init();
  updateGraphic();
})


// CONTROLLER
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
