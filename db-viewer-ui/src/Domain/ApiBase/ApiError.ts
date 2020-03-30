export interface ApiErrorInfo {
    readonly message: string;
    readonly statusCode: number;
    readonly serverStackTrace: null | undefined | string;
    readonly serverErrorType: null | undefined | string;
    readonly innerErrors: null | undefined | any[];
}

export class ApiError extends Error implements ApiErrorInfo {
    public statusCode: number;
    public serverStackTrace: null | undefined | string;
    public serverErrorType: null | undefined | string;
    public innerErrors: null | undefined | any[];
    public responseAsText: string;

    public constructor(
        responseAsText: string,
        message: string,
        statusCode: number,
        type?: null | undefined | string,
        stackTrace?: null | undefined | string,
        innerErrors?: null | undefined | any[]
    ) {
        super(message);
        this.responseAsText = responseAsText;
        this.statusCode = statusCode;
        this.serverStackTrace = stackTrace;
        this.serverErrorType = type;
        this.innerErrors = innerErrors;
    }
}
