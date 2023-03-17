export default class StatusCodeError implements Error {
    readonly name: string = 'StatusCodeError'
    message : string
    statusCode : number

    constructor(message : string, statusCode : number) {
        this.message = message,
        this.statusCode = statusCode
    }
}