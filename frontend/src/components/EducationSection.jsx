import { GraduationCap, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    field: "",
    from: "",
    to: "",
  });

  const handleAddEducation = () => {
    if (newEducation.school && newEducation.field && newEducation.from) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        field: "",
        from: "",
        to: "",
      });
    }
  };

  const handleDeleteEducation = (id) => {
   setEducations(educations.filter((edu) => edu._id !== id));
  };

  const handleSave = () => {
    onSave({ education:educations });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#1e1e1e] shadow rounded-lg p-6 mb-6 text-gray-200">
      <h2 className="text-xl font-semibold mb-4">Education</h2>

      {educations.map((edu) => (
        <div key={edu._id} className="mb-4 flex justify-between items-start border-b border-gray-700 pb-4">
          <div className="flex items-start">
            <GraduationCap size={20} className="mr-2 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold text-white">{edu.school}</h3>
              <p className="text-gray-400">{edu.field}</p>
              <p className="text-gray-500 text-sm">
                {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : "Present"}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this education entry?")) {
                  handleDeleteEducation(edu._id);
                }
              }}
              className="text-red-500"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="School"
            value={newEducation.school}
            onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
            className="w-full p-2 mb-2 rounded bg-[#2c2c2c] text-white border border-gray-600 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={newEducation.field}
            onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
            className="w-full p-2 mb-2 rounded bg-[#2c2c2c] text-white border border-gray-600 placeholder-gray-500"
          />
          <input
            type="date"
            value={newEducation.from}
            onChange={(e) => setNewEducation({ ...newEducation, from: e.target.value })}
            className="w-full p-2 mb-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
          />
          <input
            type="date"
            value={newEducation.to}
            onChange={(e) => setNewEducation({ ...newEducation, to: e.target.value })}
            className="w-full p-2 mb-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
          />
          <button
            onClick={handleAddEducation}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
          >
            Add Education
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-primary hover:text-primary-dark transition duration-300"
            >
              Edit Education
            </button>
          )}
        </>
      )}

    </div>
  );
};

export default EducationSection;
