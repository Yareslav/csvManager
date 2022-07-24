import { Table } from "react-bootstrap";
import TableRow from "./TableRow";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { maxTransactionOnOnePage } from "../reducers/transactionReducer";
import { Alert } from "react-bootstrap";

const TransactionsTable = () => {
  const typeGetter = (type) => (store) => store.transactionReducer[type];
  //! data from reducer
  const transactionHashTable = useSelector(typeGetter("transactionHashTable"));
  const areFiltersOn = useSelector(typeGetter("areFiltersOn"));
  const filteredTransactionHashTable = useSelector(typeGetter("filteredTransactionHashTable"));
  const currentPage = useSelector(typeGetter("currentPage"));
  const totalPages = useSelector(typeGetter("totalPages"));

  const tableRows = useMemo(() => {
    const data = Object.values(
      areFiltersOn ? filteredTransactionHashTable : transactionHashTable
    );
    const pagesArray = [];

    //! cuts transitions array on other arrays , which max length is maxTransactionOnOnePage
    for (let i = 0; i < totalPages; i++) {
      pagesArray.push(
        data.slice(
          maxTransactionOnOnePage * i,
          maxTransactionOnOnePage + maxTransactionOnOnePage * i + 1
        )
      );
    }
    //!pagesArray can be empty , so we add empty array to get rid of errors
    return (pagesArray[currentPage] || []).map((transaction) => (
      <TableRow {...transaction} key={transaction.amount+transaction.transactionId}/>
    ));
  }, [
    JSON.stringify(transactionHashTable),
    JSON.stringify(filteredTransactionHashTable),
    areFiltersOn,
    currentPage,
  ]);

  return (
    <>
      <Table striped="columns" bordered hover className="margin">
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
        <tbody>{tableRows}</tbody>
      </Table>

      {(totalPages === 0 && areFiltersOn) && (
        <Alert variant="warning">
          There are no transactions suitable for this filter
        </Alert>
      )}

      {(totalPages === 0 && !areFiltersOn) && (
        <Alert variant="primary">
          You have no transactions , please import them
        </Alert>
      )}

    </>
  );
};

export default memo(TransactionsTable);
