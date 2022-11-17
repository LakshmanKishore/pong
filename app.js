let canvas = document.querySelector("canvas")
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

let h1 = document.querySelector("h1");

let portrait = window.matchMedia("(orientation: portrait)");

let c = canvas.getContext("2d");

let rectWidth = 10, rectHeight = 100, lx = 0, ly = canvas.height / 2 - 50, gameOver = false, size = 20, cx = canvas.width / 2, cy = canvas.height / 2, r = 10, moveCircle = false, p1 = 0, p2 = 0, defaultSpeed = 5, xcircleSpeed = defaultSpeed, ycircleSpeed = defaultSpeed;
const canvasWidthHalf = canvas.width / 2, canvasHeightHalf = canvas.height / 2;

if (window.innerWidth > 1000) {
    // Increase the rectangle width and height, radius if game is played in larger width
    rectWidth = 20;
    rectHeight = 200;
    r = 20;
}

let rx = canvas.width - rectWidth, ry = 0;

function startGame() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    // draw right and left rectangles.
    c.beginPath();
    c.rect(lx, ly, rectWidth, rectHeight);
    c.fillStyle = "blue";
    c.fill();
    c.closePath();

    c.beginPath();
    c.rect(rx, ry, rectWidth, rectHeight);
    c.fillStyle = "blue";
    c.fill();
    c.closePath();

    c.beginPath();
    c.arc(cx, cy, r, 0, 2 * Math.PI);
    c.fillStyle = "green";
    c.fill();
    c.closePath();


    if (moveCircle) {
        if (cx >= canvas.width) {
            p1 += 1;
            cx = canvas.width / 2;
            cy = canvas.height / 2;
            xcircleSpeed = 0;
            ycircleSpeed = 0;
            moveCircle = false;
        }
        if (cx - r <= 0) {
            p2 += 1;
            cx = canvas.width / 2;
            cy = canvas.height / 2;
            xcircleSpeed = 0;
            ycircleSpeed = 0;
            moveCircle = false;
        }
        cx += xcircleSpeed;
        cy += ycircleSpeed;
    }

    let rightCollided = rectCircleColliding({ x: cx, y: cy, r: r }, { x: rx, y: ry, w: rectWidth, h: rectHeight })
    let leftCollided = rectCircleColliding({ x: cx, y: cy, r: r }, { x: lx, y: ly, w: rectWidth, h: rectHeight })
    if (rightCollided) {
        xcircleSpeed = -1 * xcircleSpeed;
    }
    if (leftCollided) {
        xcircleSpeed = -1 * xcircleSpeed;
    }

    let bottomCollided = rectCircleColliding({ x: cx, y: cy, r: r }, { x: 0, y: canvas.height, w: canvas.width, h: 1 })
    if (bottomCollided) {
        ycircleSpeed = -1 * ycircleSpeed;
    }
    // console.log(bottomCollided)
    let upCollided = rectCircleColliding({ x: cx, y: cy, r: r }, { x: 0, y: 0, w: canvas.width, h: 1 })
    if (upCollided) {
        ycircleSpeed = -1 * ycircleSpeed;
    }

    if (p1 == 5 || p2 == 5) {
        gameOver = true;
    }


    let wHalf = canvas.width / 2, hHalf = canvas.height / 2;
    c.font = (size + 20) + "px Arial";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText(p1, wHalf - size, size * 2);
    c.fillText(p2, wHalf + size, size * 2);

    if (!gameOver) {
        requestAnimationFrame(startGame);
    } else {
        let wHalf = canvas.width / 2, hHalf = canvas.height / 2;
        c.font = (size + 20) + "px Arial";
        c.fillStyle = "yellow";
        c.textAlign = "center";
        c.fillText("GAME OVER", wHalf, hHalf);
        c.font = (size + 10) + "px Arial";
        c.fillText(`Player ${p1 == 5 ? "1" : "2"} won `, wHalf, hHalf + size + 10);
        c.fillStyle = "green";
        c.font = size + "px Arial";
        c.fillText("To play again refresh the page 😅", wHalf, hHalf + size + 50);
    }

}

// return true if the rectangle and circle are colliding
function rectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

const handler = (e) => {
    e = e || window.event;
    const clickx = e.clientX, clicky = e.clientY;
    if (e.keyCode === 38 || (clickx > canvasWidthHalf && clicky < canvasHeightHalf)) {
        //   console.log('up arrow pressed')
        if (ry <= 0) {
            ry = 0;
        } else {
            ry -= 30;
        }

        if (!moveCircle) {
            moveCircle = true;
            xcircleSpeed = defaultSpeed;
            ycircleSpeed = -defaultSpeed;
        }
    } else if (e.keyCode === 40 || (clickx > canvasWidthHalf && clicky > canvasHeightHalf)) {
        //   console.log('down arrow pressed')
        if (ry + rectHeight >= canvas.height) {
            ry = canvas.height - rectHeight;
        } else {
            ry += 30;
        }
        if (!moveCircle) {
            moveCircle = true;
            xcircleSpeed = defaultSpeed;
            ycircleSpeed = -defaultSpeed;
        }
    }


    if (e.keyCode === 87 || (clickx < canvasWidthHalf && clicky < canvasHeightHalf)) {
        //   console.log('up arrow pressed')
        if (ly <= 0) {
            ly = 0;
        } else {
            ly -= 30;
        }
        if (!moveCircle) {
            moveCircle = true;
            xcircleSpeed = -defaultSpeed;
            ycircleSpeed = -defaultSpeed;
        }
    } else if (e.keyCode === 83 || (clickx < canvasWidthHalf && clicky > canvasHeightHalf)) {
        //   console.log('down arrow pressed')
        if (ly + rectHeight >= canvas.height) {
            ly = canvas.height - rectHeight;
        } else {
            ly += 30;
        }
        if (!moveCircle) {
            moveCircle = true;
            xcircleSpeed = -defaultSpeed;
            ycircleSpeed = -defaultSpeed;
        }
    }
}

document.addEventListener("click", handler);

document.addEventListener("keydown", handler);

portrait.addEventListener("change", function (e) {
    if (e.matches) {
        // Portrait mode
        h1.hidden = false;
        canvas.hidden = true;
    } else {
        // Landscape
        window.location.reload();
        canvas.hidden = false;
        h1.hidden = true;
        startGame();
    }
});

if (portrait.matches) {
    // Portrait mode
    h1.hidden = false;
    canvas.hidden = true;
} else {
    // Landscape
    canvas.hidden = false;
    h1.hidden = true;
    startGame();
}
