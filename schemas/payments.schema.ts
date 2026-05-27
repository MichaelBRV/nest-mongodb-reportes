import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { StatusPaymentEnum, StatusWebhookEnum, UsesServicesTypeDeUnaEnum } from '../src/libs/enums'
import { Collections } from '../src/libs/utils'

@Schema({ _id: false, versionKey: false })
export class WebhookPayment {
  @Prop({ type: String, required: true })
  url: string

  @Prop({ type: String, required: true })
  token: string

  @Prop({ type: Number, default: 0 })
  retries: number

  @Prop({
    type: String,
    enum: StatusWebhookEnum,
    default: StatusWebhookEnum.PENDING
  })
  status: StatusWebhookEnum
}

export const WebhookPaymentSchema = SchemaFactory.createForClass(WebhookPayment)

@Schema({ _id: false, versionKey: false })
export class UsesServicesPayment {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Collections.USES_SERVICES
  })
  id: Types.ObjectId

  @Prop({
    enum: UsesServicesTypeDeUnaEnum,
    default: UsesServicesTypeDeUnaEnum.CREATE
  })
  type: UsesServicesTypeDeUnaEnum
}

export const UsesServicesPaymentSchema =
  SchemaFactory.createForClass(UsesServicesPayment)

@Schema({ versionKey: false })
export class Payments {
  @Prop({ enum: StatusPaymentEnum, default: StatusPaymentEnum.PENDING })
  status: StatusPaymentEnum

  @Prop({ required: false, type: String })
  pointOfSale: string

  @Prop({ required: false, type: String })
  description: string

  @Prop({ type: Number, required: false, default: 0 })
  amountExpected: number

  @Prop({ type: Number, required: false, default: 0 })
  amount: number

  @Prop({ enum: ['dynamic', 'static'], required: false, default: 'dynamic' })
  qrType: 'dynamic' | 'static'

  @Prop({ type: String, required: false })
  idTransaction: string

  @Prop({ type: String, required: true, unique: true, index: true })
  internalTransactionReference: string

  @Prop({ type: String, required: false })
  transferNumber: string

  @Prop({ type: String, required: false })
  deepLink: string

  @Prop({ type: String, required: false })
  format: string

  @Prop({ type: String, required: false })
  branchId: string

  @Prop({ type: String, required: false })
  posId: string

  @Prop({ type: String, required: false })
  currency: string

  @Prop({ type: String, required: false })
  customerIdentification: string

  @Prop({ type: String, required: false })
  customerFullName: string

  @Prop({ type: Number, required: false })
  numericCode: number

  @Prop({ type: WebhookPaymentSchema, required: false })
  webhook: WebhookPayment

  @Prop({ type: String, required: false })
  paymentDate: string

  @Prop({ type: Number, required: false })
  expiredTime: number

  @Prop({ type: Types.ObjectId, required: false, ref: Collections.SERVICES })
  service: Types.ObjectId

  @Prop({
    type: [UsesServicesPaymentSchema],
    required: false
  })
  usesServices: UsesServicesPayment[]

  @Prop({ default: Date.now })
  _date: Date
}

export const PaymentsSchema = SchemaFactory.createForClass(Payments)
export type PaymentsDocument = HydratedDocument<Payments>

PaymentsSchema.index(
  { idTransaction: 1 },
  { partialFilterExpression: { idTransaction: { $exists: true } } }
)
