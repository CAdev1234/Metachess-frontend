import { AI_PLAY_MODE } from "../constants/playModes";
import { IUser } from "../store/user/user.interfaces";

export const getOpponentName = (
  isAI: boolean,
  playMode: AI_PLAY_MODE,
  opponent: IUser
) => {
  if (isAI) {
    switch (playMode) {
      case AI_PLAY_MODE.BEGINNER:
        return `BEGINNER AI`;
      case AI_PLAY_MODE.ROOKIE:
        return `ROOKIE AI`;

      case AI_PLAY_MODE.AMATEUR:
        return `AMATEUR AI`;
      case AI_PLAY_MODE.INTERMEDIATE:
        return `INTERMEDIATE AI`;

      case AI_PLAY_MODE.PROFESSIONAL:
        return `PROFESSIONAL AI`;

      case AI_PLAY_MODE.WORLD_CLASS:
        return `WORLD CLASS AI`;

      case AI_PLAY_MODE.MASTER:
        return `MASTER AI`;
      case AI_PLAY_MODE.GRAND_MASTER:
        return `GRAND MASTER AI`;
      case AI_PLAY_MODE.LEGEND:
        return `LEGEND AI`;
      case AI_PLAY_MODE.IMMORTAL:
        return `IMMORTAL AI`;
      default:
        return "";
    }
  }

  if (opponent?.Username) {
    return opponent.Username;
  }

  if (opponent?.GuestId) {
    return `Brainiac #${opponent.GuestId}`;
  }
  return "Unknown";
};
