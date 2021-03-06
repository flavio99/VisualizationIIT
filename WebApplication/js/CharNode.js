// CharNode Class
function CharNode(x, y, char, img, size, font, clr) {
    "use strict";
    this.initPos = new Point(x, y);
    this.currPos = new Point(x, y);
    this.char = char || "";
    this.baseSize = size || 10;
    this.size = this.baseSize;
    this.distFromInitPos = 0;
    this.lensMag = 0;
    this.isBold = false;
    this.fontName = font || 'Arial';
    this.clr = clr || '#FFF';
    this.lensRadius = 80;
    this.isDrawEmptyChar = false;
    this.img = img;
}

CharNode.prototype.calcNewPos = function (lensDisposition) {
    "use strict";
    var distX = mouseX - this.initPos.x;
    var distY = mouseY - this.initPos.y;

    // distance to mouse
    this.distFromInitPos = Math.sqrt(distX * distX + distY * distY);
    this.lensMag = 0;

    if (this.distFromInitPos >= this.lensRadius) {
        // char outside of 'sphere'
        this.currPos.x = this.initPos.x;
        this.currPos.y = this.initPos.y;
    } else {
        // char inside of 'sphere'
        var lensDisp = 1 + Math.cos(Math.PI * Math.abs(this.distFromInitPos / this.lensRadius));
        this.currPos.x = this.initPos.x - lensParams.magAmount * distX * lensDisp / 2;
        this.currPos.y = this.initPos.y - lensParams.magAmount * distY * lensDisp / 2;
        // this.currPos.x = this.initPos.x - distX * lensDisp; this.currPos.y = this.initPos.y - distY * lensDisp;

        this.lensMag = lensParams.magAmount * (1 - Math.sin(Math.PI * Math.abs(this.distFromInitPos / this.lensRadius) / 2));
    }

    this.size = this.baseSize * (this.lensMag + 1);

    return this;
};

CharNode.prototype.setPos = function (x, y) {
    "use strict";
    this.initPos.reset(x, y);

    return this;
};

CharNode.prototype.drawLine = function () {
    if (!(this.char === ' ' && !this.isDrawEmptyChar)) {
        if (this.distFromInitPos <= this.lensRadius) {
            var lineOpacity = map(this.distFromInitPos, 0, this.lensRadius, 200, 0);

            push();
            stroke(180, lineOpacity);
            line(this.initPos.x, this.initPos.y, this.currPos.x, this.currPos.y);
            pop();
        }
    }

    return this;
};

CharNode.prototype.drawChar = function () {
    "use strict";
    if (!(this.char === ' ' && !this.isDrawEmptyChar)) {
        push();
        imageMode(CENTER, CENTER);
        fill(this.clr);
        textFont(this.fontName, this.size * 0.75);
        if (this.char == "Center") {
            image(this.img,
                this.currPos.x,
                this.currPos.y - this.size,
                this.size * 5.5,
                this.size * 5.5);
        }else if(this.char == "icon"){
            image(this.img,
                this.currPos.x,
                this.currPos.y - this.size,
                this.size * 5.5,
                this.size * 5.5);
        }else {
            image(this.img,
                this.currPos.x,
                this.currPos.y - this.size * 1.5,
                this.size * 5.5,
                this.size * 5.5);
            textAlign(CENTER, TOP);
            text(this.char, this.currPos.x, this.currPos.y + this.size * 1.5);
        }

        pop();
    }

    return this;
};