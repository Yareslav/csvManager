import { Provider } from 'react-redux';
import store from "./reducers/store"
import Main from "./screens/Main"
import fakeData from "./sagas/fakeData";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/style.css"

const App=()=> {
  return (
    <Provider store={store}>
      <Main/>
    </Provider>
  );
}

export default App;