import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};
	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	// Scroll to top of page && Redirect Auth change --------------------------------
	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		var prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	// headerMenuBox outside click handler
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	// add && remove events according to isHeaderMenu
	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isHeaderMenu]);
	return (
		<div
			id="header"
			className="w-full h-16 fixed top-0 z-50 md:h-20 shadow-lg shadow-purple-500/20 flex justify-between items-center p-4 font-semibold bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 text-white border-b border-purple-500/30"
		>
			<div className="flex items-center justify-start gap-2">
				<Link to={"/"}>
					<div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
						<FaComments fontSize={24} className="text-white" />
					</div>
				</Link>
				<Link to={"/"}>
					<span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ChatApp</span>
				</Link>
			</div>

			{user ? (
				<div className="flex flex-nowrap items-center">
					<span
						className={`whitespace-nowrap ml-2 flex items-center justify-center relative mr-1.5 cursor-pointer ${
							newMessageRecieved.length > 0
								? "animate-bounce"
								: "animate-none"
						}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={25} />
						<span className="font-semibold text-xs absolute top-0 right-0 translate-x-1.5 -translate-y-1.5">
							{newMessageRecieved.length}
						</span>
					</span>
					<span className="whitespace-nowrap ml-2">
						Hi, {user.firstName}
					</span>
					<div
						ref={headerUserBox}
						onClick={(e) => {
							e.preventDefault();
							dispatch(setHeaderMenu(!isHeaderMenu));
						}}
						className="flex flex-nowrap transition-all items-center ml-3 border border-purple-400/50 rounded-full bg-gradient-to-tr from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 shadow-lg hover:shadow-purple-500/50 cursor-pointer"
					>
						<img
							src={user.image}
							alt="gg"
							className="w-10 h-10 rounded-full"
						/>
						<span className="m-2">
							{isHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>
					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="border border-purple-500/50 text-white w-44 h-28 py-3 flex flex-col justify-center rounded-xl items-center gap-2 absolute top-20 right-4 z-40 bg-gradient-to-br from-slate-800 to-purple-900 shadow-xl shadow-purple-500/30"
						>
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex flex-nowrap items-center w-full h-fit cursor-pointer justify-center hover:bg-purple-600/30 hover:text-white p-2 rounded-lg transition-all duration-200"
							>
								<div className="flex items-center justify-between w-2/4">
									<PiUserCircleLight fontSize={23} />
									<span>Profile</span>
								</div>
							</div>
							<div
								className="flex flex-nowrap items-center w-full h-fit cursor-pointer justify-center hover:bg-red-600/30 hover:text-white p-2 rounded-lg transition-all duration-200"
								onClick={handleLogout}
							>
								<div className="flex items-center justify-between w-2/4">
									<IoLogOutOutline fontSize={21} />
									<span>Logout</span>
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-6 border border-purple-400/50 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
						SignIn
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
