import {ApolloClient, gql, HttpLink, InMemoryCache} from "@apollo/client/core";
import fetch from "cross-fetch";
import {Box} from "../ui";
import {TestID} from "../utility";

const url = require("../url.json");

const RETRIEVE_WAREHOUSES = gql`
    query GetWarehouses($queryID: String!, $pageSize: Int!, $pageNo: Int!){
        warehouses(queryID: $queryID, pageSize: $pageSize, pageNo: $pageNo){
            uid,
            id,
            name,
            description,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            created_date,
            created_by_uid,
            last_modified_date,
            last_modified_by_uid,
            record_state            
        }
    }
`;

const CREATE_WAREHOUSE = gql`
    mutation CreateWarehouseMutation($warehouse: CreateWarehouse!){
        createWarehouseMutation(warehouse: $warehouse){
            uid,
            id,
            name,
            description,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            record_state,
            created_by {
                uid,
            },
            created_date,
            last_modified_by {
                uid
            },
            last_modified_date
        }
    }
`;

const RETRIEVE_WAREHOUSE = gql`
    query GetWarehouse($uid: Int!){
        warehouse(uid: $uid){
            uid,
            id,
            name,
            description,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            record_state,
            created_by {
                uid,
            },
            created_date,
            last_modified_by {
                uid
            },
            last_modified_date,
            record_state_histories {
                uid,
                warehouse_uid,
                old_record_state,
                new_record_state,
                memo,
                created_date,
                created_by {
                    uid,
                    fullname
                }
            }
        }
    }
`

const UPDATE_WAREHOUSE = gql`
    mutation UpdateWarehouseMutation($original: ArgWarehouse!, $modified: ArgWarehouse!){
        updateWarehouseMutation(original: $original, modified: $modified){
            uid,
            id,
            name,
            description,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            record_state,
            created_by {
                uid,
            },
            created_date,
            last_modified_by {
                uid
            },
            last_modified_date            
        }
    }
`

const ACTION_WAREHOUSE = gql`
    mutation ActionWarehouseMutation($warehouse: ArgWarehouse!, $action: GeneralAction!){
        actionWarehouseMutation(warehouse: $warehouse, action: $action){
            uid,
            id,
            name,
            description,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            record_state,
            created_by {
                uid,
            },
            created_date,
            last_modified_by {
                uid
            },
            last_modified_date                
        }
    }
`

const DELETE_WAREHOUSE = gql`
    mutation DeleteWarehouseMutation($uid: Int!){
        deleteWarehouseMutation(uid: $uid){
            uid,
            id,
            name,
            description,
            address_street,
            address_city,
            address_postcode,
            address_state,
            address_country,
            record_state,
            created_by {
                uid,
            },
            created_date,
            last_modified_by {
                uid
            },
            last_modified_date   
        }
    }    
`

async function setup(token:string) :Promise<ApolloClient<any>> {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: url.graphql,
            fetch,
            headers: {token: token, subdomain: "dev", application: "warehouse"}
        }),
    });
}

async function retrieveWarehouses(client:ApolloClient<any>, box:Box, test:TestID, sc:any) :Promise<boolean> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let result = false;
    try {
        let res = await client.query({
            query: RETRIEVE_WAREHOUSES,
            variables: {
                queryID: "all",
                pageSize: 10,
                pageNo: 1
            }
        });
        result = true;
        box.changeTestLogs(test, JSON.stringify(res.data));
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError));
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return result;
}

async function createWarehouse(client:ApolloClient<any>, box:Box, test: TestID, sc:any) :Promise<{warehouse:any, success: boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {warehouse: {}, success:false};
    try {
        let response = await client.mutate({
            mutation: CREATE_WAREHOUSE,
            variables: {
                warehouse: {
                    id: "999",
                    name: "Bogota Branch Office",
                    address_city: "Bogota",
                    address_country: "Colombia"
                }
            }
        });
        box.changeTestLogs(test, JSON.stringify(response.data));
        res.warehouse = response.data.createWarehouseMutation;
        res.success = true;
        box.changeTestResult(test, "pass", sc);
    } catch (error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError))
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function retrieveWarehouse(client:ApolloClient<any>, warehouse: any, box:Box, test: TestID, sc: any) :Promise<{warehouse:any, success:boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {warehouse:{}, success:false};
    try {
        let response = await client.query({
            query: RETRIEVE_WAREHOUSE,
            variables: {
                uid: warehouse.uid
            }
        });
        box.changeTestLogs(test, JSON.stringify(response.data));
        res.warehouse = response.data.warehouse;
        res.success = true;
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError))
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function updateWarehouse(client:ApolloClient<any>, warehouse: any, box:Box, test:TestID, sc:any) :Promise<{warehouse: any, success: boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {warehouse: {}, success:false};
    try {
        let response = await client.mutate({
            mutation: UPDATE_WAREHOUSE,
            variables: {
                original: {
                    uid: warehouse.uid,
                    id: warehouse.id,
                    name: warehouse.name,
                    address_city: warehouse.address_city,
                    address_country: warehouse.address_country,
                    created_date: warehouse.created_date,
                    created_by_uid: warehouse.created_by.uid,
                    last_modified_date: warehouse.last_modified_date,
                    last_modified_by_uid: warehouse.last_modified_by.uid,
                    record_state: warehouse.record_state,
                },
                modified: {
                    uid: warehouse.uid,
                    id: "998",
                    name: warehouse.name,
                    address_city: warehouse.address_city,
                    address_country: warehouse.address_country,
                    created_date: warehouse.created_date,
                    created_by_uid: warehouse.created_by.uid,
                    last_modified_date: warehouse.last_modified_date,
                    last_modified_by_uid: warehouse.last_modified_by.uid,
                    record_state: warehouse.record_state,
                }
            }
        });
        box.changeTestLogs(test, JSON.stringify(response.data));
        res.warehouse = response.data.updateWarehouseMutation;
        res.success = true;
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError))
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function actionWarehouse(client:ApolloClient<any>, warehouse:any, box:Box, test:TestID, sc:any) :Promise<{warehouse: any, success:boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {warehouse:{}, success:false};
    try {
        let response = await client.mutate({
           mutation: ACTION_WAREHOUSE,
           variables: {
               warehouse: {
                   uid: warehouse.uid,
                   id: warehouse.id,
                   name: warehouse.name,
                   address_city: warehouse.address_city,
                   address_country: warehouse.address_country,
                   created_date: warehouse.created_date,
                   created_by_uid: warehouse.created_by.uid,
                   last_modified_date: warehouse.last_modified_date,
                   last_modified_by_uid: warehouse.last_modified_by.uid,
                   record_state: warehouse.record_state,
               },
               action: "VOID"
           }
        });
        box.changeTestLogs(test, JSON.stringify(response.data));
        res.warehouse = response.data.actionWarehouseMutation;
        res.success = true;
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError))
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

async function deleteWarehouse(client:ApolloClient<any>, warehouse:any, box:Box, test:TestID, sc:any) :Promise<{warehouse:any, success:boolean}> {
    box.changeTestStatus(test, "running", sc);
    let start = process.hrtime();
    let res = {warehouse:{}, success:false};
    try {
        let response = await client.mutate({
            mutation: DELETE_WAREHOUSE,
            variables: {
                uid: warehouse.uid
            }
        });
        box.changeTestLogs(test, JSON.stringify(response.data));
        res.warehouse = response.data.deleteWarehouseMutation;
        res.success = true;
        box.changeTestResult(test, "pass", sc);
    } catch(error) {
        box.changeTestLogs(test, JSON.stringify(error.networkError))
        box.changeTestResult(test, "fail", sc);
    }
    box.changeTestStatus(test, "completed", sc);
    box.changeTestElapsed(test, process.hrtime(start), sc);
    return res;
}

module.exports = {
    "setup" : setup,
    "retrieveList" : retrieveWarehouses,
    "create" : createWarehouse,
    "retrieve": retrieveWarehouse,
    "update" : updateWarehouse,
    "action" : actionWarehouse,
    "delete" : deleteWarehouse,
}
