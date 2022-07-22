import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  modalWindowMods,
  changeModalWindowType,
  statuses,
  deleteTransition,
  editTransitionStatus,
} from "../reducers/transactionReducer";
import { useEffect, useRef, useState } from "react";
import {READ_FILE} from "../sagas/importTranstionSaga";

const ModalWindow = () => {
  //! data from reducer
  const typeGetter = (type) => (store) => store.transactionReducer[type];

  const modalWindowMode = useSelector(typeGetter("modalWindowMode"));
  const status = useSelector(typeGetter("status"));
  const dispatch = useDispatch();

  const [currentStatus, setCurrentStatus] = useState(status);
  const [file, setFile] = useState(null);
  //!refs
  //! jsx getters
  const getTitle = () => {
    if (modalWindowMode === modalWindowMods.delete) return "File deleting";
    if (modalWindowMode === modalWindowMods.edit) return "File editing";
    return "File importing";
  };

  const getBody = () => {
    if (modalWindowMode === modalWindowMods.insertFile)
      return (
        <Form.Control
          type="file"
          placeholder="Put your file here"
          onChange={(eve) => setFile(eve.target.files[0])}
        />
      );

    if (modalWindowMode === modalWindowMods.edit) {
      const options = Object.values(statuses).filter(
        (elem) => elem !== statuses.default
      );

      return (
        <Form.Select size="lg" onChange={(value) => setCurrentStatus(value)}>
          {options.map((elem) => (
            <option key={elem} value={elem}>
              {elem}
            </option>
          ))}
        </Form.Select>
      );
    }

    if (modalWindowMode === modalWindowMods.delete)
      return <h3>Are you sure you want to delete this transaction ?</h3>;
  };

  const isDisabled = () => {
    if (modalWindowMode === modalWindowMods.insertFile && !file) return true;
    if (modalWindowMode === modalWindowMods.edit && currentStatus === status)
      return true;
    return false;
  };
  //!handlers
  const closeHandler = () => {
    dispatch(changeModalWindowType(modalWindowMods.none));
  };

  const submitHandler = () => {
    if (modalWindowMode === modalWindowMods.delete)
      dispatch(deleteTransition());
    else if (modalWindowMode === modalWindowMods.edit)
      dispatch(editTransitionStatus(currentStatus));
    else dispatch({type:READ_FILE,payload:file});

    dispatch(changeModalWindowType(modalWindowMods.none));
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
    >
      <Modal.Header>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getBody()}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={submitHandler}
          disabled={isDisabled()}
        >
          Ok
        </Button>
        <Button variant="light" onClick={closeHandler}>
          Cannel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWindow;
