export interface ILeaderboardReducer {
  // quickPlayLeaderboard: ILeaderBoardResult[];
  // aiGamesLeaderboard: ILeaderBoardResult[];
  // rapidLeaderboard: ILeaderBoardResult[];
  // blitzLeaderboard: ILeaderBoardResult[];
  // bulletLeaderboard: ILeaderBoardResult[];
  // classicalLeaderboard: ILeaderBoardResult[];
  Leaderboard: ILeaderBoardResult[];
  totalResults: number;
}

export interface ISetLeaderboardPayload {
  result: ILeaderBoardResult[];
  count: number;
}

export enum LeaderboardType {
  "Classical" = 1,
  "Bullet",
  "Rapid",
  "Blitz",
}

export interface IFetchLeaderboardPayload {
  beginDate: number;
  endDate: number;
  top?: number;
  skip?: number;
  gameType?: LeaderboardType;
  type: string;
}

// export interface IFetchLeaderboardPayloadRating {
//   beginDate: number;
//   endDate: number;
//   top?: number;
//   skip?: number;
//   gameType: LeaderboardType;
//   type: string;
// }

export interface ILeaderBoardResult {
  Account: {
    Id: number;
    Avatar: null | string;
    Username: string;
    WalletAddress: null | string;
    AverageRating: number;
  };
  Games: number;
  Defeats: number;
  Draws: number;
  Wins: number;
}
