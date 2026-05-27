import { Prop, Schema } from '@nestjs/mongoose'
import { StatusRC } from '../src/libs/enums'
import { Collections, isDev } from '../src/libs/utils'
import { Types } from 'mongoose'
import { ObjectId } from '../src/config'


@Schema({ versionKey: false, _id: false })
class Observation {
  @Prop({ required: false, default: Date.now })
    date: Date
  @Prop({ required: false, default: '' })
    description: string
  @Prop({ required: false, default: {}, type: Object })
    response: any
}

@Schema({ versionKey: false, _id: false })
class UserUse {
  @Prop({ required: false })
    idEmitter: string
  @Prop({ required: false })
    id: string
  @Prop({ required: false })
    names?: string
  @Prop({ required: false })
    cedula?: string
  @Prop({ required: false })
    dac?: string
  @Prop({ required: false })
    email?: string
  @Prop({ required: false })
    environment?: string
  @Prop({ required: false })
    project?: string
  @Prop({ required: false })
    businessName?: string
  @Prop({ required: false })
    cellphone?: string
  @Prop({ required: false })
    consumer?: string
}

@Schema({ versionKey: false , _id: false })
class ResponseFallback {
  @Prop({ required: false })
    idExternal?: string

  @Prop({ required: false, default: false })
    dobleConsumer?: boolean

  @Prop({ required: false, type: String })
    reason?: string
}

@Schema({ versionKey: false })
export class UsesServicesSchema {
  @Prop({ enum: StatusRC.getEnum(), default: 1 })
    status: number

  @Prop({ default: Date.now })
    _date: Date

  @Prop({ required: false, type: Observation })
    observation : Observation

  @Prop({ default: isDev })
    dev: boolean

  @Prop({ type: ObjectId, ref: Collections.PROJECTS })
    project: Types.ObjectId

  @Prop({ type: ObjectId,  ref: Collections.SERVICES, required: true })
    service: Types.ObjectId

  @Prop({ type: ObjectId, ref: Collections.WAHASESSIONS, required: false })
    whatsappSession?: Types.ObjectId

  @Prop({ required: false, type: UserUse })
    userUse?: UserUse

  @Prop({ required: false })
    type?: string

  @Prop({ required: false, type: ResponseFallback })
    fallback?: ResponseFallback

  @Prop({
    required: false,
    type: [{ type: { type: String, required: true }, photoId: { type: ObjectId, ref: 'biometric_photos', required: true } }],
    default: [],
    _id: false
  })
    storedPhotos?: { type: string; photoId: Types.ObjectId }[]
}


