import { Form } from "react-bootstrap";
import { useDispatch,useSelector } from "react-redux";
import {filterTransactions} from "../reducers/transactionReducer";

const Select = ({data,action,type}) => {
	const dispatch = useDispatch();
  const value = useSelector(store=>store.transactionReducer[type]);

	const changeHandler = (eve)=>{
		dispatch(action(eve.target.value));
    dispatch(filterTransactions());
	}

  return (
    <Form.Select size="small" onChange={changeHandler} className="selectWidth" value={value}>
      {Object.values(data).map((elem) => (
        <option value={elem} key={elem}>
          {elem}
        </option>
      ))}
    </Form.Select>
  );
};

export default Select;