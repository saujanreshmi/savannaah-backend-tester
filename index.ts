import {Test, Box} from "./ui"
import {runTests, setupTests} from "./tests";

const EventEmitter = require('events');

const blessed = require('blessed');

const screen = blessed.screen({
    smartCSR: true,
    autoPadding: false,
    warnings: true,
    dockBorders: true,
    fullUnicode: true
});
// Create a screen object.
// const sc = blessed.screen({
//     smartCSR: true,
//     dockBorders: true,
// });
screen.title = 'Savannaah backend tester';

const window = blessed.box({
    parent: screen,
    left: 0,
    top: 0,
    width: '66%',
    height: '100%-1',
    tags: true,
    keys: true,
    vi: true,
    padding: 1,
    mouse: true,
    alwaysScroll: true,
    scrollable: true,
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'yellow'
        },
        style: {
            inverse: true
        }
    }
});

const statusEvent = new EventEmitter();

const boxes: Box[] = [
    new Box(
        ":session",
        blessed.box({
            parent: window,
            top: 1,
            left: 1,
            width: 76,
            height: 15,
            tags: true,
            border: {
                type: 'line'
            }
        }), [
            new Test("Test01", "CREATE SESSION     "),
            new Test("Test02", "UPDATE SESSION     "),
            new Test("Test03", "RETRIEVE SESSION   "),
            new Test("Test04", "DESTROY SESSION    ")
        ],
        statusEvent),
    new Box(
        ":warehouse",
        blessed.box({
            parent: window,
            top: 1,
            left: 77,
            width: 76,
            height: 15,
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
        ],
        statusEvent),
    new Box(
        ":employee",
        blessed.box({
            parent: window,
            top: 16,
            left: 1,
            width: 76,
            height: 15,
            tags: true,
            border: {
                type: 'line'
            }
        }), [
            new Test("Test01", "RETRIEVE EMPLOYEES "),
            new Test("Test02", "CREATE EMPLOYEE    "),
            new Test("Test03", "RETRIEVE EMPLOYEE  "),
            new Test("Test04", "UPDATE EMPLOYEE    "),
            new Test("Test05", "ACTION EMPLOYEE    "),
            new Test("Test06", "DELETE EMPLOYEE    ")],
        statusEvent)
];

let completedTest = 0;

const logger = blessed.log({
    parent: screen,
    top: 0,
    left: '66%',
    width: '33%+4',
    height: '100%-1',
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    padding: 1,
    scrollback: 100,
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'yellow'
        },
        style: {
            inverse: true
        }
    },
    style: {
        bg: 'black',
    }
});

const form = blessed.form({
    parent: screen,
    width: '33%+4',
    left: '66%',
    top: '100%-1',
    keys: true,
    vi: true
});

const command = blessed.textbox({
    parent: form,
    name: 'command',
    top: 0,
    left: '0',
    height: 1,
    width: '100%',
    paddingLeft: 1,
    inputOnFocus: true,
    content: 'command',
    style: {
        bg: 'green',
        fg: 'black'
    },
    focus: {
        fg: 'blue'
    }
});

command.on('submit', function () {
    let text = command.getValue();
    boxes.some((box) => {
        if (box.name == text) {
            let out = "";
            box.tests.forEach((test) => {
                out += "[" + test.name.trim() + "]\n";
                if (test.logs != undefined) {
                    out += test.logs + "\n\n";
                } else {
                    out += "{logs not available yet}\n\n";
                }
            });
            logger.setContent("");
            logger.log(out);
            return;
        }
    });
})

let ch = "|";
let status = "Preparing..."

const progress = blessed.box({
    parent: screen,
    left: '0',
    top: '100%-1',
    width: '66%-1',
    height: 1,
    content: status,
    style: {
        bg: 'black',
        fg: 'green'
    },
    tags: true
});

form.focus();

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch: any, key: any) {
    return process.exit(0);
});

let loader = setInterval(function () {
    switch (ch) {
        case '|':
            ch = '/';
            break;
        case '/':
            ch = '-';
            break;
        case '-':
            ch = '\\';
            break;
        case '\\':
            ch = '|';
            break;
    }
    progress.setContent("{center}" + ch + "  " + status + "{/center}");
    screen.render();
}, 150).unref();

statusEvent.on('testing', () => {
    status = "Running...";
});

statusEvent.on('completed', () => {
    if (boxes.map((box) => {
        return box.getStatus()
    }).indexOf("running") < 0) {
        clearInterval(loader);
        progress.setContent("{center}\u2728{black-fg} {/black-fg}Done.{/center}");
    }
});

//run tests
setupTests(boxes, screen).then((res: { error: boolean, token: string }) => {
    if (!res.error) {
        setTimeout(() => {
            statusEvent.emit('testing');
            runTests(res.token, boxes, screen);
        }, 3000);
    }
});
