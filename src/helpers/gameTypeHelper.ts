import { AI_PLAY_MODE } from "../constants/playModes";
import { IUser } from "../store/user/user.interfaces";
import { GameType } from "../interfaces/game.interfaces";
import { IGameItem } from "../store/games/games.interfaces";

export const getGameTypeElo = (gameType: GameType, user: IUser) => {
  switch (gameType) {
    case GameType.Bullet:
      return user.BulletElo;
    case GameType.Rapid:
      return user.RapidElo;
    case GameType.Blitz:
      return user.BlitzElo;
    case GameType.Classical:
      return user.ClassicalElo;
    default:
      return null;
  }
};

export const getGameType = (time: number) => {
  if (time <= 2) return GameType.Bullet;
  else if (time > 2 && time <= 5) return GameType.Blitz;
  else if (time > 5 && time <= 10) return GameType.Rapid;
  else return GameType.Classical;
};

export const getGameTypeNameByType = (gameType: GameType) => {
  switch (gameType) {
    case GameType.Bullet:
      return "Bullet";
    case GameType.Rapid:
      return "Rapid";
    case GameType.Blitz:
      return "Blitz";
    case GameType.Classical:
      return "Classical";
    default:
      return null;
  }
};

export const getGameTypeName = (time: number) => {
  const gameType = getGameType(time);

  switch (gameType) {
    case GameType.Bullet:
      return "Bullet";
    case GameType.Rapid:
      return "Rapid";
    case GameType.Blitz:
      return "Blitz";
    case GameType.Classical:
      return "Classical";
    default:
      return null;
  }
};

export const canPlayGame = (gameItem: IGameItem, currentUser: IUser) => {
  const hostRating = getGameTypeElo(gameItem.gameRules.type, gameItem.host);
  const currentUserElo = getGameTypeElo(gameItem.gameRules.type, currentUser);
  return Math.abs(currentUserElo - hostRating) <= 200;
};
