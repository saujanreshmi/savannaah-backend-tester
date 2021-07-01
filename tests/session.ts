import {TestID} from "../utility";
import {Box} from "../ui";
import axios from "axios";
const url = require("../url.json");

async function createSession(box:Box, test:TestID, sc:any) :Promise<{token: string, success: boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {token: "", success: false};
    const headers = {savauth: "YWRtaW46QWRyaWFuYTAxMQ==", application: "session", subdomain: "dev"}
    try {
        let response = await axios.post(url.session + "?action=create", {}, {headers: headers});
        res.token = response.data.token;
        res.success = true;
        box.changeTestResult(test, "pass", sc);
    } catch (error) {
        res.success = false;
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function updateSession(token:string, box:Box, test: TestID, sc:any) :Promise<boolean> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let result = false
    const headers = {token: token, application: "session", subdomain: "dev"}
    try {
        let response = await axios.post(url.session + "?action=update", {}, {headers: headers});
        result = true;
        box.changeTestResult(test, "pass", sc);
    } catch (error) {
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return result;
}

async function retrieveSession(token:string, box:Box, test: TestID, sc:any) :Promise<boolean> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let result = false
    const headers = {token: token, application: "session", subdomain: "dev"}
    try {
        let response = await axios.post(url.session + "?action=retrieve", {}, {headers: headers});
        result = true;
        box.changeTestResult(test, "pass", sc);
    } catch (error) {
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return result;
}

async function destroySession(token:string, box:Box, test: TestID, sc:any) :Promise<boolean> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let result = false
    const headers = {token: token, application: "session", subdomain: "dev"}
    try {
        let response = await axios.post(url.session + "?action=destroy", {}, {headers: headers});
        result = true;
        box.changeTestResult(test, "pass", sc);
    } catch (error) {
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return result;
}

module.exports = {
    "create" : createSession,
    "update" : updateSession,
    "retrieve" : retrieveSession,
    "destroy" : destroySession,
}
