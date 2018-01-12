//////////////////////////////////////////////////////////////////////////
//                       //                                             //
//   -~=Manoylov AC=~-   //      Spherical text magnification           //
//                       //                                             //
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// Inspired by:                                                         //
//    Jared Tarbell's "Spherical Magnification" Artwork.                //
//    http://levitated.net/daily/levTextSphere.html                     //
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// Controls                                                             //
//    mouse                                                             //
//       move: lens effect                                              //
//       down: change lens amount                                       //
//                                                                      //
//    keyboard                                                          //
//        'a': grid randomize                                           //
//        'z': lens amount randomize                                    //
//        'x': chars position randomize                                 //
//        'c': normal chars position & lens amount                      //
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// Contacts:                                                            //
//    http://manoylov.tumblr.com/                                       //
//    https://codepen.io/Manoylov/                                      //
//    https://www.openprocessing.org/user/23616/                        //
//    https://www.facebook.com/epistolariy                              //
//////////////////////////////////////////////////////////////////////////
//
// without additional features this code will be much shorter

var isRandShiftPos = false;
var isRandLensAmount = false;
var lensParams = {
    radius: 450,
    magAmount: 2,
    magAddition: 1
};
var baseTextSize;
var baseTextSizeMultiplier = 0.011;
var border;
var borderMultiplier = 0.124;

var fontForChar = 'Arial';
var fontForSpecialChar = 'Arial Black';
var centersText = ['IIT'];
var textForRandomChars = ["FLAVIOMUELLER"];

var charsArr = [];
var gridSurf;

var img;
var employeesJson;
var employeesIIT;
var employeesIITname = [];
var employeesIITimage = [];

var rowCount = 1;
var colCount = 1;


function preload() {
    employeesJson = loadJSON("employees.json", JsonLoaded);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    baseTextSize = windowWidth * baseTextSizeMultiplier;
    border = windowWidth * borderMultiplier;
    lensParams.radius = windowWidth / 4.26;
    translate((windowWidth - width) / 2, (windowHeight - height) / 2);
    initSetupsForCharsGrid();
}


function JsonLoaded(data) {
    employeesIIT = data.IIT;
    img = loadImage("images/" + employeesIIT[Math.floor(Math.random() * employeesIIT.length)].image);

}

function fillEmployeesArray() {
    employeesIIT.forEach(function (element) {
        append(employeesIITname, element.name);
        append(employeesIITimage, element.image);
    });
}

function randomizeArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function draw() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    lensParams.magAmount = (lensParams.magAmount + lensParams.magAddition) / 2;

    charsArr.forEach(function (charNodeItem) { charNodeItem.calcNewPos().drawLine(); });
    charsArr.forEach(function (charNodeItem) { charNodeItem.drawChar(); });
}

function mousePressed() {
    lensParams.magAddition = 2;
}

function mouseReleased() {
    lensParams.magAddition = 1;
}

function keyPressed() {
    switch (key.toLowerCase()) {
        case 'a':
            {
                randomizeArray(employeesIIT);
                fillEmployeesArray();
                initSetupsForCharsGrid(5, 7);
                break;
            }
        case 'x': {
            isRandShiftPos = true;
            gridSurf.traverse(function (x, y, index) {
                charsArr[index].setPos(x + random(-20, 20), y + random(-20, 20));
            });
            break;
        }
        case 'z': {
            isRandLensAmount = true;
            gridSurf.traverse(function (x, y, index) {
                charsArr[index].lensRadius = random(300, 700);
            });
            break;
        }
        case 'c': {
            isRandLensAmount = false;
            isRandShiftPos = false;
            gridSurf.traverse(function (x, y, index) {
                charsArr[index].setPos(x, y);
                charsArr[index].lensRadius = lensParams.radius;
            });
            break;
        }
    }
}


function initSetupsForCharsGrid() {
    charsArr.length = 0;
    centersText = ["IIT"];

    clacRowCol();

    randomizeArray(employeesIIT);
    fillEmployeesArray();

    if (!gridSurf) {
        gridSurf = new GridCorners(new Point(border, border), new Point(width - border, height - border), colCount, rowCount);
    } else {
        gridSurf.reset(new Point(border, border), new Point(width - border, height - border), colCount, rowCount);
    }

    // for visually centering text in chars rect
    var posForCenterText = ~~((gridSurf.rowCount - 1) / 2) * gridSurf.colCount - 1 + ~~((gridSurf.colCount - centersText.length) / 2);

    gridSurf.traverse(function (x, y, index) {
        if (index > posForCenterText && centersText.length) {
            charsArr.push(new CharNode(x + (isRandShiftPos ? random(-20, 20) : 0), y + (isRandShiftPos ? random(-20, 20) : 0), centersText.shift(), baseTextSize + baseTextSize * 4, fontForSpecialChar));
            charsArr[index].clr = '#d1460e';
            charsArr[index].lensRadius = isRandLensAmount ? random(300, 700) : lensParams.radius;
        } else {
            charsArr.push(new CharNode(x + (isRandShiftPos ? random(-20, 20) : 0), y + (isRandShiftPos ? random(-20, 20) : 0), employeesIITname.shift(), baseTextSize, fontForChar));
            charsArr[index].lensRadius = isRandLensAmount ? random(300, 700) : lensParams.radius;
        }
    });
}


function windowResized() {
    createCanvas(windowWidth, windowHeight);
    if (windowHeight * 1.9 > windowWidth) {
        baseTextSize = windowWidth * baseTextSizeMultiplier;
        border = windowWidth * borderMultiplier;
    } else {
        baseTextSize = windowHeight * baseTextSizeMultiplier;
        border = windowHeight * borderMultiplier;
    }
    lensParams.radius = windowWidth / 4.26;
    fillEmployeesArray();
    initSetupsForCharsGrid();

}


function clacRowCol() {
    if (windowWidth < windowHeight) { //more rows than cols
        if (employeesIIT.length < 3) {
            rowCount = 3;
            colCount = 1;
            return;
        }else if (employeesIIT.length < 9) {
            rowCount = 3;
            colCount = 3;
            fillArray(8);
            return;
        } else if (employeesIIT.length < 15) {
            rowCount = 5;
            colCount = 3;
            fillArray(14);
            return;
        } else if (employeesIIT.length < 25) {
            rowCount = 5;
            colCount = 5;
            fillArray(24);
            return;
        } else if (employeesIIT.length < 35) {
            rowCount = 7;
            colCount = 5;
            fillArray(34);
            return;
        } else if (employeesIIT.length < 49) {
            rowCount = 7;
            colCount = 7;
            fillArray(48);
            return;
        } else if (employeesIIT.length < 63) {
            rowCount = 9;
            colCount = 7;
            fillArray(62);
            return;
        }
        
    } else {
        if (employeesIIT.length < 3) {
            rowCount = 3;
            colCount = 1;
            return;
        } else if (employeesIIT.length < 9) {
            rowCount = 3;
            colCount = 3;
            fillArray(8);
            return;
        } else if (employeesIIT.length < 15) {
            rowCount = 3;
            colCount = 5;
            fillArray(14);
            return;
        } else if (employeesIIT.length < 35) {
            rowCount = 5;
            colCount = 7;
            fillArray(34);
            return;
        } else if (employeesIIT.length < 49) {
            rowCount = 7;
            colCount = 7;
            fillArray(48);
            return;
        } else if (employeesIIT.length < 63) {
            rowCount = 7;
            colCount = 9;
            fillArray(62);
            return;
        }
        
    }
}


function fillArray(lengthToBe) {
   if (employeesIIT.length == lengthToBe) {
       return;
   } else if (employeesIIT.length < lengthToBe) {
       for (var i = employeesIIT.length; i < lengthToBe; i++) {
           append(employeesIIT, "");
       }
   } else {
       throw new exception("Cant fill Array whith this length");
   }
}


// Point Class
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.reset = function (x, y) {
    this.constructor(x, y);
};

function randomChar(str) {
    var chars = str || "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var rnum = Math.floor(Math.random() * chars.length);
    return chars.substring(rnum, rnum + 1);
}
