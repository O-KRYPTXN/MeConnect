import { format, parseISO, isValid } from "date-fns";

export const formatDate = (dateString) => {
	if (!dateString || dateString.toLowerCase() === "present") {
		return "Present";
	}

	const date = parseISO(dateString);
	return isValid(date) ? format(date, "MMM yyyy") : "Invalid date";
};
