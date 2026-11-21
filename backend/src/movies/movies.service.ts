import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { QueryMoviesDto } from './dto/query-movies.dto';
import { Movie, MovieDocument } from './movie.schema';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  create(dto: CreateMovieDto) {
    return this.movieModel.create(dto);
  }

  async findAll(query: QueryMoviesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: Record<string, unknown> = {};
    if (query.q) {
      filter.title = { $regex: escapeRegex(query.q), $options: 'i' };
    }
    if (query.genre) {
      filter.genres = query.genre;
    }

    const [items, total] = await Promise.all([
      this.movieModel
        .find(filter)
        .sort({ year: -1, title: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments(filter),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Movie not found');
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Movie not found');
    const deleted = await this.movieModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Movie not found');
    return { deleted: true };
  }
}