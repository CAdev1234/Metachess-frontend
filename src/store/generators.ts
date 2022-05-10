export const createAction = <T>(type: any) => (payload?: T) => ({
  type,
  payload
})

export const createActionArray = <T>(type: any) => (payload: T) => {
  return ({
    type,
    payload
})
}

export interface Action {
  type: string;
  payload: any;
}
