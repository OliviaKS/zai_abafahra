//VERBINDUNG ZU MUSEGERÄT AUFBAUEN
//var muse = musedata.connect();
var muse = musedata.fake();

//SKIPISTE
var n = 130;
var endpunkte = [];
var vel_fluchtpunkt;
var fluchtpunkt;
var skipiste;
var acc;
var friction = 0.97;
var force = 0.02;
var slider;
var PisteLinks;
var PisteRechts;
var PisteObenLinks;
var PisteObenRechts;
var wertSlider;

//SCHNEE
var snow;

//SKI
var linkerSki;
var rechterSki;
var rotation = 0;

//SZENERIE
var mountains;
var vel_mountains;

function preload(){
  linkerSki = loadImage('img/ski_zai.png');
  rechterSki = loadImage('img/ski_zai.png');
  mountains = loadImage('img/mountain_bg.png');
}


function setup() {
  //BASICS
  createCanvas(1024, 768);
  frameRate(30);
  imageMode(CENTER);


  //ENDPUNKTE SKIPISTE GENERIEREN
  for (var i = 0; i < n; i++) {
    var x = map(i, 0, n, -700, width + 700);
    var y = height;
    var p = createVector(x, y);
    endpunkte.push(p);
  }

  //VEKTOREN KREIEREN
  vel_fluchtpunkt = createVector(0, 0);
  fluchtpunkt = createVector(width / 2, height / 2);
  //vel_mountains = createVector(0,0);
  //mountains = createVector(512,500);
  vel_mountains = 0;
  acc = createVector(0, 0);
  PisteLinks = createVector(-700,height);
  PisteRechts = createVector(700,height);
  PisteObenLinks = createVector(0,0);
  PisteObenRechts = createVector(0,0);

  //SCHNEE
  snow = snowMachine();
  //center of the point force, um die Bewegunsrichtung zu setzen
  snow.setCenter(width/2,height/2);

  //set the flake min size and max size
  snow.setFlakeSize(1.5,6);

  //SLIDER
  slider = createSlider (0,0.7,0.3,0);
  slider.position(20,60);
  slider.style('width','200px');

}


function draw() {
  //BASICS
  //background('#f4fafe');
  //Hintergrund zum Arbeiten/Testen/Pröblen:
  background('#d7eef9');
  //stroke('#9fa4a5');
  fill('white');
  image(mountains,512,500);

  //SLIDER
  wertSlider = slider.value();
  text('Max. AlphaWert ' + wertSlider,20,90);


  //ALPHA-WERTE HOLEN
  var _alpha = muse.getAlpha();

  //SKIPISTE
  //DYN.SCHWELLE HIER EINBAUEN
  acc.set(0, map(_alpha, 0, wertSlider, -force, force));
  text('Alpha ' + _alpha, 20, 20);


  vel_fluchtpunkt.add(acc);
  //fluchtpunkt.add(vel_fluchtpunkt);

  if (fluchtpunkt.y <= 0){
      vel_fluchtpunkt.set(0,0);
      }
      else if(fluchtpunkt.y>=height-150){
        vel_fluchtpunkt.set(0,0);
      }

  fluchtpunkt.add(vel_fluchtpunkt);
  fluchtpunkt.y = constrain(fluchtpunkt.y, 0, height - 150);

  //KANN EIN VECTOR AUCH EIN BILD ENTHALTEN?
  //bezieht sich auf Veränderung mountains.y entsprechend den alpha-Werten
  //vel_mountains.add(acc);
  //mountains.add(vel_mountains);
  //mountains.y = constrain(mountains.y, 398.095,600);
  vel_mountains = vel_mountains + map(_alpha,0,wertSlider,-0.1,0.1);
  mountains.y = mountains.y + vel_mountains;
  mountains.y = constrain(mountains.y,398.095,600);


  stroke('#eef8fc');
  for (var i = 0; i < endpunkte.length; i++) {
    var aktuellerEndpunkt = endpunkte[i];
    var v = p5.Vector.lerp(aktuellerEndpunkt,fluchtpunkt,map(fluchtpunkt.y,0,height-150,0.5,1));
    //line(fluchtpunkt.x, fluchtpunkt.y, endpunkte[i].x, endpunkte[i].y);
    /*noStroke();
    rect(0,v.y,width,height-v.y);
    stroke('#eef8fc');*/
    line(v.x,v.y,aktuellerEndpunkt.x,aktuellerEndpunkt.y);
  }


  //SCHNEE
  //======point force, z.B. um Forwärtsgeschwindigkeit zu simulieren
  //var pforce = map(mouseX,0,width,0,0.5);
  var pforce = map(_alpha, 0, wertSlider, 0, 0.65);
  snow.setPointForce(pforce);

  //======flake weight, je schwerer desto schneller fallen die Flocken
  //var weight = map(_alpha,0,wertSlider,0,2);
  //snow.setFlakeWeight(weight);

  snow.draw();


  text('Fluchtpunkt.y ' + fluchtpunkt.y, 20,40);

  // POLYGON FÜR SCHNEEHINTERGRUND
 // PisteObenLinks = p5.Vector.lerp(PisteLinks,fluchtpunkt,map(fluchtpunkt.y,0,height-150,0.5,1));
 // PisteObenRechts = p5.Vector.lerp(PisteRechts,fluchtpunkt,map(fluchtpunkt.y,0,height-150,0.5,1));
  //quad(PisteLinks.x,PisteLinks.y,PisteRechts.x,PisteRechts.y,PisteObenRechts.x,PisteObenRechts.y,PisteObenLinks.x,PisteObenLinks.y);
  //quad(-700,height,700,height,width,v.y,0,v.y);
 // rect(0,height-v.y,width,v.y);


  //SKIPISTE ENDE


  image(linkerSki,width/2-25,height+20);
  image(rechterSki,width/2+25,height+20);



}
