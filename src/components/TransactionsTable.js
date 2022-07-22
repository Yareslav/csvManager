import {Table} from "react-bootstrap";
import TableRow from "./TableRow";

const TransactionsTable = ()=>{
	return (<Table striped="columns" bordered hover className="margin">
		 <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Type</th>
          <th>Client name</th>
					<th>Amount</th>
					<th>Action</th>
        </tr>
      </thead>
      <tbody>

      </tbody>
	</Table>);
}

export default TransactionsTable;