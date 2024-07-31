export class VMSyntaxError extends Error {

    name = "VMSyntaxError";

    constructor(message: string) {
        super(message);
    }
}