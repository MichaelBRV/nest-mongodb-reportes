export class StatusRC {
  static getEnum() { return [1, 2, 3]; }
}
export class CategoriesServices {
  static getEnum() { return ['category1', 'category2', 'CIVIL', 'FINANZAS']; }
}
export class ProvidersRC {
  static getEnum() { return ['anf', 'provider2', 'deuna', 'banco', 'buro']; }
}
export class TokenAction {
  static getEnum() { return ['create', 'revoke']; }
}
export enum StatusPaymentEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
export enum StatusWebhookEnum {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}
export enum UsesServicesTypeDeUnaEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE'
}
