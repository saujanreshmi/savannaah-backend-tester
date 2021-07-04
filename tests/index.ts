import {Box} from "../ui";
import axios from "axios";
import {ApolloClient} from "@apollo/client/core";

const url = require("../url.json");
const session = require("./session");
const warehouse = require("./warehouse");
const employee = require("./employee");

export async function setupTests(boxes: Box[], sc: any): Promise<{ token: string, error: boolean }> {
    try {
        let res = await axios.post(
            url.session + "?action=create",
            {},
            {
                headers: {
                    savauth: "YWRtaW46QWRyaWFuYTAxMQ==",
                    application: "session",
                    subdomain: "dev"
                }
            });
        boxes.forEach((box) => {
            box.refreshTitle(sc);
            box.tests.forEach((test) => {
                box.refreshTestLine(sc, test.id);
            });
        });
        return {token: res.data.token, error: false}
    } catch (error) {
        return {token: "", error: true}
    }
}

export function runTests(token: string, boxes: Box[], sc: any): void {
    //testing session
    session.create(boxes[0], boxes[0].tests[0].id, sc).then((res:{success: boolean, token:string}) => {
        if (res.success) {
            session.update(res.token,boxes[0], boxes[0].tests[1].id, sc).then((success0:boolean) => {
                if (success0) {
                    session.retrieve(res.token,boxes[0], boxes[0].tests[2].id, sc).then((success1:boolean) => {
                        if (success1) {
                            session.destroy(res.token, boxes[0], boxes[0].tests[3].id, sc).then((success2:boolean) => {
                                boxes[0].changeStatus("completed", sc);
                            });
                        }
                    });
                }
            });
        }
    });
    //testing warehouse
    warehouse.setup(token).then((client: ApolloClient<any>) => {
        warehouse.retrieveList(client, boxes[1], boxes[1].tests[0].id, sc).then((success:boolean) => {
            if (success) {
                warehouse.create(client, boxes[1], boxes[1].tests[1].id, sc).then((res0:{success:boolean, warehouse:any}) => {
                    if (res0.success) {
                        warehouse.retrieve(client, res0.warehouse, boxes[1], boxes[1].tests[2].id, sc).then((res1:{success:boolean, warehouse:any}) => {
                            if (res1.success) {
                                warehouse.update(client, res0.warehouse, boxes[1], boxes[1].tests[3].id, sc).then((res2:{success:boolean, warehouse:any}) => {
                                    if (res2.success) {
                                        warehouse.action(client, res2.warehouse, boxes[1], boxes[1].tests[4].id, sc).then((res3:{success:boolean, warehouse:any}) => {
                                           if (res3.success) {
                                               warehouse.delete(client, res3.warehouse, boxes[1], boxes[1].tests[5].id, sc).then((res4:{success:boolean, warehouse:any}) => {
                                                   boxes[1].changeStatus("completed", sc);
                                               })
                                           }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    //testing employee
    employee.setup(token).then((client: ApolloClient<any>) => {
        employee.retrieveList(client, boxes[2], boxes[2].tests[0].id, sc).then((success:boolean) => {
            if (success) {
                employee.create(client, boxes[2], boxes[2].tests[1].id, sc).then((res0:{employee:any, success:boolean}) => {
                    if (res0.success) {
                        employee.retrieve(client, res0.employee, boxes[2], boxes[2].tests[2].id, sc).then((res1:{employee:any, success:boolean}) => {
                           if (res1.success) {
                               employee.update(client, res0.employee, boxes[2], boxes[2].tests[3].id, sc).then((res2:{employee:any, success:boolean}) => {
                                  if (res2.success) {
                                      employee.action(client, res2.employee, boxes[2], boxes[2].tests[4].id, "VOID", sc).then((res3:{employee:any, success:boolean}) => {
                                          if (res3.success) {
                                              employee.action(client, res3.employee, boxes[2], boxes[2].tests[4].id, "RESTORE", sc).then((res4:{employee:any, success:boolean}) => {
                                                  if (res4.success) {
                                                      employee.action(client, res4.employee, boxes[2], boxes[2].tests[4].id, "VOID", sc).then((res5:{employee:any, success:boolean}) => {
                                                          if (res5.success) {
                                                              employee.delete(client, res5.employee, boxes[2], boxes[2].tests[5].id, sc).then((res6:{employee:any, success:boolean}) => {
                                                                  boxes[2].changeStatus("completed", sc);
                                                              })
                                                          }
                                                      });
                                                  }
                                              });
                                          }
                                      });
                                  }
                               });
                           }
                        });
                    }
                });
            }
        });
    });
}
