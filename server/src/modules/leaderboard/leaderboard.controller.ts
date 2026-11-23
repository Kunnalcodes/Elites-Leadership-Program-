import { Request, Response, NextFunction } from 'express';
import { leaderboardService } from './leaderboard.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class LeaderboardController {
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { scope, levelId } = req.query;
      const standings = await leaderboardService.getLiveLeaderboard(
        scope as string,
        levelId as string
      );
      const meta = await leaderboardService.getChampionshipMetadata();
      return sendSuccess(res, standings, 'Leaderboard standings retrieved', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getChampionshipMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = await leaderboardService.getChampionshipMetadata();
      return sendSuccess(res, meta, 'Championship metadata retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getTopThree(req: Request, res: Response, next: NextFunction) {
    try {
      const { scope, levelId } = req.query;
      const topThree = await leaderboardService.getTopThree(
        scope as string,
        levelId as string
      );
      return sendSuccess(res, topThree, 'Top three showcase retrieved');
    } catch (error) {
      next(error);
    }
  }

  async publishSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const { scope, levelId, title } = req.body;
      const result = await leaderboardService.publishSnapshot(scope, levelId, title, req.user);
      return sendSuccess(res, result, 'Official leaderboard snapshot published and broadcasted');
    } catch (error) {
      next(error);
    }
  }

  async recalculate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leaderboardService.recalculateStandings();
      return sendSuccess(res, result, 'Leaderboard recalculation completed');
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await leaderboardService.getHistory();
      return sendSuccess(res, history, 'Leaderboard snapshot history retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
