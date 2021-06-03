import p5 from "p5";
import * as dat from "dat.gui";
import { ratio, shuffle } from "./helpers";

const sketch = p5 => {
    const controls = {
        ratio: 4,
        "Redraw!"() {},
    };

    const size = 700;
    const gridLines = false;
    let res = size / controls.ratio;
    let startTiles = [];
    let flattenedTilesArr = [];
    let img, cWidth, cHeight, gui, newArr, oldSelection, newSelection, canvas;

    p5.preload = () => (img = p5.loadImage("./img.jpg"));

    p5.setup = () => {
        const aspectRatio = ratio(img.width, img.height);

        if (aspectRatio[0] > aspectRatio[1]) {
            cWidth = Math.floor((aspectRatio[0] * size) / aspectRatio[1]);
            cHeight = size;
        } else {
            cHeight = Math.floor((aspectRatio[1] * size) / aspectRatio[0]);
            cWidth = size;
        }

        canvas = p5.createCanvas(cWidth, cHeight);
        p5.background("#000");
        img.resize(cWidth, cHeight);

        startNewPuzzle();
        gui = new dat.GUI();
        gui.add(controls, "ratio", { "2x2": 2, "4x4": 4, "5x5": 5, "10x10": 10 }).onChange(() => {
            startNewPuzzle();
        });
        gui.add(controls, "Redraw!").onChange(() => {
            startNewPuzzle();
        });
    };

    p5.mousePressed = () => {
        const mouseX = p5.mouseX;
        const mouseY = p5.mouseY;
        if (mouseX > 0 && mouseY > 0 && mouseX < cWidth && mouseY < cHeight) {
            clickHandler();
        }
    };

    const startNewPuzzle = () => {
        res = size / controls.ratio;
        newArr = null;
        startTiles = [];
        flattenedTilesArr = [];
        oldSelection = null;
        newSelection = null;
        storeTileInformation();
        flattenedTilesArr = startTiles.flat();
    };

    const drawGrid = () => {
        p5.strokeWeight(1);
        p5.stroke("#000");
        for (let x = 0; x < cWidth; x += res) {
            for (let y = 0; y < cHeight; y += res) {
                p5.line(x, 0, x, cHeight);
                p5.line(0, y, cWidth, y);
            }
        }
    };

    const storeTileInformation = () => {
        for (let x = 0; x < cWidth; x += res) {
            let yArr = [];
            for (let y = 0; y < cHeight; y += res) {
                const data = img.get(x, y, res, res);
                yArr.push(data);
            }
            startTiles.push(yArr);
        }
        drawTiles(true);
    };

    const drawTiles = shuffleTiles => {
        if (shuffleTiles) {
            shuffle(startTiles);
            startTiles.forEach(arr => shuffle(arr));
        }
        for (let x = 0; x < cWidth; x += res) {
            for (let y = 0; y < cHeight; y += res) {
                const xIndex = x / res;
                const yIndex = y / res;
                const tile = startTiles[xIndex][yIndex];
                tile.params = {};
                tile.params.x = x;
                tile.params.y = y;
                p5.image(tile, x, y, res, res);
            }
        }
        if (gridLines) drawGrid();
    };

    const drawTilesWithParams = () => {
        newArr = flattenedTilesArr.map(tile => {
            if (tile.params.x === newSelection.params.x && tile.params.y === newSelection.params.y) {
                p5.image(tile, oldSelection.params.x, oldSelection.params.y, res, res);
                return { ...tile, params: { x: oldSelection.params.x, y: oldSelection.params.y } };
            }
            if (tile.params.x === oldSelection.params.x && tile.params.y === oldSelection.params.y) {
                p5.image(tile, newSelection.params.x, newSelection.params.y, res, res);
                return { ...tile, params: { x: newSelection.params.x, y: newSelection.params.y } };
            }
            p5.image(tile, tile.params.x, tile.params.y, res, res);
            return tile;
        });
        if (gridLines) drawGrid();
    };

    const clickHandler = () => {
        const mouseX = p5.mouseX;
        const mouseY = p5.mouseY;

        if (newArr) flattenedTilesArr = newArr;

        oldSelection = newSelection;
        newSelection = flattenedTilesArr.find(el => mouseX > el.params.x && mouseX < el.params.x + res && mouseY > el.params.y && mouseY < el.params.y + res);

        if (oldSelection !== newSelection && newSelection) {
            const { x, y } = newSelection.params;
            p5.fill(0, 0, 255, 100);
            p5.rect(x, y, res, res);
            if (oldSelection && newSelection) {
                flattenedTilesArr = flattenedTilesArr.flat().map(el => {
                    if (el.params.x === newSelection.params.x && el.params.y === newSelection.params.y) {
                        el = oldSelection;
                    } else if (el.params.x === oldSelection.params.x && el.params.y === oldSelection.params.y) {
                        el = newSelection;
                    }
                    return el;
                });
                drawTilesWithParams();
                newSelection = null;
                oldSelection = null;
            }
            return;
        }
        if (oldSelection === newSelection) {
            drawTilesWithParams();
            newSelection = null;
            oldSelection = null;
        }
    };

    p5.keyPressed = () => {
        if (p5.keyCode === 80) {
            p5.saveCanvas(`${Date.now()}`, "png");
        }
    };
};

new p5(sketch);
