import { Collections } from '../src/libs/utils'
// @ts-ignore
import mongooseSmartQuery from 'mongoose-smart-query'
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose'

export interface EmailI {
  email: string
}

export interface BouncedEmailI extends EmailI {
  reason?: string // only for BouncedEmails
}

@Schema({
  versionKey: false,
  collection: Collections.BOUNCED_EMAILS,
})
export class BouncedEmailsSchema implements BouncedEmailI {
  @Prop({
    index: true,
    type: String ,
    unique: true,
    required: true,
  })
    email: string
  @Prop({ type: String })
    reason: string
}

export const BouncedEmailsFactorySchema =
  SchemaFactory.createForClass(BouncedEmailsSchema)

BouncedEmailsFactorySchema.plugin(mongooseSmartQuery, {
  defaultFields: 'email',
  defaultSort: '-_id',
  fieldsForDefaultQuery: 'email',
})