import {ElapsedTime, Result, Status, TestID} from "../utility";

export class Test {
    readonly id: TestID;
    readonly name: string;
    status: Status;
    result?: Result;
    elapsedTime?: ElapsedTime;
    constructor(id: TestID, name: string) {
        this.id = id;
        this.name = name;
        this.status = "pending";
    }
}

export class Box {
    private status: Status;
     box: any;
     tests: Test[];
    constructor(box: any, tests: Test[]) {
        this.status = "pending";
        this.box = box;
        this.tests = tests.map(test => {return {...test}});
    }
    changeStatus(newStatus: Status, sc: any) {
        this.status = newStatus;
        this.refreshTitle(sc);
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
        this.box.setLine(0, '{center}{bold}TEST_STATUS ['+this.status+']{/bold}{/center}');
        sc.render();
    }
    refreshTestLine(sc:any, testID: TestID) {
        let test = this.tests.filter((test) => test.id == testID)[0];
        let newLabel = ' '+testID+ ' '+formatTestNameString(test.name)+'  Status '+getTestStatusString(test.status)+'';
        if (test.result != undefined) {
            newLabel += '  Result '+getTestResultString(test.result)+'';
        }
        const elapsedTime = test.elapsedTime;
        if (elapsedTime) {
            newLabel += '  Took ' + formatElapsedTime(((elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e6).toString() + 'ms');
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
            return '{yellow-bg} PENDING... {/}';
        case "running":
            return '{green-bg} TESTING... {/}';
        case "completed":
            return '{green-bg} COMPLETED  {/}';
    }
}

function getTestResultString(result?: Result) :string {
    switch (result){
        case "pass":
            return '{green-bg} PASS {/}';
        case "fail":
            return '{red-bg} FAIL {/}';
    }
    return '{red-fg}....{/}';
}

function formatTestNameString(name:string) :string {
    return '{blue-bg} '+name+' {/}';
}

function formatElapsedTime(time: string) :string {
    return '{black-bg} '+time+' {/}';
}
