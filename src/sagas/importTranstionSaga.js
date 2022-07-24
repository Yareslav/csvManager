import { take, put, delay } from "redux-saga/effects";
import formatter from "../utils/formatter";
import {
  readingFileErrorOccurred,
  importTransitions,
  disableReadingFileError
} from "../reducers/transactionReducer";

export const READ_FILE = "READ_FILE";

export function* importTransitionWatcher() {
  while (true) {
    const { payload } = yield take(READ_FILE);
    yield importTransitionWorker(payload);
  }
}

function* importTransitionWorker(file) {
  const reader = new FileReader();

  function* throwMistake() {
    yield put(readingFileErrorOccurred());
    yield delay(5000);
    yield put(disableReadingFileError());
  }

  if (file.type.split("/")[1] !== "csv") {
    yield throwMistake();
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
    yield throwMistake();
    return;
  }

  const textMass = data
    .split(/\n/)
    .map((text) => text.replace(/\r/, ""))
    .slice(1);

  if (textMass.length===0) {
    yield throwMistake();
    return;
  }

  const formatted = formatter(textMass);
  const filtered = formatted.filter(elem=>{
    return !Object.values(elem).some(field=>field===undefined);
  });

  yield put(importTransitions(filtered));
}
