export enum BizCodeEnum {
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  DatabaseError = "DatabaseError",
}

export class BizError extends Error {
  code: BizCodeEnum;
  statusCode: number;

  constructor(code: BizCodeEnum, message?: string) {
    super(message ?? code);
    this.code = code;
    this.statusCode =
      code === BizCodeEnum.Unauthorized
        ? 401
        : code === BizCodeEnum.Forbidden
        ? 403
        : 500;
  }
}

export default BizError;


