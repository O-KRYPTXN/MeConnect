import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className="bg-secondary rounded-xl shadow-md overflow-hidden w-64 text-sm">
			{/* Profile Section */}
			<div className="text-center relative">
				<div
					className="h-20 bg-cover bg-center"
					style={{
						backgroundImage: `url("${user.bannerPic || "/banner.png"}")`,
					}}
				></div>

				<Link to={`/profile/${user.username}`}>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.username}
						className="w-16 h-16 rounded-full mx-auto absolute left-1/2 top-10 transform -translate-x-1/2 border-2 border-white bg-white shadow-sm transition-transform duration-200 hover:scale-105"
					/>
				</Link>

				<div className="mt-12 px-3 pb-3">
					<Link to={`/profile/${user.username}`} className="hover:underline">
						<h2 className="text-base font-semibold text-base-content truncate">
							{user.first_name + " " + user.last_name}
						</h2>
					</Link>
					<p className="text-info text-xs truncate">{user.headline}</p>
					<p className="text-info text-xs mt-1">
						{user.connections.length} connections
					</p>
				</div>
			</div>

			{/* Navigation Links */}
			<div className="border-t border-base-100 px-3 py-2">
				<nav>
					<ul className="space-y-1">
						<li>
							<Link
								to="/"
								className="flex items-center py-1.5 px-3 rounded hover:bg-primary hover:text-white transition"
							>
								<Home className="mr-2" size={16} /> Home
							</Link>
						</li>
						<li>
							<Link
								to="/network"
								className="flex items-center py-1.5 px-3 rounded hover:bg-primary hover:text-white transition"
							>
								<UserPlus className="mr-2" size={16} /> My Network
							</Link>
						</li>
						<li>
							<Link
								to="/notifications"
								className="flex items-center py-1.5 px-3 rounded hover:bg-primary hover:text-white transition"
							>
								<Bell className="mr-2" size={16} /> Notifications
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			{/* Footer Link */}
			<div className="border-t border-base-100 px-3 py-2 text-center">
				<Link
					to={`/profile/${user.username}`}
					className="text-xs font-semibold text-primary hover:underline"
				>
					View Profile
				</Link>
			</div>
		</div>
	);
}
