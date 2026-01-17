export const checkValidSignInFrom = (email, password) => {
	// valid email and return different different values depending----------
	const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
		email
	);
	const isPasswordValid =
		/^(?=.*\d)(?=.*[a-z])(?=.*[^((0-9)|(a-z)|\s)]).{8,}$/.test(
			password
		);
	if (!isEmailValid) return "Invalid email format";
	if (!isPasswordValid) return "Invalid password";
	return null;
};
export const checkValidSignUpFrom = (firstName, lastName, email, password) => {
	const isFirstValid = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(firstName.trim());
	const isLastValid = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(lastName.trim());
	const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
		email
	);
	if (!isFirstValid) return "Invalid FirstName Format";
	if (!isLastValid) return "Invalid LastName Format";
	if (!isEmailValid) return "Invalid email format";
	if (password.length < 8) return "Min 8 characters";
	if (!/[a-z]/.test(password)) return "Needs 1 lowercase letter";
	if (!/\d/.test(password)) return "Needs 1 number";
	if (!/[^((0-9)|(a-z)|\s)]/.test(password))
		return "Needs 1 special char";
	return null;
};
export const checkValidForgotFrom = (email) => {
	const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
		email
	);
	if (!isEmailValid) return "Invalid email format";
	return null;
};
