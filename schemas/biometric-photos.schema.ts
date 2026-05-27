import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Collections } from '../src/libs/utils'
import { Types } from 'mongoose'
import { ObjectId } from '../src/config'

@Schema({ versionKey: false, timestamps: true })
export class BiometricPhotoSchema {
  @Prop({ type: ObjectId, ref: Collections.USES_SERVICES, required: true })
  usesService: Types.ObjectId

  @Prop({ required: true })
  s3Key: string

  @Prop({ required: true })
  type: string

  @Prop({ required: false })
  contentType?: string
}

export const BiometricPhotoFactorySchema = SchemaFactory.createForClass(BiometricPhotoSchema)

BiometricPhotoFactorySchema.index({ usesService: 1 })
BiometricPhotoFactorySchema.index({ usesService: 1, type: 1 })
