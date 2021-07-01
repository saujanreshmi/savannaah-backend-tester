export type Status = "pending"|"running"|"completed";

export type ElapsedTime = [number, number];

export type Result = "pass"|"fail";

export type TestID = "Test01"|"Test02"|"Test03"|"Test04"|"Test05"|"Test06";

export interface TestBoxDataBody {
    id: TestID
    Name: string
    Status: Status
    Result?: Result
    ElapsedTime?: ElapsedTime
}

export interface TestBoxDataTitle {
    Status: Status
}

export interface TestBoxData {
    Title: TestBoxDataTitle
    Tests: TestBoxDataBody[]
}

