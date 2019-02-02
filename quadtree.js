var canvas;
var ctx;

function getDistance(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

class QuadTree {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.w = x2 - x1;
        this.h = y2 - y1;
        this.cx = (x2 + x1)/2;
        this.cy = (y2 + y1)/2;
        this.NW = new QuadLeaf(x1, y1, this.cx, this.cy);
        this.NE = new QuadLeaf(this.cx, y1, x2, this.cy);
        this.SW = new QuadLeaf(x1, this.cy, this.cx, y2);
        this.SE = new QuadLeaf(this.cx, this.cy, x2, y2);
    }
}

function overlaps(x, y, r, quadtree) {
    d1 = getDistance(x,y,quadtree.x1,quadtree.y1);
    d2 = getDistance(x,y,quadtree.x2,quadtree.y2);
    d3 = getDistance(x,y,quadtree.x1,quadtree.y2);
    d4 = getDistance(x,y,quadtree.x2,quadtree.y1);
    
    if(d1 <= r || d2 <= r || d3 <= r || d4 <= r)
        return true;

    if(x >= quadtree.x1 && x <= quadtree.x2 && y >= quadtree.y1 && y <= quadtree.y2)
        return true;
}

function insertQuadTree(quadtree, point) {

    if(quadtree.NE == null) {
        quadtree.elements.push(point);
        if(quadtree.elements.length > 1) {
            let aux = quadtree.elements;
            quadtree = new QuadTree(quadtree.x1, quadtree.y1, quadtree.x2, quadtree.y2);
            for(let i of aux) {
                insertQuadTree(quadtree, i);
            }
        }
        return quadtree;
    }

    if(point.x < quadtree.cx) {
        if(point.y < quadtree.cy) {
            quadtree.NW = insertQuadTree(quadtree.NW, point);
        }
        else {
            quadtree.SW = insertQuadTree(quadtree.SW, point);
        }
    }
    else {
        if(point.y < quadtree.cy) {
            quadtree.NE = insertQuadTree(quadtree.NE, point);
        }
        else {
            quadtree.SE = insertQuadTree(quadtree.SE, point);
        }
    }

    return quadtree;
}

class QuadLeaf {
    constructor(x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.w = x2 - x1;
        this.h = y2 - y1;
        this.elements = [];
    }
}

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

function drawQuadTree(quadtree) {

    ctx = canvas.getContext('2d');

    ctx.strokeRect(quadtree.x1, quadtree.y1, quadtree.w, quadtree.h);

    if(quadtree.NW == null) {
        for(let i of quadtree.elements) {
            ctx.strokeRect(i.x, i.y, 1, 1);
        }
        return;
    }

    drawQuadTree(quadtree.NW);
    drawQuadTree(quadtree.NE);
    drawQuadTree(quadtree.SW);
    drawQuadTree(quadtree.SE);

}

var qt;

window.onload = ()=> {
    canvas = document.getElementById('mycanvas');
    // ctx = canvas.getContext('2d');

    qt = new QuadLeaf(0,0,canvas.width,canvas.height);

    drawQuadTree(qt);

    canvas.onclick = (event)=>{
        canvas.width = canvas.width;
        qt = insertQuadTree(qt, new Point(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop));
        drawQuadTree(qt);
    }

}