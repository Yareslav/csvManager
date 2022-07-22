import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import transactionReducer from "./transactionReducer"
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/rootSaga";

let sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
  reducer: {
		transactionReducer
	},
	middleware
})

sagaMiddleware.run(rootSaga);

export default store;