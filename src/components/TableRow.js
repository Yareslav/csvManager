import { ButtonGroup, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  changeModalWindowType,
  setSelectedTransitionId,
	modalWindowMods
} from "../reducers/transactionReducer";

const TableRow = ({ transactionId, status, type, clientName, amount }) => {
  const dispatch = useDispatch();

  const editHandler = () => {
		dispatch(setSelectedTransitionId(transactionId));
		dispatch(changeModalWindowType(modalWindowMods.edit));
	};

  const deleteHandler = () => {
		dispatch(setSelectedTransitionId(transactionId));
		dispatch(changeModalWindowType(modalWindowMods.delete));
	};

  return (
    <tr>
      <td>{transactionId}</td>
      <td>{status}</td>
      <td>{type}</td>
      <td>{clientName}</td>
      <td>{amount}</td>
      <td>
        <ButtonGroup>
          <Button variant="warning" onClick={editHandler}>
            Edit
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default TableRow;
