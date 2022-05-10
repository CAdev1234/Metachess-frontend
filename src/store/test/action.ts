import { createAction } from '../generators';

export enum ACTION_TYPE {
  'TEST_INCREMENT' = 'TEST_INCREMENT',
  'SET_ON_MOVE' = 'SET_ON_MOVE'
}

export const Actions = {
  increment: createAction<number>(ACTION_TYPE.TEST_INCREMENT),
  onMove: createAction<string>(ACTION_TYPE.SET_ON_MOVE)
}
