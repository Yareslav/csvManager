import { useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { statuses, types } from "../reducers/transactionReducer";
import Select from "../components/Select";
import { changeStatus, changeType,modalWindowMods,changeModalWindowType } from "../reducers/transactionReducer";
import TransactionsTable from "../components/TransactionsTable";
import { useDispatch, useSelector } from "react-redux";
import { INITIAL_TRANSITION_lOADING } from "../sagas/requestTransitionsSaga";
import ModalWindow from "../components/ModalWindow";

const Main = () => {
  const dispatch = useDispatch();
  const typeGetter = (type) => (store) => store.transactionReducer[type];

  const loading = useSelector(typeGetter("loading"));
  const loadingError = useSelector(typeGetter("loadingError"));
  const modalWindowMode = useSelector(typeGetter("modalWindowMode"));

  useEffect(() => {
    dispatch({ type: INITIAL_TRANSITION_lOADING });
  }, []);

  const importHandler=()=>{
    dispatch(changeModalWindowType(modalWindowMods.insertFile))
  }
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Select data={statuses} action={changeStatus} />
          </Col>
          <Col>
            <Select data={types} action={changeType} />
          </Col>
          <Col>
            <ButtonGroup>
              <Button variant="outline-primary" onClick={importHandler}>Import</Button>
              <Button variant="outline-primary">Export</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>

      {loading && (
        <Alert variant="info" className="loading margin">
          <h1>Loading</h1>
          <Spinner animation="border" variant="info" />
        </Alert>
      )}

      {loadingError && <Alert variant="danger">An error occurred</Alert>}

      {modalWindowMode!==modalWindowMods.none && <ModalWindow/>}
      <TransactionsTable />

    </div>
  );
};

export default Main;
