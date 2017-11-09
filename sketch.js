//VERBINDUNG ZU MUSEGERÄT AUFBAUEN
//var muse = musedata.connect();
var muse = musedata.fake();

var n = 100;
var endpunkte = [];
var vel_fluchtpunkt;
var fluchtpunkt;
var skipiste;
var acc;
var friction = 0.98;
var force = 0.02;
var slider;


function setup() {
  //BASICS
  createCanvas(1024, 768);
  frameRate(30);

  //ENDPUNKTE SKIPISTE GENERIEREN
  for (var i = 0; i < n; i++) {
    var x = map(i, 0, n, -400, width + 400);
    var y = height;
    var p = createVector(x, y);
    endpunkte.push(p);
  }

  //VEKTOREN KREIEREN
  vel_fluchtpunkt = createVector(0, 0);
  fluchtpunkt = createVector(width / 2, height / 2);
  acc = createVector(0, 0);

  //SLIDER
 /* slider = createSlider (0,1,0.5);
  slider.position(20,40);
  slider.style('width''80px');*/

}


function draw() {
  background('lightblue');
  stroke('white');
  fill('#fbfdff');

  //SLIDER
  /*var val = slider.value();
  background(val);*/


  //ALPHA-WERTE HOLEN
  var _alpha = muse.getAlpha();

  //SKIPISTE
  //DYN.SCHWELLE HIER EINBAUEN
  acc.set(0, map(_alpha, 0, 0.4, -force, force));
  text(_alpha, 20, 20);


  vel_fluchtpunkt.add(acc);
  //fluchtpunkt.add(vel_fluchtpunkt);
  //fluchtpunkt.y = constrain(fluchtpunkt.y, 0, height - 150);

  if (fluchtpunkt.y <= 0){
      vel_fluchtpunkt.set(0,0);
      }
      else if(fluchtpunkt.y>=height-150){
        vel_fluchtpunkt.set(0,0);
      }

   fluchtpunkt.add(vel_fluchtpunkt);
    fluchtpunkt.y = constrain(fluchtpunkt.y, 0, height - 150);
 // triangle(fluchtpunkt.x, fluchtpunkt.y, -400, height, width + 400, height);



  stroke('white');
  for (var i = 0; i < endpunkte.length; i++) {
    var aktuellerEndpunkt = endpunkte[i];
    var v = p5.Vector.lerp(aktuellerEndpunkt,fluchtpunkt,map(fluchtpunkt.y,0,height-150,0.5,1));
    //line(fluchtpunkt.x, fluchtpunkt.y, endpunkte[i].x, endpunkte[i].y);
    line(v.x,v.y,aktuellerEndpunkt.x,aktuellerEndpunkt.y);

    //SKIPISTE ENDE
  }

}
