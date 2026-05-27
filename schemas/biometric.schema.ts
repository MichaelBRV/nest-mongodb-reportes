import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false, _id: false })
class TokensTest {
  @Prop({ required: true })
    token: string
}

@Schema({ versionKey: false, _id: false })
class TokensProduction {
  @Prop({ required: true })
    token: string
}

@Schema({ versionKey: false, _id: false })
class Session {
  @Prop({ required: true, default: false })
    locked: boolean

  @Prop({ required: true, default: 0 })
    attempts: number

  @Prop({ required: false, default: null })
    timeToUnlock: Date
}

@Schema({ versionKey: false })
export class BiometricCycle extends Document {
  @Prop({ required: true })
    declare id: string

  @Prop({ required: true })
    usesProduction: number

  @Prop({ required: true })
    usesTest: number

  @Prop({ required: true, default: 0 })
    totalUsesTest: number

  @Prop({ required: true, default: 0 })
    totalUsesProduction: number

  @Prop({ required: true, type: TokensProduction })
    tokensProduction: TokensProduction

  @Prop({ required: true, type: TokensTest })
    tokensTest: TokensTest

  @Prop({ required: true })
    pinProduction: string

  @Prop({ required: false, type: Session, default: {} })
    session: Session
}

export const BiometricCycleFactorySchema = SchemaFactory.createForClass(BiometricCycle)
