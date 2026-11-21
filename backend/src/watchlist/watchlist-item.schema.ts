import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WatchlistItemDocument = HydratedDocument<WatchlistItem>;

@Schema({ timestamps: true })
export class WatchlistItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Movie', required: true })
  movie: Types.ObjectId;
}

export const WatchlistItemSchema = SchemaFactory.createForClass(WatchlistItem);

// A user can add a given movie only once
WatchlistItemSchema.index({ user: 1, movie: 1 }, { unique: true });