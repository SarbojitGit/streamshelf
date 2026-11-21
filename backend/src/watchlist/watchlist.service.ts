import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Movie, MovieDocument } from '../movies/movie.schema';
import {
  WatchlistItem,
  WatchlistItemDocument,
} from './watchlist-item.schema';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(WatchlistItem.name)
    private items: Model<WatchlistItemDocument>,
    @InjectModel(Movie.name) private movies: Model<MovieDocument>,
  ) {}

      async list(userId: string) {
    const rows = await this.items
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    const ids = rows.map((r) => r.movie);
    const found = await this.movies.find({ _id: { $in: ids } }).exec();
    const byId = new Map(found.map((m) => [m.id, m]));

    return ids.flatMap((id) => {
      const movie = byId.get(id.toString());
      return movie ? [movie] : [];
    });
  }

  async add(userId: string, movieId: string) {
    if (!isValidObjectId(movieId) || !(await this.movies.exists({ _id: movieId }))) {
      throw new NotFoundException('Movie not found');
    }
    try {
      await this.items.create({
        user: new Types.ObjectId(userId),
        movie: new Types.ObjectId(movieId),
      });
    } catch (e) {
      if ((e as { code?: number }).code === 11000) {
        throw new ConflictException('Already in watchlist');
      }
      throw e;
    }
    return { added: true };
  }

  async remove(userId: string, movieId: string) {
    if (!isValidObjectId(movieId)) {
      throw new NotFoundException('Not in watchlist');
    }
    const res = await this.items.deleteOne({ user: userId, movie: movieId });
    if (res.deletedCount === 0) {
      throw new NotFoundException('Not in watchlist');
    }
    return { removed: true };
  }
}