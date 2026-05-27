import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Collections } from '../src/libs/utils'
import { Types } from 'mongoose'
import { ObjectId } from '../src/config'
import { CategoriesServices, ProvidersRC } from '../src/libs/enums'

@Schema({ versionKey: false, _id: false })
export class TypeSchema {
  @Prop({ required: true })
    type: string
}
const TypeSchemaFactory = SchemaFactory.createForClass(TypeSchema)

@Schema({ versionKey: false, _id: false })
export class ConfigDeUna {
  @Prop({ required: false })
    apiSecret: string
  @Prop({ required: false })
    apiKey: string
  @Prop({ required: false, type: [String] })
    pointsOfSales: Array<string>

  @Prop({ required: false, default: null })
    urlWebhook: string

  @Prop({ required: false, default: null })
    tokenWebhook: string
}
const ConfigDeUnaSchema = SchemaFactory.createForClass(ConfigDeUna)

@Schema({ versionKey: false })
export class ServicesSchema {
  @Prop({ required: true })
    name: string

  @Prop({ required: true })
    alias: string

  @Prop({ required: false })
    description: string

  @Prop({ required: false })
    id: number

  @Prop({ default: Date.now })
    _date: Date

  @Prop({ required: false })
    token: string

  @Prop({ type: String, required: false, enum: ProvidersRC.getEnum(), default: 'anf' })
    rcConsumer: string

  @Prop({ required: false, default: 0 })
    limitUses: number

  @Prop({ required: false, default: 0 })
    usesTotal: number

  @Prop({ default: 1 })
    activeToken: number

  @Prop({ type:[] , required: false })
    type: [ TypeSchema ]

  @Prop({ type: Number, required: false, default: 0 })
    failedAttempts: number

  @Prop({ type: Date, required: false, default: null })
    blockedUpTto: Date

  @Prop({ type:ObjectId, required: false, ref: Collections.PROJECTS } )
    project: Types.ObjectId

  @Prop({ type: String, required: false, enum: CategoriesServices.getEnum() })
    category: string

  @Prop({ type: Number, required: false, default: 99 })
    attemptsDefault: number

  @Prop({ type: String, required: false })
    whatsappSession: string

  @Prop({ type: Types.ObjectId, ref: Collections.SERVICETOKENS, required: false })
    activeTokenRef: Types.ObjectId

  @Prop({
    type: [
      {
        idNumber: { type: String, required: true },
        failedAttempts: { type: Number, default: 0 },
        blockedUntil: { type: Date, default: null }
      }
    ],
    required: false,
    default: []
  })
    blockedCedulas: Array<{
    idNumber: string
    failedAttempts: number
    blockedUntil?: Date | null
  }>

  @Prop({ type: ConfigDeUnaSchema, required: false })
    configDeUna: ConfigDeUna
}

export const ServiceSchemaFactory = SchemaFactory.createForClass(ServicesSchema)

