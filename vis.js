// for this which is the hardest part i used alot of Resources including: 
// W3Schools HTML5 SVG: https://www.w3schools.com/html/html5_svg.asp
// MDN SVG documentation: https://developer.mozilla.org/en-US/docs/Web/SVG
// StackOverflow flower drawing example: https://stackoverflow.com/questions/46738188/draw-a-flower-using-canvas-and-a-loop


// Visualization 1: Habit Map 
// fist i started by getting the SVG element for the habit map
const habitSVG = document.getElementById("habitMap");
const legendDiv = document.getElementById("legend");

// i then added in a list the says of the week
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// i then listed my habits with icons, which days they happen, and extra info
const habits = [
  { name: "Boxing", icon: "🥊", days: [1,2,3,4,5,6], info: "30 min session" }, 
  { name: "Running", icon: "👟", days: [0,1,3,6], info: "2 miles" },
  { name: "Painting", icon: "🎨", days: [0,6], info: "1 hr session" },
  { name: "Studying", icon: "📚", days: [1,2,3,4,5], info: "2 hrs" },
  { name: "Cooking", icon: "🍳", days: [0,1,2,3,4,5,6], info: "Meal prep" }
];

// then i drew the day labels at the top
days.forEach((day, i) => {
  let x = 100 + i * 90; 
  habitSVG.innerHTML += `<text x="${x}" y="40" text-anchor="middle" font-size="16" font-weight="bold">${day}</text>`;
});

// i drew the habit icons using a ready emoji on the right day of the week
habits.forEach((habit, hIndex) => {
  habit.days.forEach((d) => {
    let x = 100 + d * 90;  
    let y = 80 + hIndex * 50; 
    habitSVG.innerHTML += `<text x="${x}" y="${y}" text-anchor="middle" font-size="28">${habit.icon}</text>`;
  });
});

// for better understading i created a legend below the SVG to explain the icons
let legendHTML = habits.map(h => 
  `<span style="margin-right:25px; font-size:18px">${h.icon} = ${h.name} (${h.info})</span>`
).join('');
legendDiv.innerHTML = legendHTML;

// Visualization 2: Blooming Flowers 
// ofcourse with lots and lots of help from the previous resources i made a flower fun svg
// again just get the SVG element for the flowers
const flowerSVG = document.getElementById("flowerCanvas");
const flowerWidth = flowerSVG.clientWidth;
const flowerHeight = flowerSVG.clientHeight;

const flowers = []; // create a array list to store each flower

// creat a new flower with random position, size, speed, color, and rotation every time
function createFlower() {
  const x = Math.random() * flowerWidth;
  const y = flowerHeight + 20; // start from underneath the page for illusion of coming out 
  const size = 10 + Math.random() * 20;
  const speed = 0.5 + Math.random() * 1.5;
  const color = `hsl(${Math.random()*360}, 70%, 60%)`;
  flowers.push({ x, y, size, speed, color, angle: Math.random()*Math.PI*2 });
}

// draw a single flower with petals the petals are circles 
function drawFlower(x, y, size, color, angle) {
  const petals = 6; 
  let flowerPath = "";
  for (let i = 0; i < petals; i++) {
    const a = angle + (i * (2 * Math.PI / petals)); // angle for each petal should slightly tilt
    const px = x + Math.cos(a) * size; 
    const py = y + Math.sin(a) * size; 
    flowerPath += `<circle cx="${px}" cy="${py}" r="${size/2}" fill="${color}" />`;
  }
  return flowerPath;
}

// draw all flowers and move them up like animated
function drawFlowers() {
  flowerSVG.innerHTML = ""; 
  flowers.forEach((flower, index) => {
    flowerSVG.innerHTML += drawFlower(flower.x, flower.y, flower.size, flower.color, flower.angle);
    flower.y -= flower.speed;      
    flower.angle += 0.01;         
    if (flower.y + flower.size < 0) flowers.splice(index, 1); 
  });
}

// loop the animation of them going up 
function animateFlowers() {
  if (flowers.length < 30) createFlower(); // maximum flowers 
  drawFlowers();
  requestAnimationFrame(animateFlowers); // repeat animation
}

animateFlowers();