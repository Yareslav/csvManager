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
import {
  changeStatus,
  changeType,
  modalWindowMods,
  changeModalWindowType,
} from "../reducers/transactionReducer";

import { useDispatch, useSelector } from "react-redux";
import { INITIAL_TRANSITION_lOADING } from "../sagas/requestTransitionsSaga";

import ModalWindow from "../components/ModalWindow";
import TransactionsTable from "../components/TransactionsTable";
import PageController from "../components/PageController";

const Main = () => {
  const dispatch = useDispatch();
  const typeGetter = (type) => (store) => store.transactionReducer[type];

  const loading = useSelector(typeGetter("loading"));
  const loadingError = useSelector(typeGetter("loadingError"));
  const modalWindowMode =useSelector(typeGetter("modalWindowMode"));
  const readingFileError = useSelector(typeGetter("readingFileError"));
  const totalPages = useSelector(typeGetter("totalPages"));

  useEffect(() => {
    dispatch({ type: INITIAL_TRANSITION_lOADING });
  }, []);

  const importHandler = () => {
    dispatch(changeModalWindowType(modalWindowMods.insertFile));
  };

  const exportHandler = ()=>{
    dispatch(changeModalWindowType(modalWindowMods.export));
  }

  return (
    <div>
      <Container className="margin">
        <Row>
          <Col>
            <Select data={statuses} action={changeStatus} type="status"/>
          </Col>
          <Col>
            <Select data={types} action={changeType} type="type"/>
          </Col>
          <Col>
            <ButtonGroup>
              <Button variant="outline-primary" onClick={importHandler}>
                Import
              </Button>
              <Button variant="outline-primary" onClick={exportHandler}>Export</Button>
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

      {loadingError && <Alert variant="danger" className="margin">An error occurred</Alert>}

      {readingFileError && <Alert variant="danger" className="margin">File importing was unsuccessful. Check if its extension is .csv and if it isn`t empty</Alert>}

      {modalWindowMode !== modalWindowMods.none && <ModalWindow />}

      <TransactionsTable />

      {(totalPages>1) && <PageController/>}
    </div>
  );
};

export default Main;
