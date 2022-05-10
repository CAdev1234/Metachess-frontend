// const API_BASE_URL: string = `http://localhost:4000/api/v1`;

import { API } from "../config";

const API_BASE_URL: string = API;

export const ENDPOINTS = {
  TEST: "ENDPOINTS_TEST",
  USER_SUMMARY: "FETCH_USER",
  USER_UPDATE: "UPDATE_USER",
  MATCHES_HISTORY: "MATCHES_HISTORY",
  SERVER_STATUS: "SERVER_STATUS",
  FIND_USER: "FIND_USER",

  // Friends
  GET_FRIENDS: "GET_FRIENDS",
  GET_CHAT: "GET_CHAT",
  GET_UNREAD_MESSAGES: "GET_UNREAD_MESSAGES",
  GET_FRIEND_REQUESTS: "GET_FRIEND_REQUESTS",
  ACCEPT_FRIEND_REQUEST: "ACCEPT_FRIEND_REQUEST",
  REJECT_FRIEND_REQUEST: "REJECT_FRIEND_REQUEST",
  REMOVE_FRIEND: "REMOVE_FRIEND",
  SEND_FRIEND_REQUEST: "SEND_FRIEND_REQUEST",
  GET_COUNTRIES: "GET_COUNTRIES",
  POST_AI_GAME_DATA: "POST_AI_GAME_DATA",
  GET_QUICKPLAY_LEADERBOARD: "GET_QUICKPLAY_LEADERBOARD",
  GET_AI_GAMES_LEADERBOARD: "GET_AI_GAMES_LEADERBOARD",
  GET_RATING_LEADERBOARD: "GET_RATING_LEADERBOARD",
  GET_USER_STATS: "GET_USER_STATS",
  GET_GAME_CHAT: "GET_GAME_CHAT",
  SET_MESSAGES_READ: "SET_MESSAGES_READ",
  GET_CHAT_HISTORY: "GET_CHAT_HISTORY",
  GET_RANDOM_PUZZLE: "GET_RANDOM_PUZZLE",
};

const convertQuery = (queries: IQuery[]): string => {
  if (!queries || queries.length < 0) {
    return "";
  }

  let finalQuery = "";
  queries.forEach((query) => {
    if (query.value) {
      finalQuery += `&${encodeURI(query.name)}=${encodeURI(query.value)}`;
    }
  });
  finalQuery = `?${finalQuery.substring(1)}`;
  return finalQuery;
};

export const constructUrl = (
  endpoint: string,
  obj?: any,
  queries?: IQuery[],
  id?: string | number,
  otherEndpointProperties?: any
): string => {
  switch (endpoint) {
    case ENDPOINTS.TEST:
      return `${API_BASE_URL}/testt${queries ? convertQuery(queries) : ""}`;
    case ENDPOINTS.GET_CHAT_HISTORY:
      return `${API_BASE_URL}/message/chats${
        queries ? convertQuery(queries) : ""
      }`;
    case ENDPOINTS.GET_COUNTRIES:
      return `${API_BASE_URL}/countries`;
    case ENDPOINTS.GET_GAME_CHAT:
      return `${API_BASE_URL}/message/game/${queries[0].value}${
        queries.slice(1) ? convertQuery(queries.slice(1)) : ""
      }`;
    case ENDPOINTS.GET_CHAT:
      return `${API_BASE_URL}/message/${queries[0].value}${
        queries.slice(1) ? convertQuery(queries.slice(1)) : ""
      }`;
    case ENDPOINTS.GET_UNREAD_MESSAGES:
      return `${API_BASE_URL}/message/unread`;
    case ENDPOINTS.SET_MESSAGES_READ:
      return `${API_BASE_URL}/message/${queries[0].value}/read`;
    case ENDPOINTS.USER_SUMMARY:
      return `${API_BASE_URL}/account/summary`;
    case ENDPOINTS.USER_UPDATE:
      return `${API_BASE_URL}/account/update`;
    case ENDPOINTS.MATCHES_HISTORY:
      return `${API_BASE_URL}/account/gameHistory${
        queries ? convertQuery(queries) : ""
      }`;
    case ENDPOINTS.SERVER_STATUS:
      return `${API_BASE_URL}/serverstatus`;
    case ENDPOINTS.GET_USER_STATS:
      return `${API_BASE_URL}/account/statistics${
        queries ? convertQuery(queries) : ""
      }`;
    case ENDPOINTS.FIND_USER:
      return `${API_BASE_URL}/account/find${
        queries ? convertQuery(queries) : ""
      }`;
    // AI game data
    case ENDPOINTS.POST_AI_GAME_DATA:
      return `${API_BASE_URL}/aiGame`;
    //Leaderbord data
    case ENDPOINTS.GET_QUICKPLAY_LEADERBOARD:
      return `${API_BASE_URL}/leaderboard/mostactive${
        queries ? convertQuery(queries) : ""
      }`;
    case ENDPOINTS.GET_AI_GAMES_LEADERBOARD:
      return `${API_BASE_URL}/leaderboard/aiGames${
        queries ? convertQuery(queries) : ""
      }`;
    case ENDPOINTS.GET_RATING_LEADERBOARD:
      return `${API_BASE_URL}/leaderboard/rankingByRating${
        queries ? convertQuery(queries) : ""
      }`;
    // Friend's API
    case ENDPOINTS.GET_FRIENDS:
      return `${API_BASE_URL}/friend/list`;
    case ENDPOINTS.GET_FRIEND_REQUESTS:
      return `${API_BASE_URL}/friend/requests`;
    case ENDPOINTS.ACCEPT_FRIEND_REQUEST:
      return `${API_BASE_URL}/friend/requests/${id}/accept`;
    case ENDPOINTS.REJECT_FRIEND_REQUEST:
      return `${API_BASE_URL}/friend/requests/${id}/refuse`;
    case ENDPOINTS.REMOVE_FRIEND:
      return `${API_BASE_URL}/friend/requests/${id}/remove`;
    case ENDPOINTS.SEND_FRIEND_REQUEST:
      return `${API_BASE_URL}/friend/requests/${id}`;
    // Puzzle
    case ENDPOINTS.GET_RANDOM_PUZZLE:
      return `${API_BASE_URL}/puzzles/random`;
    default:
      return "";
  }
};
