export class ErrorResponse extends Error {
  public statusCode!: number;
  constructor(message: string, statusCode: string | number) {
    super(message);
    this.statusCode = statusCode as number;
  }
}
