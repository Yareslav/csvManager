import {useDispatch} from "react-redux";
import {Button} from "react-bootstrap";
import { changePage } from "../reducers/transactionReducer";

const RegularButton = ({i, currentPage}) => {
  const dispatch = useDispatch();

  const clickHandler = () => {
    if (i !== currentPage) dispatch(changePage(i));
  };

  return (
    <Button
      key={i}
      variant={i === currentPage ? "dark" : "outline-info"}
      onClick={clickHandler}
    >
      {i + 1}
    </Button>
  );
};

export default RegularButton;