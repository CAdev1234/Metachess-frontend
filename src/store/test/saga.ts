import { takeLatest } from 'redux-saga/effects';
import { ACTION_TYPE } from './action';
import API from '../../services/api.service';
import { ENDPOINTS } from '../../services/endpoints';

function* onTestIncrement({
  payload,
}: { payload: number }) {
  try {
    const x = yield API.execute('GET', ENDPOINTS.TEST);
  } catch (e) { }
}

function* watchTestIncrement() {
  yield takeLatest(ACTION_TYPE.TEST_INCREMENT as any, onTestIncrement);
}

export default [
  watchTestIncrement,
]
