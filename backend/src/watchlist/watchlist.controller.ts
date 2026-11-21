import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WatchlistService } from './watchlist.service';

type AuthedRequest = { user: { userId: string } };

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private watchlist: WatchlistService) {}

  @Get()
  list(@Req() req: AuthedRequest) {
    return this.watchlist.list(req.user.userId);
  }

  @Post(':movieId')
  add(@Req() req: AuthedRequest, @Param('movieId') movieId: string) {
    return this.watchlist.add(req.user.userId, movieId);
  }

  @Delete(':movieId')
  remove(@Req() req: AuthedRequest, @Param('movieId') movieId: string) {
    return this.watchlist.remove(req.user.userId, movieId);
  }
}