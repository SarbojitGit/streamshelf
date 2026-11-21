import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../movies/movie.schema';
import {
  WatchlistItem,
  WatchlistItemSchema,
} from './watchlist-item.schema';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WatchlistItem.name, schema: WatchlistItemSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}