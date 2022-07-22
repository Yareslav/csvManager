import { take, put } from "redux-saga/effects";
import { importTransitions } from "../sagas/requestTransitionsSaga";
import formatter from "../utils/formatter";
import { readingFileErrorOccurred } from "../reducers/transactionReducer";

export const READ_FILE = "READ_FILE";

export function* importTransitionWatcher() {
  while (true) {
    const { payload } = yield take(READ_FILE);
    yield importTransitionWorker(payload);
  }
}

function* importTransitionWorker(file) {
  const reader = new FileReader();

  if (file.type.split("/")[1] !== "csv") {
    yield put(readingFileErrorOccurred());
    return;
  }

  reader.readAsText(file);
  let data;

  try {
    data = yield new Promise((res, rej) => {
      reader.onload = () => {
        res(reader.result);
      };

      reader.onerror = () => {
        rej();
      };
    });
  } catch {
    yield put(readingFileErrorOccurred());
    return;
  }

  const textMass = data
    .split(/\n/)
    .map((text) => text.replace(/\r/, ""))
    .slice(1);

  const formatted = formatter(textMass);

  yield put(importTransitions(formatted));
}
