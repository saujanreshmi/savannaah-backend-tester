import {Test, Box} from "./ui"
import {runTests, setupTests} from "./tests";

const blessed = require('blessed');

// Create a screen object.
const sc = blessed.screen({
    smartCSR: true,
    dockBorders: true,
});
sc.title = 'my window title';

const boxes: Box[] = [
    new Box(blessed.box({
        top: '0',
        left: '0',
        width: '50%',
        height: '25%',
        tags: true,
        border: {
            type: 'line'
        }
    }), [
        new Test("Test01", "CREATE SESSION     "),
        new Test("Test02", "UPDATE SESSION     "),
        new Test("Test03", "RETRIEVE SESSION   "),
        new Test("Test04", "DESTROY SESSION    ")
    ]),
    new Box(blessed.box({
        top: '0',
        left: '50%',
        width: '50%',
        height: '25%',
        tags: true,
        border: {
            type: 'line'
        }
    }), [
        new Test("Test01", "RETRIEVE WAREHOUSES"),
        new Test("Test02", "CREATE WAREHOUSE   "),
        new Test("Test03", "RETRIEVE WAREHOUSE "),
        new Test("Test04", "UPDATE WAREHOUSE   "),
        new Test("Test05", "ACTION WAREHOUSE   "),
        new Test("Test06", "DELETE WAREHOUSE   ")
    ])
];

//append the boxes in screen
boxes.forEach((box) => {
    sc.append(box.box);
})

// Quit on Escape, q, or Control-C.
sc.key(['escape', 'q', 'C-c'], function (ch: any, key: any) {
    return process.exit(0);
});

//run tests
setupTests(boxes, sc).then((res: {error :boolean, token :string}) => {
    if (!res.error) {
        setTimeout(() => {
            runTests(res.token, boxes, sc);
        }, 3000);
    }
});
