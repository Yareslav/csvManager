import { saveAs } from "file-saver";
const downloadFile = (exportColumns,transitionsTable) => {
	const selectedColumnObjects = Object.entries(exportColumns).filter(
		([_, data]) => {
			return data.checked;
		}
	);

	const columnDisplayNames = selectedColumnObjects.map(
		([_, data]) => data.displayName
	);
	const firstFileLine = columnDisplayNames.join(",") + "\n";
	//! we get column keys and then we will use it to choose some certain fields from transitions by using them
	const columnKeys = selectedColumnObjects.map(([key]) => key);
	const transitions = Object.values(transitionsTable);

	//! it takes filtered transition data and turn it into string
	const outputTransitionDataTurnedIntoString = transitions.map((transition) => {
		const entries = Object.entries(transition);
		const filtered = entries.filter(([key, _]) =>
			columnKeys.includes(key)
		);

		const stringsArray = filtered.map(([_,string]) => string);
		return stringsArray.join(",") + "\n";
	});

	const file = new File([firstFileLine,...outputTransitionDataTurnedIntoString], "transactions.csv", {
		type: "text/plain;charset=utf-8",
	});

	saveAs(file);
};

export default downloadFile;