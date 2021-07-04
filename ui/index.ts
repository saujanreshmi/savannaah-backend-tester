const EventEmitter = require('events');

import {ElapsedTime, Result, Status, TestID} from "../utility";

export class Test {
    readonly id: TestID;
    readonly name: string;
    status: Status;
    result?: Result;
    elapsedTime?: ElapsedTime;
    logs?: String;
    constructor(id: TestID, name: string) {
        this.id = id;
        this.name = name;
        this.status = "pending";
    }
}

export class Box {
    private e: any;
    readonly name: string;
    private status: Status;
     box: any;
     tests: Test[];
    constructor(name: string, box: any, tests: Test[], event: any) {
        this.e = event;
        this.name = name;
        this.status = "pending";
        this.box = box;
        this.tests = tests.map(test => {return {...test}});
    }
    getStatus() :Status {
        return this.status;
    }
    changeStatus(newStatus: Status, sc: any) {
        this.status = newStatus;
        if (newStatus == "completed") {
            this.e.emit('completed');
        }
        this.refreshTitle(sc);
    }
    changeTestLogs(testID: TestID, newLogs: String) {
        this.tests.forEach((test)=>{
            if (test.id === testID) {
                test.logs = newLogs;
            }
        });
    }
    changeTestStatus(testID: TestID, newStatus: Status, sc: any) {
        this.tests.forEach((test)=>{
            if (test.id === testID) {
                test.status = newStatus;
            }
        });
        this.refreshTestLine(sc, testID);
    }
    changeTestResult(testID: TestID, newResult: Result, sc: any) {
        this.tests.forEach((test)=>{
            if (test.id === testID) {
                test.result = newResult;
            }
        });
        this.refreshTestLine(sc, testID);
    }
    changeTestElapsed(testID: TestID, newElapsedTime: ElapsedTime, sc: any) {
        this.tests.forEach((test) => {
            if (test.id === testID) {
                test.elapsedTime = newElapsedTime;
            }
        });
        this.refreshTestLine(sc, testID);
    }
    refreshTitle(sc:any) {
        this.box.setLine(0, '{center}{bold}Test['+this.name+'] Status['+this.status+']{/bold}{/center}');
        sc.render();
    }
    refreshTestLine(sc:any, testID: TestID) {
        let test = this.tests.filter((test) => test.id == testID)[0];
        let newLabel = ' '+formatTestNameString(test.name)+'  '+getTestStatusString(test.status)+'';
        if (test.result != undefined) {
            newLabel += '  '+getTestResultString(test.result)+'';
        }
        const elapsedTime = test.elapsedTime;
        if (elapsedTime) {
            newLabel += '  ' + formatElapsedTime(((elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e6).toString());
        }
        switch (testID) {
            case "Test01":
                this.box.setLine(2, newLabel);
                break;
            case "Test02":
                this.box.setLine(4, newLabel);
                break;
            case "Test03":
                this.box.setLine(6, newLabel);
                break;
            case "Test04":
                this.box.setLine(8, newLabel)
                break;
            case "Test05":
                this.box.setLine(10, newLabel);
                break;
            case "Test06":
                this.box.setLine(12, newLabel);
                break;
        }
        sc.render();
    }
}

function getTestStatusString(status: Status) :string {
    switch (status){
        case "pending":
            return '{black-fg}{yellow-bg} PENDING... {/}';
        case "running":
            return '{black-fg}{green-bg} TESTING... {/}';
        case "completed":
            return '{black-fg}{green-bg} COMPLETED  {/}';
    }
}

function getTestResultString(result?: Result) :string {
    switch (result){
        case "pass":
            return '{black-fg}{green-bg} PASS {/}';
        case "fail":
            return '{black-fg}{red-bg} FAIL {/}';
    }
    return '{black-fg}{red-fg}....{/}';
}

function formatTestNameString(name:string) :string {
    return '{white-fg}{blue-bg} '+name+' {/}';
}

function formatElapsedTime(time: string) :string {
    let t = time.split(".");
    if (Number(t[0]) > 3000) {
        //too long
        return '{black-fg}{red-bg} '+t[0].padStart(4,'0')+'.'+t[1].padEnd(6,'0')+'ms {/}';
    }
    return '{black-fg}{white-bg} '+t[0].padStart(4,'0')+'.'+t[1].padEnd(6,'0')+'ms {/}';
}
