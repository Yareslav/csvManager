import { take, put } from "redux-saga/effects";
import axios from "axios";
import fakeData from "./fakeData";
import MockAdapter from "axios-mock-adapter";
import {
  loadTransactions,
  loadingErrorOccurred,
  startLoading,
} from "../reducers/transactionReducer";

export const INITIAL_TRANSITION_lOADING = "INITIAL_TRANSITION_lOADING";

export function* initialTransitionRequestWatcher() {
  yield take(INITIAL_TRANSITION_lOADING);
  yield initialTransitionRequestWorker();
}
export function* initialTransitionRequestWorker() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  mock.onGet("/transitions").reply(200, {
    results: fakeData,
  });

  yield put(startLoading());

  try {
    const {
      data: { results },
    } = yield axios.get("/transitions");
    yield put(loadTransactions(results));
  } catch {
    yield put(loadingErrorOccurred());
  }

}
