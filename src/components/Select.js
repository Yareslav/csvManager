import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {filterTransitions} from "../reducers/transactionReducer";

const Select = ({data,action}) => {
	const dispatch = useDispatch();

	const changeHandler = (eve)=>{
		dispatch(action(eve.target.value));
    dispatch(filterTransitions());
	}

  return (
    <Form.Select size="small" onChange={changeHandler} className="selectWidth">
      {Object.values(data).map((elem) => (
        <option value={elem} key={elem}>
          {elem}
        </option>
      ))}
    </Form.Select>
  );
};

export default Select;