import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const signUpUser = (e) => {
		// Signup ---
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Error : " + error.code);
				e.target.disabled = false;
			});
	};
	const handleSignup = (e) => {
		if (firstName && lastName && email && password) {
			const validError = checkValidSignUpFrom(
				firstName,
				lastName,
				email,
				password
			);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="flex flex-col items-center my-6 text-slate-300 min-h-[80vh]">
			<div className="p-6 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] border border-purple-500/30 bg-gradient-to-br from-slate-800/90 to-purple-900/90 rounded-2xl h-fit mt-5 transition-all shadow-2xl shadow-purple-500/20">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent w-full text-center mb-6">
					SignUp ChatApp
				</h2>
				<form className="w-full flex justify-between flex-col">
					<h3 className="text-lg font-semibold p-2 text-blue-300">
						Enter First Name
					</h3>
					<input
						className="w-full border border-purple-500/30 my-3 py-4 px-8 rounded-full flex justify-between bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						type="text"
						placeholder="Enter First Name"
						name="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
					<h3 className="text-lg font-semibold p-2 text-blue-300">
						Enter Last Name
					</h3>
					<input
						className="w-full border border-purple-500/30 my-3 py-4 px-8 rounded-full flex justify-between bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						type="text"
						placeholder="Enter Last Name"
						name="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
					<h3 className="text-lg font-semibold p-2 text-blue-300">
						Enter Email Address
					</h3>
					<input
						className="w-full border border-purple-500/30 my-3 py-4 px-8 rounded-full flex justify-between bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<h3 className="text-lg font-semibold p-2 text-blue-300">
						Enter Password
					</h3>
					<div className="relative">
						<input
							className="w-full border border-purple-500/30 my-3 py-4 px-8 rounded-full flex justify-between bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="cursor-pointer text-purple-600 hover:text-purple-700 absolute right-5 top-8 transition-colors"
						>
							{isShow ? (
								<PiEyeClosedLight fontSize={22} />
							) : (
								<PiEye fontSize={22} />
							)}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSignup(e);
							e.preventDefault();
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:from-purple-700 hover:to-blue-700 rounded-full px-5 py-4 mt-5 text-lg border border-purple-500/30 text-white bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
					>
						{load == "" ? "SignUp" : load}
					</button>
					<div className="w-full flex items-center my-4">
						<div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
						<Link to="/signin">
							<div className="p-3 font-semibold text-md hover:text-purple-300 transition-colors">
								SignIn
							</div>
						</Link>
						<div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
