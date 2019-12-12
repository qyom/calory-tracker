export default function buildFiltersQueryString(filters, queryStringMap) {
	let queryString = '';
	const filterKeys = Object.keys(filters);
	if (filterKeys.length) {
		queryString = filterKeys.reduce((queryString, filterKey) => {
			const filterValue = filters[filterKey];
			if (filterValue) {
				return `${queryString}${queryStringMap[filterKey]}=${filterValue}&`;
			}
			return queryString;
		}, '?');
		queryString = queryString.slice(0, queryString.length - 1);
	}
	return encodeURI(queryString);
}
