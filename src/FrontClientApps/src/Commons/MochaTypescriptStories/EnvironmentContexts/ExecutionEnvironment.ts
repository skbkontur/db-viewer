export enum ExecutionEnvironment {
    TestRunner,
    Browser,
}

export function getExecutionEnvironment(): ExecutionEnvironment {
    return global["__TEST__"] ? ExecutionEnvironment.TestRunner : ExecutionEnvironment.Browser;
}
