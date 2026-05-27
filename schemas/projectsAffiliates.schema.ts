import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import exp from 'constants'
import { Collection, Types } from 'mongoose'
// @ts-ignore
import mongooseSmartQuery from 'mongoose-smart-query'
import { Collections } from '../src/libs/utils'


@Schema({ timestamps: true })
export class ProjectAffiliate {
  @Prop({ required: true })
    names: string

  @Prop({ required: true })
    attemptsRc: number

  @Prop({ type: Boolean, default: true })
    enabled: boolean

  @Prop({ required: true, type: Types.ObjectId, ref: Collections.SERVICES })
    service: Types.ObjectId
}

export const ProjectAffiliateSchema = SchemaFactory.createForClass(ProjectAffiliate)
ProjectAffiliateSchema.plugin(mongooseSmartQuery,{
  defaultFields: '_id names service attemptsRc enabled',
  defaultSort: '-_id',
  fieldsForDefaultQuery: '_id names service enabled',
})