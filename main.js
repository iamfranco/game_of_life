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

life_array = [ [0,0], [-2,1], [-2,-1], [-3,-1], [1,-1], [2,-1], [3,-1] ];

var kill_array = [];

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
  for (var i=0; i<life_array.length; i++) {
    var x = life_array[i][0];
    var y = life_array[i][1];
    c.fillStyle = gridColor;
    c.fillRect(innerWidth/2+ x*width,innerHeight/2+ y*height, width, height);
  }
}


// CONTROLLER
var count = 0;
function tick() {
  updateModel();
  updateGraphic();
  count++;
  // console.log(count + " " +life_array.length);
  frameCounter.innerHTML = "frame: " + count;
  cellCounter.innerHTML = life_array.length + " cells";
  if (count == 5206) clearInterval(play);
}

function updateModel() {
  var old_boundary = life_array.length;
  for (var i=0; i<old_boundary; i++) {
    resurrect(i,old_boundary);
  }
  snitch(old_boundary);
  murder();
  clearSnitch();
}

function come_alive(x,y) {
  life_array.push([x,y]);
}

function clearSnitch() {
  kill_array = [];
}

// cell i resurrects neighbouring cells
function resurrect(i,old_boundary) {
  var surround_array = get_surrounding(i);
  for (var i=0; i<surround_array.length; i++) {
    var sx = surround_array[i][0];
    var sy = surround_array[i][1];
    if (num_of_neighbour(sx,sy,old_boundary) == 3) {
      come_alive(sx,sy);
    }
  }
}

function murder() {
  for (var i=kill_array.length-1; i>=0; i--) {
    life_array.splice(kill_array[i],1);
  }
}

function snitch(old_boundary) {
  for (var i=0; i<old_boundary; i++) {
    var x = life_array[i][0];
    var y = life_array[i][1];
    var neighbour = num_of_neighbour(x,y,old_boundary);
    if (neighbour !== 2 && neighbour !== 3) {
      kill_array.push(i);
    }
  }
}

// get number of neighbours around (x,y)
function num_of_neighbour(x,y, old_boundary) {
  var num_of_n = 0;
  for (var j=0; j<old_boundary; j++) {
    if (is_neighbour_by_position(x,y,j)){
      num_of_n++;
    }
  }
  return num_of_n;
}

// check if cell j is neighbour of (ix, iy)
function is_neighbour_by_position(ix, iy, j) {
  var jx = life_array[j][0];
  var jy = life_array[j][1];
  if (ix == jx && iy == jy) return false; // false if same cell
  if (ix == jx + 1 || ix == jx || ix == jx - 1) {
    if (iy == jy + 1 || iy == jy || iy == jy - 1) {
      if (ix !== jx || iy !== jy) return true;
    }
  }
  return false;
}

// get dead cells around cell i
function get_surrounding(i) {
  var surround_array = [];
  for (var dx = -1; dx <=1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
      var sx = life_array[i][0]+dx;
      var sy = life_array[i][1]+dy;
      if (!is_in_life_array(sx, sy)) {
        surround_array.push([sx, sy]);
      }
    }
  }
  return surround_array;
}

// check if (x,y) is in life_array
function is_in_life_array(x,y) {
  for (var i=0; i<life_array.length; i++) {
    if (x == life_array[i][0] && y == life_array[i][1]) return true;
  }
  return false;
}

updateGraphic();
var play = setInterval( tick, framePause);
