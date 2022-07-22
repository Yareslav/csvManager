export default function formatter(splittedData) {
	const objectData = splittedData.map((str) => {
		const [transactionId, status, type, clientName, amount] = str.split(",");
		return {
			transactionId,
			status,
			type,
			clientName,
			amount,
		};
	});

	return objectData;
}