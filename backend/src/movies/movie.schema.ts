import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  director: string;

  @Prop({ required: true })
  year: number;

  @Prop({ type: [String], default: [] })
  genres: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ title: 1 });
MovieSchema.index({ genres: 1 });