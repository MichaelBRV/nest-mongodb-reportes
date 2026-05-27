import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Collections } from '../src/libs/utils'
// @ts-ignore
import mongooseSmartQuery from 'mongoose-smart-query'
import { TokenAction } from '../src/libs/enums'

@Schema({ _id: false })
export class CurrentSwitch {
  @Prop({ type: Date })
    currentDate: Date

  @Prop({ type: Types.ObjectId, ref: Collections.EXECUTIVES })
    executive: Types.ObjectId
}

export const CurrentSwitchSchema = SchemaFactory.createForClass(CurrentSwitch)
@Schema({ _id: false })
export class TokenHistory {
  @Prop({ type: String, enum: TokenAction.getEnum(), required: true })
    action: string

  @Prop({ type: Date, required: true })
    date: Date

  @Prop({ type: Types.ObjectId, ref: Collections.EXECUTIVES, required: true })
    executive?: Types.ObjectId
}

export const TokenHistorySchema = SchemaFactory.createForClass(TokenHistory)

@Schema({ versionKey: false, timestamps: true })
export class ServiceToken extends Document {
  @Prop({ type: Types.ObjectId, ref: Collections.SERVICES, required: true })
    service: Types.ObjectId

  @Prop({ type: String, required: true })
    token: string

  @Prop({ type: Boolean, default: true })
    active: boolean

  @Prop({ type: Date, default: Date.now })
    createdAt: Date

  @Prop({ type: CurrentSwitchSchema, default: null, required: false })
    deactivatedAt?: CurrentSwitch

  @Prop({ type: CurrentSwitchSchema, default: null, required: false })
    activatedAt?: CurrentSwitch

  @Prop({ type: [TokenHistorySchema], default: [] })
    history?: TokenHistory[]
}

export const ServiceTokenSchema = SchemaFactory.createForClass(ServiceToken)
ServiceTokenSchema.plugin(mongooseSmartQuery, {
  defaultFields: '_id service token active deactivatedAt executive activatedAt',
  defaultSort: '-_id active deactivatedAt',
  fieldsForDefaultQuery:
    '_id service.name service.alias token active createdAt executive.names deactivatedAt updatedAt',
})