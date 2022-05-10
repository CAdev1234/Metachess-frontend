import { createStore as reduxCreateStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./reducers";
import rootSaga from "./sagas";

export const sagaMiddleware = createSagaMiddleware();

const store = reduxCreateStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;
