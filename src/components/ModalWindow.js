import {
  Modal,
  Button,
  Form,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
//! redux staff
import { useDispatch, useSelector } from "react-redux";
import {
  modalWindowMods,
  changeModalWindowType,
  statuses,
  deleteTransition,
  editTransitionStatus,
  changeExportColumns,
} from "../reducers/transactionReducer";
import { READ_FILE } from "../sagas/importTranstionSaga";
//! utils
import downloadFile from "../utils/downloadFile";
import { useState } from "react";

const ModalWindow = () => {
  //! data from reducer
  const typeGetter = (type) => (store) => store.transactionReducer[type];
  const dispatch = useDispatch();

  const modalWindowMode = useSelector(typeGetter("modalWindowMode"));
  const transactionHashTable = useSelector(typeGetter("transactionHashTable"));
  const selectedTransitionId = useSelector(typeGetter("selectedTransitionId"));
  const exportColumns = useSelector(typeGetter("exportColumns"));
  //! for exporting file
  const areFiltersOn = useSelector(typeGetter("areFiltersOn"));
  const filteredTransactionHashTable = useSelector(
    typeGetter("filteredTransactionHashTable")
  );

  const status = transactionHashTable[selectedTransitionId]?.status;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [file, setFile] = useState(null);

  //! jsx getters
  const getTitle = () => {
    if (modalWindowMode === modalWindowMods.delete) return "File deleting";
    if (modalWindowMode === modalWindowMods.edit) return "File editing";
    return "File importing";
  };

  const getBody = () => {
    const clientName = transactionHashTable[selectedTransitionId]?.clientName;

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
        <>
          <h6>
            Do you want to edit status of{" "}
            <span className="name">{clientName}</span> transaction ?
          </h6>

          <Form.Select
            size="lg"
            onChange={(eve) => setCurrentStatus(eve.target.value)}
            value={currentStatus}
          >
            {options.map((elem) => (
              <option key={elem} value={elem}>
                {elem}
              </option>
            ))}
          </Form.Select>
        </>
      );
    }

    if (modalWindowMode === modalWindowMods.delete)
      return (
        <h3>
          Are you sure you want to delete
          <span className="name">{clientName}</span> transaction ?
        </h3>
      );

    if (modalWindowMode === modalWindowMods.export) {
      const fields = Object.entries(exportColumns);
      return (
        <>
          <h4>Choose fields you want to download</h4>
          <ButtonGroup>
            {fields.map(([key, data]) => (
              <Button
                key={key}
                type="checkbox"
                variant={data.checked ? "success" : "outline-success"}
                style={{ opacity: data.checked ? 1 : 0.5 }}
                onClick={() => dispatch(changeExportColumns(key))}
              >
                {data.displayName}
              </Button>
            ))}
          </ButtonGroup>
        </>
      );
    }
  };

  const isDisabledButton = () => {
    if (modalWindowMode === modalWindowMods.insertFile && !file) return true;
    if (modalWindowMode === modalWindowMods.edit && currentStatus === status)
      return true;

    if (modalWindowMode === modalWindowMods.export) {
      const booleanArray = Object.values(exportColumns).map(
        (obj) => obj.checked
      );

      if (!booleanArray.includes(true)) return true;
    }
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

    else if (modalWindowMode === modalWindowMods.insertFile)
      dispatch({ type: READ_FILE, payload: file });

    else if (modalWindowMode === modalWindowMods.export)
      downloadFile(
        exportColumns,
        areFiltersOn ? filteredTransactionHashTable : transactionHashTable
      );
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
          disabled={isDisabledButton()}
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
