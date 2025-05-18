import { useState } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	const handleCancel = () => {
		setIsEditing(false);
		setAbout(userData.about || "");
	};

	return (
		<div className='bg-[#1e1e1e] shadow-lg rounded-2xl p-6 mb-6 '>
			<h2 className='text-2xl font-bold text-white mb-4'>About</h2>

			{isOwnProfile ? (
				isEditing ? (
					<div>
						<textarea
							value={about}
							onChange={(e) => setAbout(e.target.value)}
							className='w-full p-3 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light'
							rows='5'
							placeholder='Write something about yourself...'
						/>

						<div className='mt-3 flex gap-3'>
							<button
								onClick={handleSave}
								className='bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition duration-200'
							>
								Save
							</button>
							<button
								onClick={handleCancel}
								className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition duration-200'
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<div>
						<p className='text-white whitespace-pre-line'>{userData.about || "Nothing added yet."}</p>
						<button
							onClick={() => setIsEditing(true)}
							className='mt-3 inline-block text-sm text-primary hover:text-primary-dark font-medium transition'
						>
							Edit
						</button>
					</div>
				)
			) : (
				<p className='text-gray-700 whitespace-pre-line'>{userData.about || "No information provided."}</p>
			)}
		</div>
	);
};

export default AboutSection;
