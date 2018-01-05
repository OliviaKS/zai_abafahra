function snowMachine(n) {
    "use strict";
    //snow library based on https://www.openprocessing.org/sketch/395389
    //var quantity = n || 800;
    var quantity = n || map(fluchtpunkt.y,0,height-150,900,400);
    var xPosition = [];
    var yPosition = [];
    var flakeSize = [];
    var direction = [];
    var age = [];
    var minFlakeSize = 1.5;
    var maxFlakeSize = 8;
    var linearForce = 0;
    var appearTime = 10;
    var yBooster = 1;

    var pointForceCenter;
    var pointForce = 0;

    var posHelper;

    var machine = {

    }



    function init() {

        posHelper = createVector(0, 0);

        for (var i = 0; i < quantity; i++) {
            flakeSize.push(random(minFlakeSize, maxFlakeSize));
            xPosition.push(random(0, width));
            yPosition.push(random(0, height));
            direction.push(round(random(0, 1)));
            age.push(0);
        }

        machine.setCenter(width/2,height/2);
    }

    machine.setFlakeWeight = function(val) {
        yBooster = val;
    }

    machine.setFlakeSize = function(min, max) {
        minFlakeSize = min;
        maxFlakeSize = max;

        for (var i = 0; i < flakeSize.length; i++) {
          flakeSize[i] = random(minFlakeSize, maxFlakeSize);
        }

    }

    machine.setCenter = function(x, y) {
        pointForceCenter = createVector(x, y);
    }

    machine.setPointForce = function(val) {
        //scaling the value, as pointForce needs to be a small value
        pointForce = 0.1 * val;
    };

    machine.setLinearForce = function(val) {
        linearForce = val;
        // if(linearForce==0){
        //   border = 0;
        // }
        // else {
        //   border = 300;
        // }
    }

    machine.draw = function() {

        for (var i = 0; i < xPosition.length; i++) {

            var opacity = 255;
            if (pointForce > 0 && age[i] < appearTime) {
                opacity = map(age[i], 0, appearTime, 0, 255);
            }
            //fill(255, opacity);
            //fill(250,opacity);
            //fill('#fff5e6');
            fill('#edefef');
            noStroke();
            ellipse(xPosition[i], yPosition[i], flakeSize[i], flakeSize[i]);

            if (direction[i] == 0) {
                xPosition[i] += map(flakeSize[i], minFlakeSize, maxFlakeSize, .1, .5);
            } else {
                xPosition[i] -= map(flakeSize[i], minFlakeSize, maxFlakeSize, .1, .5);
            }


            //point Force
            posHelper.set(xPosition[i], yPosition[i]);
            var pVel = p5.Vector.sub(posHelper, pointForceCenter);
            pVel.mult(pointForce);

            //linear force
            xPosition[i] += linearForce + pVel.x;
            yPosition[i] += yBooster * (flakeSize[i] + direction[i] + pVel.y);

            age[i]++;

            if (xPosition[i] > width + flakeSize[i]) {
                if (pointForce > 0) {
                    xPosition[i] = random(0, width);
                    yPosition[i] = random(-flakeSize[i], pointForceCenter.y);
                    age[i] = 0;
                } else {
                    xPosition[i] = -flakeSize[i];
                }
            } else if (xPosition[i] < -flakeSize[i]) {

                if (pointForce > 0) {
                    xPosition[i] = random(0, width);
                    yPosition[i] = random(-flakeSize[i], pointForceCenter.y);
                    age[i] = 0;
                } else {
                    xPosition[i] = width + flakeSize[i];
                }
            } else if (yPosition[i] > height + flakeSize[i]) {

                if (pointForce > 0) {
                    xPosition[i] = random(0, width);
                    yPosition[i] = random(-flakeSize[i], pointForceCenter.y);
                    age[i] = 0;
                } else {
                    yPosition[i] = -flakeSize[i];
                }
                age[i] = 0;
            }

        }
    }

    init();

    return machine;

}