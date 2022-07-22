import {initialTransitionRequestWatcher} from "./requestTransitionsSaga";
import {importTransitionWatcher} from "./importTranstionSaga";
import {all,fork} from "redux-saga/effects";

export default function* rootSaga() {
	yield all([
		fork(initialTransitionRequestWatcher),
		fork(importTransitionWatcher)
	]);
}