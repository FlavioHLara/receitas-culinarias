export class AppError extends Error {
    public readonly statusCode: number;

    constructor(mensagem: string, statusCode = 400) {
        super(mensagem);
        this.statusCode = statusCode;
    }
}
