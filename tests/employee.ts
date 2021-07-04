import {ApolloClient, gql, HttpLink, InMemoryCache} from "@apollo/client/core";
import fetch from "cross-fetch";
import {Box} from "../ui";
import {TestID} from "../utility";

const url = require("../url.json");
const avatar = require("./avatar.json");

const RETRIEVE_EMPLOYEES = gql`
    query GetEmployees($queryID: String!, $pageSize: Int!, $pageNo: Int!){
        employees(queryID: $queryID, pageSize: $pageSize, pageNo: $pageNo){
            uid,
            avatar,
            fullname,
            contact_email,
            contact_mobile,
            contact_phone,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            emergency_contact_fullname,
            emergency_contact_mobile,
            emergency_contact_relationship,
            employee_title,
            supervisor_uid,
            hired_date,
            savannaah_user,
            username,
            timezone,
            role_uid,
            created_date,
            created_by_uid,
            last_modified_date,
            last_modified_by_uid,
            record_state,
            last_login_date            
        }
    }
`;

const CREATE_EMPLOYEE = gql`
    mutation CreateEmployeeMutation($employee: CreateEmployee!){
        createEmployeeMutation(employee: $employee){
            uid,
            avatar,
            fullname,
            contact_email,
            contact_mobile,
            contact_phone,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            emergency_contact_fullname,
            emergency_contact_mobile,
            emergency_contact_relationship,
            employee_title,
            supervisor {
                uid,
                fullname
            },
            hired_date,
            savannaah_user,
            username,
            timezone,
            role {
                uid,
                name
            },
            created_by {
                uid,
            },
            created_date,
            last_modified_by {
                uid
            },
            record_state,
            last_modified_date,
            last_login_date,
            warehouses {
                uid,
                id,
                name
            }
        }
    }
`;

const RETRIEVE_EMPLOYEE= gql`
    query GetEmployee($uid: Int!){
        employee(uid: $uid){
            uid,
            avatar,
            fullname,
            contact_email,
            contact_mobile,
            contact_phone,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            emergency_contact_fullname,
            emergency_contact_mobile,
            emergency_contact_relationship,
            employee_title,
            supervisor {
                uid,
                fullname
            },
            hired_date,
            savannaah_user,
            username,
            timezone,
            role {
                uid,
                name
            },
            created_by {
                uid,
                fullname
            },
            created_date,
            last_modified_by {
                uid,
                fullname
            },
            record_state,
            last_modified_date,
            last_login_date,
            record_state_histories {
                uid,
                employee_uid,
                old_record_state,
                new_record_state,
                memo,
                created_date,
                created_by {
                    uid,
                    fullname
                }
            },
            warehouses {
                uid,
                id,
                name
            }
        }
    }
`

const UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployeeMutation($original: ArgEmployee!, $modified: ArgEmployee!){
        updateEmployeeMutation(original: $original, modified: $modified){
            uid,
            avatar,
            fullname,
            contact_email,
            contact_mobile,
            contact_phone,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            emergency_contact_fullname,
            emergency_contact_mobile,
            emergency_contact_relationship,
            employee_title,
            supervisor {
                uid,
                fullname
            },
            hired_date,
            savannaah_user,
            username,
            timezone,
            role {
                uid,
                name
            },
            created_by {
                uid,
                fullname
            },
            created_date,
            last_modified_by {
                uid,
                fullname
            },
            record_state,
            last_modified_date,
            last_login_date,
            warehouses {
                uid,
                id,
                name
            }         
        }
    }
`

const ACTION_EMPLOYEE = gql`
    mutation ActionEmployeeMutation($employee: ArgEmployee!, $action: GeneralAction!){
        actionEmployeeMutation(employee: $employee, action: $action){
            uid,
            avatar,
            fullname,
            contact_email,
            contact_mobile,
            contact_phone,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            emergency_contact_fullname,
            emergency_contact_mobile,
            emergency_contact_relationship,
            employee_title,
            supervisor {
                uid,
                fullname
            },
            hired_date,
            savannaah_user,
            username,
            timezone,
            role {
                uid,
                name
            },
            created_by {
                uid,
                fullname
            },
            created_date,
            last_modified_by {
                uid,
                fullname
            },
            record_state,
            last_modified_date,
            last_login_date,
            warehouses {
                uid,
                id,
                name
            }              
        }
    }
`

const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployeeMutation($uid: Int!){
        deleteEmployeeMutation(uid: $uid){
            uid,
            avatar,
            fullname,
            contact_email,
            contact_mobile,
            contact_phone,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            emergency_contact_fullname,
            emergency_contact_mobile,
            emergency_contact_relationship,
            employee_title,
            supervisor {
                uid,
                fullname
            },
            hired_date,
            savannaah_user,
            username,
            timezone,
            role {
                uid,
                name
            },
            created_by {
                uid,
                fullname
            },
            created_date,
            last_modified_by {
                uid,
                fullname
            },
            record_state,
            last_modified_date,
            last_login_date,
            warehouses {
                uid,
                id,
                name
            }    
        }
    }    
`

async function setup(token:string) :Promise<ApolloClient<any>> {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: url.graphql,
            fetch,
            headers: {token: token, subdomain: "dev", application: "employee"}
        }),
    });
}

async function retrieveEmployees(client:ApolloClient<any>, box:Box, test:TestID, screen:any) :Promise<boolean> {
    box.changeTestStatus(test, "running", screen);
    let start = process.hrtime();
    let result = false;
    try {
        let res = await client.query({
            query: RETRIEVE_EMPLOYEES,
            variables: {
                queryID: "all",
                pageSize: 10,
                pageNo: 1
            }
        });
        result = true;
        box.changeTestLogs(test, JSON.stringify(res.data));
        box.changeTestResult(test, "pass", screen);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", screen);
    }
    box.changeTestStatus(test, "completed", screen);
    box.changeTestElapsed(test, process.hrtime(start), screen);
    return result;
}

async function createEmployee(client:ApolloClient<any>, box:Box, test:TestID, screen:any) :Promise<{employee:any, success:boolean}> {
    box.changeTestStatus(test, "running", screen);
    let start = process.hrtime();
    let res = {employee: {}, success:false};
    try {
        let response = await client.mutate({
            mutation: CREATE_EMPLOYEE,
            variables: {
                employee: {
                    avatar:avatar.default,
                    fullname: "John Thomson",
                    contact_email: "john.thomson@gmail.com",
                    contact_mobile: "+61450123012",
                    address_city: "Milton",
                    address_country: "Australia",
                    emergency_contact_fullname: "Harry Miller",
                    emergency_contact_mobile: "+61460120123",
                    emergency_contact_relationship: "Friend",
                    employee_title: "CEO",
                    supervisor_uid: 1,
                    hired_date: "2021-07-02T20:11:23.061577Z",
                    savannaah_user: false,
                    username: "johnthomson",
                    timezone: "Australia/Brisbane",
                    role_uid: 2,
                    warehouses_uid: [1]
                }
            }
        });
        res.employee = response.data.createEmployeeMutation;
        res.success = true;
        box.changeTestLogs(test, JSON.stringify(response.data));
        box.changeTestResult(test, "pass", screen);
    } catch (error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", screen);
    }
    box.changeTestStatus(test, "completed", screen);
    box.changeTestElapsed(test, process.hrtime(start), screen);
    return res;
}

async function retrieveEmployee(client:ApolloClient<any>, employee: any, box:Box, test:TestID, screen:any) :Promise<{employee:any, success:boolean}> {
    box.changeTestStatus(test, "running", screen);
    let start = process.hrtime();
    let res = {employee:{}, success:false};
    try {
        let response = await client.query({
            query: RETRIEVE_EMPLOYEE,
            variables: {
                uid: employee.uid
            }
        });
        res.employee = response.data.employee;
        res.success = true;
        box.changeTestLogs(test, JSON.stringify(response.data));
        box.changeTestResult(test, "pass", screen);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", screen);
    }
    box.changeTestStatus(test, "completed", screen);
    box.changeTestElapsed(test, process.hrtime(start), screen);
    return res;
}

async function updateEmployee(client:ApolloClient<any>, employee: any, box:Box, test:TestID, sc:any) :Promise<{employee: any, success: boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {employee: {}, success:false};
    try {
        let response = await client.mutate({
            mutation: UPDATE_EMPLOYEE,
            variables: {
                original: {
                    uid: employee.uid,
                    avatar: employee.avatar,
                    fullname: employee.fullname,
                    contact_email: employee.contact_email,
                    contact_mobile: employee.contact_mobile,
                    address_city: employee.address_city,
                    address_country: employee.address_country,
                    emergency_contact_fullname: employee.emergency_contact_fullname,
                    emergency_contact_mobile: employee.emergency_contact_mobile,
                    emergency_contact_relationship: employee.emergency_contact_relationship,
                    employee_title: employee.employee_title,
                    supervisor_uid: employee.supervisor.uid,
                    hired_date: employee.hired_date,
                    savannaah_user: employee.savannaah_user,
                    username: employee.username,
                    timezone: employee.timezone,
                    role_uid: employee.role.uid,
                    created_date: employee.created_date,
                    created_by_uid: employee.created_by.uid,
                    last_modified_date: employee.last_modified_date,
                    last_modified_by_uid: employee.last_modified_by.uid,
                    last_login_date: employee.last_login_date,
                    record_state: employee.record_state,
                    warehouses_uid: employee.warehouses.map((warehouse: any) => warehouse.uid)
                },
                modified: {
                    uid: employee.uid,
                    avatar: employee.avatar,
                    fullname: employee.fullname,
                    contact_email: employee.contact_email,
                    contact_mobile: employee.contact_mobile,
                    address_city: employee.address_city,
                    address_country: employee.address_country,
                    emergency_contact_fullname: employee.emergency_contact_fullname,
                    emergency_contact_mobile: employee.emergency_contact_mobile,
                    emergency_contact_relationship: employee.emergency_contact_relationship,
                    employee_title: employee.employee_title,
                    supervisor_uid: employee.supervisor.uid,
                    hired_date: employee.hired_date,
                    savannaah_user: true,
                    username: "thomsonjohn",
                    password: "thomsonjohn",
                    timezone: employee.timezone,
                    role_uid: employee.role.uid,
                    created_date: employee.created_date,
                    created_by_uid: employee.created_by.uid,
                    last_modified_date: employee.last_modified_date,
                    last_modified_by_uid: employee.last_modified_by.uid,
                    last_login_date: employee.last_login_date,
                    record_state: employee.record_state,
                    warehouses_uid: employee.warehouses.map((warehouse: any) => warehouse.uid)
                }
            }
        });
        res.employee = response.data.updateEmployeeMutation;
        res.success = true;
        box.changeTestLogs(test, JSON.stringify(response.data));
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function actionEmployee(client:ApolloClient<any>, employee: any, box:Box, test:TestID, action:"VOID"|"RESTORE", sc:any) :Promise<{employee: any, success: boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {employee:{}, success:false};
    try {
        let response = await client.mutate({
            mutation: ACTION_EMPLOYEE,
            variables: {
                employee: {
                    uid: employee.uid,
                    avatar: employee.avatar,
                    fullname: employee.fullname,
                    contact_email: employee.contact_email,
                    contact_mobile: employee.contact_mobile,
                    address_city: employee.address_city,
                    address_country: employee.address_country,
                    emergency_contact_fullname: employee.emergency_contact_fullname,
                    emergency_contact_mobile: employee.emergency_contact_mobile,
                    emergency_contact_relationship: employee.emergency_contact_relationship,
                    employee_title: employee.employee_title,
                    supervisor_uid: employee.supervisor.uid,
                    hired_date: employee.hired_date,
                    savannaah_user: employee.savannaah_user,
                    username: employee.username,
                    timezone: employee.timezone,
                    role_uid: employee.role.uid,
                    created_date: employee.created_date,
                    created_by_uid: employee.created_by.uid,
                    last_modified_date: employee.last_modified_date,
                    last_modified_by_uid: employee.last_modified_by.uid,
                    last_login_date: employee.last_login_date,
                    record_state: employee.record_state,
                    warehouses_uid: employee.warehouses.map((warehouse: any) => warehouse.uid)
                },
                action: action
            }
        });
        res.employee = response.data.actionEmployeeMutation;
        res.success = true;
        box.changeTestLogs(test, JSON.stringify(response.data));
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function deleteEmployee(client:ApolloClient<any>, employee:any, box:Box, test:TestID, sc:any) :Promise<{employee:any, success:boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {employee:{}, success:false};
    try {
        let response = await client.mutate({
            mutation: DELETE_EMPLOYEE,
            variables: {
                uid: employee.uid
            }
        });
        res.employee = response.data.deleteEmployeeMutation;
        res.success = true;
        box.changeTestLogs(test, JSON.stringify(response.data));
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

module.exports = {
    "setup" : setup,
    "retrieveList" : retrieveEmployees,
    "create" : createEmployee,
    "retrieve": retrieveEmployee,
    "update" : updateEmployee,
    "action" : actionEmployee,
    "delete" : deleteEmployee,
}
