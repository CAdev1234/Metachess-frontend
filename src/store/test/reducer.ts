import { Action } from '../generators'
import { ACTION_TYPE } from './action'

const INITIAL_STATE: ITestReducer = {
  counter: 0,
  onMove: 'w'
};

export default (
  state: ITestReducer = INITIAL_STATE,
  action: Action
): ITestReducer => {
  return {
    ...state,
    ...({
      [action.type]: {},
      [ACTION_TYPE.TEST_INCREMENT]: {
        counter: action.payload
      },
      [ACTION_TYPE.SET_ON_MOVE]: {
        onMove: action.payload
      }
    }[action.type])
  }
}
