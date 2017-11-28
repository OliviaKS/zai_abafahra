//VERBINDUNG ZU MUSEGERÄT AUFBAUEN
//var muse = musedata.connect('http://127.0.1:8081');
var muse = musedata.fake();
var tresh = dynamicThreshold();

//SKIPISTE
//var n = 130;
var n = 150;
var endpunkte = [];
var vel_fluchtpunkt;
var fluchtpunkt;
var skipiste;
var acc;
var friction = 0.97;
var force = 0.02;
var slider;
var wertSlider;

//SCHNEE
var snow;

//SKI
var linkerSki;
var linkerSki2;
var rechterSki;
var rechterSki2;
var rotationLinks = 10;
var rotationRechts = -10;
var winkelLinkerSki = 0;
var winkelRechterSki = 0;
var linkerSkiZ;
var rechterSkiZ;

var dir_ski = 0;
var speed_ski = 0.05;
var dir_ski_r = 0;
var speed_ski_r = 0.05;

//SZENERIE
var mountains;
var y_mountains;
var vel_mountains = 5;
var dir_mountains;
//var mountains_hoehe;
//var sky_y = 723;
//var sky_acc;
//var sky_vel;
var y_sky = 0;
var dir_sky = 0;
var vel_sky = 10;
var sky;
var sky2;
var sky3;
var sky4;
var sky5;
var sky6;

//BRILLE
var goggles;

function preload(){
  linkerSki2 = loadImage('img/ski_zai_v3.png');
  rechterSki2 = loadImage('img/ski_zai_v3.png');
  mountains = loadImage('img/mountain_bg.png');
  sky = loadImage('img/sky_v1.png');
  sky3 = loadImage('img/sky_v3.png');
  sky4 = loadImage('img/sky_v4.png');
  sky5 = loadImage('img/sky_v5.png');
  sky6 = loadImage('img/sky_v6.png');
  sky7 = loadImage('img/sky_v7.png');
  goggles = loadImage('img/goggles.png');
}


function setup() {
  //BASICS
  createCanvas(1024,768);
  frameRate(30);
  imageMode(CENTER);
  angleMode(DEGREES);

  //SKY EINBETTEN
  y_sky = 384;
  dir_sky = 0;

  //BERGKETTE
  y_mountains = 550;
  dir_mountains = 0;

  //ENDPUNKTE SKIPISTE GENERIEREN
  for (var i = 0; i < n; i++) {
   // var x = map(i, 0, n, -700, width + 700);
    var x = map(i,0,n,-1400,width+1400);
    var y = height;
    var p = createVector(x, y);
    endpunkte.push(p);
  }

  //VEKTOREN KREIEREN
  vel_fluchtpunkt = createVector(0, 0);
  fluchtpunkt = createVector(width / 2, height / 2);
  vel_mountains = 0;
  mountains_hoehe = 0;
  acc = createVector(0, 0);

  //SCHNEE
  snow = snowMachine(200);
  //center of the point force, um die Bewegunsrichtung zu setzen
  snow.setCenter(width/2,height/2);

  //set the flake min size and max size
  snow.setFlakeSize(1.5,8);

  //SKI
  scale_ski = 0.5;

  //SLIDER
  slider = createSlider (0,0.7,0.1,0);
  slider.position(20,60);
  slider.style('width','200px');

}


function draw() {
  //BASICS
  background('#d7eef9')
  fill('white');

  //SLIDER
  wertSlider = slider.value();

  //ALPHA-WERTE HOLEN
  var _alpha = muse.getAlpha();
  //var _alpha = wertSlider;
  var threshold = tresh.threshold(_alpha);
  var fitness = (_alpha - threshold);

  acc.set(0,2*fitness);
  //acc.set()
  vel_fluchtpunkt.add(acc);
  vel_fluchtpunkt.mult(0.98);
  //Widerstand eingebaut durch mult - sobald keine acc mehr geht vel weg bis 0
  fluchtpunkt.add(vel_fluchtpunkt);

  if (fluchtpunkt.y < 0){
    fluchtpunkt.y = 0;
      vel_fluchtpunkt.set(0,0);
      }
      else if(fluchtpunkt.y>height-150){
        fluchtpunkt.y = height-150;
        vel_fluchtpunkt.set(0,0);
      }

  y_sky = map(fluchtpunkt.y,0,height-150,1100,-354);
  image(sky7,512,y_sky);

  y_mountains = map(fluchtpunkt.y,0,height-150,600,500);
  image(mountains,512,y_mountains);


 //text('Max. AlphaWert ' + wertSlider,20,90);
  fill('purple');
  text('Alpha ' + _alpha*100,20,60);
  text('Dyn. Schwelle ' + threshold*100,20,80);
  text('Fitness ' + fitness*100,20,100);


  //HINTERGRUND SKIPISTE
  //noch nicht elegant -- gleicher Code folgt unten in for-Schlaufe
  var v = p5.Vector.lerp(endpunkte[0],fluchtpunkt,map(fluchtpunkt.y,0,height-150,0.5,1));
  fill('#dbdfe1');
  noStroke();
  rect(0,v.y,width,height-v.y);


  //SKI-RILLEN ZEICHNEN
  //stroke('#eef8fc');
  stroke('#dbdfe1');
  for (var i = 0; i < endpunkte.length; i++) {
    var aktuellerEndpunkt = endpunkte[i];
    var v = p5.Vector.lerp(aktuellerEndpunkt,fluchtpunkt,map(fluchtpunkt.y,0,height-150,0.5,1));
    //line(fluchtpunkt.x, fluchtpunkt.y, endpunkte[i].x, endpunkte[i].y);
    //stroke('#eef8fc'); --> erst bei finaler Version, zum pröbeln mit schwarz arbeiten
    //stroke('#dbdfe1');
    stroke('white');
    line(v.x,v.y,aktuellerEndpunkt.x,aktuellerEndpunkt.y);
  }


  //SCHNEEFLOCKEN
  //point force um Forwärtsgeschwindigkeit zu simulieren
  var pforce = map(fluchtpunkt.y,0,height-150, 0, 0.65);
  snow.setPointForce(pforce);
  snow.setCenter(width/2,fluchtpunkt.y);
  snow.draw();


  fill('purple');
  text('Fluchtpunkt.y ' + fluchtpunkt.y, 20,120);


//SKI ROTATION
  /*push();
  translate(467,1090);
  if (_alpha > threshold){
    dir_ski = -speed_ski;
  }
  else if (_alpha < threshold){
    dir_ski = speed_ski;
  }
  else {
    dir_ski = 0;
  }
  rotationLinks = constrain(rotationLinks,0,25);
  rotationLinks = rotationLinks + dir_ski;
  var xCorrection = constrain(xCorrection,268,467);
  var xCorrection = -rotationLinks*7;
  translate(xCorrection,0);
  rotate(rotationLinks);
  //scale(0.8);
  image(linkerSki2,0,0);
  pop();*/

 /*push();
  translate(467,1090);
  rotationLinks = map(fluchtpunkt.y,0,height-150,25,0);
  var xCorrection = constrain(xCorrection,268,467);
  xCorrection = -rotationLinks*7;
  translate(xCorrection,0);
  rotate(rotationLinks);
  image(linkerSki2,0,0);
  pop();*/

  push();
  translate(467,1090);
  rotationLinks = map(fluchtpunkt.y,0,height-150,25,0);
  //var xCorrection = constrain(xCorrection,268,467);
  var xCorrection = constrain(xCorrection,-199,0);
  xCorrection = -rotationLinks*7;
  translate(xCorrection,0);
  rotate(rotationLinks);
  image(linkerSki2,0,0);
  pop();




  /*push();
  translate(557,1090);
  if (_alpha > threshold){
    dir_ski_r = speed_ski_r;
  }
  else if (_alpha < threshold){
    dir_ski_r = -speed_ski_r;
  }
  else {
    dir_ski_r = 0;
  }
  rotationRechts = constrain(rotationRechts,-25,0);
  rotationRechts = rotationRechts + dir_ski_r;
  var xCorrectionRechts = constrain(xCorrectionRechts,557,756);
  var xCorrectionRechts = -rotationRechts*7;
  translate(xCorrectionRechts,0);
  rotate(rotationRechts);
  image(rechterSki2,0,0);
  pop();*/


  push();
  translate(557,1090);
  rotationRechts = map(fluchtpunkt.y,0,height-150,-25,0);
  //var xCorrectionRechts = constrain(xCorrectionRechts,557,756);
  var xCorrectionRechts = constrain(xCorrectionRechts,0,199);
  xCorrectionRechts = -rotationRechts*7;
  translate(xCorrectionRechts,0);
  rotate(rotationRechts);
  image(rechterSki2,0,0);
  pop();

  /*push();
  translate(557,1090);
  rotationRechts = map(fluchtpunkt.y,0,height-150,-25,0);
  var xCorrectionRechts = constrain(xCorrectionRechts,0,199);
  xCorrectionRechts = rotationRechts*7;
  translate(xCorrectionRechts,0);
  rotate(rotationRechts);
  image(rechterSki2,0,0);
  pop();*/

  
//SKIBRILLE
image(goggles,512,384);
fill('red');
ellipse(fluchtpunkt.x,fluchtpunkt.y,10,10);


}
