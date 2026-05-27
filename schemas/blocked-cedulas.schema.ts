import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Collections } from '../src/libs/utils'
// @ts-ignore
import mongooseSmartQuery from 'mongoose-smart-query'

@Schema({ versionKey: false })
export class BlockedCedula extends Document {
  @Prop({ type: String, required: true })
    idNumber: string

  @Prop({ type: Types.ObjectId, ref: Collections.SERVICES, required: true })
    service: Types.ObjectId

  @Prop({ type: Number, default: 0 })
    failedAttempts: number

  @Prop({ type: Boolean, default: false })
    blocked: boolean

  @Prop({ type: String, required: false })
    blockedBy: string

  @Prop({ type: Date, required: false })
    blockedUntil: Date
}

export const BlockedCedulaSchema = SchemaFactory.createForClass(BlockedCedula)
BlockedCedulaSchema.plugin(mongooseSmartQuery, {
  defaultFields: '_id idNumber service blocked blockedBy blockedUntil failedAttempts',
  defaultSort: '-_id',
  fieldsForDefaultQuery: '_id idNumber service.name blocked blockedBy blockedUntil failedAttempts',
})

// TTL automático: al cumplirse `blockedUntil`, Mongo elimina el documento
BlockedCedulaSchema.index({ blockedUntil: 1 }, { expireAfterSeconds: 0 })
