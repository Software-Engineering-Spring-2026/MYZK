
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // ---------------- AUTH ----------------
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // ---------------- PROFILE IMAGE ----------------
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(`profileImage_${user.email}`) || ''
  );

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);

      localStorage.setItem(
        `profileImage_${user.email}`,
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  // ---------------- STUDENT STATES ----------------
  const [favorites, setFavorites] = useState(
    JSON.parse(
      localStorage.getItem(`favorites_${user.email}`)
    ) || []
  );

 const [completedInternships, setCompletedInternships] =
  useState(
    JSON.parse(
      localStorage.getItem(
        `internships_${user.email}`
      )
    ) || [
      'Frontend Intern @ Google',
      'Backend Intern @ Microsoft',
      'AI Intern @ OpenAI',
    ]
  );

const [newInternship, setNewInternship] =
  useState('');

  const studentStats = {
    totalProjects: 8,
    languagesUsed: {
      JavaScript: '40%',
      Java: '25%',
      Python: '20%',
      C: '15%',
    },
    topCollaborators: {
      'Sara Ahmed': 5,
      'Omar Khaled': 3,
      'Mariam Tarek': 2,
    }
  };

  // ---------------- INSTRUCTOR STATES ----------------
  const [biography, setBiography] = useState(
    localStorage.getItem(`bio_${user.email}`) || ''
  );

  const [researchInterests, setResearchInterests] =
    useState(
      localStorage.getItem(
        `research_${user.email}`
      ) || ''
    );

  const [education, setEducation] = useState(
    localStorage.getItem(`education_${user.email}`) || ''
  );

  const [courses, setCourses] = useState(
    JSON.parse(
      localStorage.getItem(`courses_${user.email}`)
    ) || ['Data Structures', 'Machine Learning']
  );

  const [courseInput, setCourseInput] =
    useState('');

  useEffect(() => {
    localStorage.setItem(
      `bio_${user.email}`,
      biography
    );

    localStorage.setItem(
      `research_${user.email}`,
      researchInterests
    );

    localStorage.setItem(
      `education_${user.email}`,
      education
    );

    localStorage.setItem(
      `courses_${user.email}`,
      JSON.stringify(courses)
    );
  }, [
    biography,
    researchInterests,
    education,
    courses,
    user.email,
  ]);

  // ---------------- EMPLOYER STATES ----------------
  const [companyBio, setCompanyBio] = useState(
    localStorage.getItem(
      `companyBio_${user.email}`
    ) || ''
  );

  const [companyAddress, setCompanyAddress] =
    useState(
      localStorage.getItem(
        `companyAddress_${user.email}`
      ) || ''
    );

  const [companyContact, setCompanyContact] =
    useState(
      localStorage.getItem(
        `companyContact_${user.email}`
      ) || ''
    );

  useEffect(() => {
    localStorage.setItem(
      `companyBio_${user.email}`,
      companyBio
    );

    localStorage.setItem(
      `companyAddress_${user.email}`,
      companyAddress
    );

    localStorage.setItem(
      `companyContact_${user.email}`,
      companyContact
    );
  }, [
    companyBio,
    companyAddress,
    companyContact,
    user.email,
  ]);

  // ---------------- HELPERS ----------------
  // ---------------- HELPERS ----------------
const addCourse = () => {
  if (!courseInput.trim()) return;

  setCourses((prev) => [...prev, courseInput]);

  setCourseInput('');
};

const removeCourse = (course) => {
  setCourses((prev) =>
    prev.filter((c) => c !== course)
  );
};

// ---------------- EMPLOYER SAVE FUNCTIONS ----------------
const saveCompanyBio = () => {
  localStorage.setItem(
    `companyBio_${user.email}`,
    companyBio
  );

  alert('Company biography saved successfully');
};

const saveCompanyAddress = () => {
  localStorage.setItem(
    `companyAddress_${user.email}`,
    companyAddress
  );

  alert('Company address saved successfully');
};

const saveCompanyContact = () => {
  localStorage.setItem(
    `companyContact_${user.email}`,
    companyContact
  );

  alert('Contact information saved successfully');
};

const openGoogleMaps = () => {
  const query = encodeURIComponent(companyAddress);

  window.open(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    '_blank'
  );
};

// ---------------- INTERNSHIPS ----------------
const addInternship = () => {
  if (!newInternship.trim()) return;

  const updatedInternships = [
    ...completedInternships,
    newInternship,
  ];

  setCompletedInternships(
    updatedInternships
  );

  localStorage.setItem(
    `internships_${user.email}`,
    JSON.stringify(updatedInternships)
  );

  setNewInternship('');
};

// ---------------- INSTRUCTOR SAVE FUNCTIONS ----------------
const saveBiography = () => {
  localStorage.setItem(
    `bio_${user.email}`,
    biography
  );

  alert('Biography saved successfully');
};

const saveResearch = () => {
  localStorage.setItem(
    `research_${user.email}`,
    researchInterests
  );

  alert(
    'Research interests saved successfully'
  );
};

const saveEducation = () => {
  localStorage.setItem(
    `education_${user.email}`,
    education
  );

  alert(
    'Education background saved successfully'
  );
};

return (
    <div className="min-h-screen bg-[#fcfaf7] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#111827]">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2 capitalize">
              {user.role} Account
            </p>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="bg-[#111827] hover:bg-black text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* IMAGE */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#d1fae5] shadow-md">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#ecfdf5] flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  fileInputRef.current.click()
                }
                className="mt-4 bg-[#059669] hover:bg-[#047857] text-white px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Upload Picture
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* USER INFO */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
  <h2 className="text-3xl font-bold text-[#111827]">
    {user.firstName || user.companyName}
  </h2>

  <span className="bg-[#d1fae5] text-[#065f46] px-4 py-2 rounded-full text-sm font-semibold capitalize">
    {user.role}
  </span>
</div>

              <p className="text-gray-500 mt-2">
  {user.email}
</p>

{/* DISPLAY COMPANY BIO */}
{user.role === 'employer' && companyBio && (
  <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl">
    {companyBio}
  </p>
)}
{/* DISPLAY COMPANY ADDRESS */}
{user.role === 'employer' && companyAddress && (
  <div className="mt-4 bg-[#ecfdf5] border border-[#d1fae5] rounded-2xl p-4 max-w-xl">
    <p className="text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
      Company Address
    </p>

    <p className="text-[#065f46] font-medium">
      {companyAddress}
    </p>
  </div>
)}

{/* DISPLAY INSTRUCTOR INFO */}
{user.role === 'instructor' && (
  <div className="mt-5 space-y-4 max-w-3xl">
    {/* BIOGRAPHY */}
    {biography && (
      <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
          Biography
        </p>

        <p className="text-gray-700 whitespace-pre-line">
          {biography}
        </p>
      </div>
    )}

    {/* RESEARCH */}
    {researchInterests && (
      <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
          Research Interests
        </p>

        <p className="text-[#065f46] whitespace-pre-line">
          {researchInterests}
        </p>
      </div>
    )}

    {/* EDUCATION */}
    {education && (
      <div className="bg-[#fefce8] border border-[#fde68a] rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-[#ca8a04] font-bold mb-2">
          Education Background
        </p>

        <p className="text-[#854d0e] whitespace-pre-line">
          {education}
        </p>
      </div>
    )}

    {/* COURSES */}
    {courses.length > 0 && (
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-[#2563eb] font-bold mb-3">
          Courses Taught
        </p>

        <div className="flex flex-wrap gap-2">
          {courses.map((course, index) => (
            <span
              key={index}
              className="bg-[#dbeafe] text-[#1d4ed8] px-3 py-1 rounded-full text-sm font-semibold"
            >
              {course}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

{/* DISPLAY CONTACT INFO */}
{user.role === 'employer' && companyContact && (
  <div className="mt-4 bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 max-w-xl">
    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
      Contact Information
    </p>

    <p className="text-gray-700 whitespace-pre-line">
      {companyContact}
    </p>
  </div>
)}


            </div>
          </div>
        </div>

        {/* STUDENT PROFILE */}
        {user.role === 'student' && (
          <div className="space-y-8">
            {/* FAVORITES */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold text-[#111827] mb-5">
                Favorite Projects & Portfolios
              </h3>

              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((fav, index) => (
                    <div
                      key={index}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 flex justify-between items-center"
                    >
                    <div>
  {fav.type === 'portfolio' ? (
    <>
      <p className="font-semibold text-[#111827]">
        {fav.firstName} {fav.lastName}
      </p>

      <p className="text-gray-500 text-sm mt-1">
        Student Portfolio
      </p>
    </>
  ) : (
    <>
      <p className="font-semibold text-[#111827]">
        {fav.title}
      </p>

      <p className="text-gray-500 text-sm mt-1">
        {fav.course}
      </p>
    </>
  )}
</div>
              <button
  onClick={() => {
    const updatedFavorites =
      favorites.filter(
        (_, i) => i !== index
      );

    setFavorites(updatedFavorites);

    localStorage.setItem(
      `favorites_${user.email}`,
      JSON.stringify(updatedFavorites)
    );
  }}
  className="text-red-500 text-sm font-semibold"
>
  Remove
</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No favorites added yet.
                </p>
              )}
            </div>

            {/* STATS */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold text-[#111827] mb-6">
                Portfolio Statistics
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#f9fafb] rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">
                    Total Projects
                  </p>

                  <h4 className="text-4xl font-bold text-[#059669] mt-2">
                    {
                      studentStats.totalProjects
                    }
                  </h4>
                </div>

                <div className="bg-[#f9fafb] rounded-2xl p-5">
                  <p className="text-gray-400 text-sm mb-3">
                    Languages Used
                  </p>

                  <div className="space-y-2">
                    {Object.entries(
                      studentStats.languagesUsed
                    ).map(([lang, value]) => (
                      <div
                        key={lang}
                        className="flex justify-between"
                      >
                        <span>{lang}</span>

                        <span className="font-semibold text-[#059669]">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLLABORATORS */}
              <div className="mt-8">
                <h4 className="font-bold text-lg mb-4">
                  Top Collaborators
                </h4>

                <div className="flex flex-wrap gap-3">
                  {Object.entries(
  studentStats.topCollaborators
).map(([name, count], index) => (
  <span
    key={index}
    className="bg-[#ecfdf5] text-[#065f46] px-4 py-2 rounded-full text-sm font-semibold"
  >
    {name} ({count} projects)
  </span>
))}
                </div>
              </div>
            </div>

            {/* COMPLETED INTERNSHIPS */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              {/* COMPLETED INTERNSHIPS */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
  <div className="flex justify-between items-center mb-5">
    <h3 className="text-2xl font-bold text-[#111827]">
      Completed Internships
    </h3>

    <button
      onClick={addInternship}
      className="w-10 h-10 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-2xl font-bold flex items-center justify-center"
    >
      +
    </button>
  </div>

  {/* INPUT */}
  <input
    type="text"
    value={newInternship}
    onChange={(e) =>
      setNewInternship(e.target.value)
    }
    placeholder="Add internship..."
    className="w-full mb-5 border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
  />

  <div className="space-y-3">
    {completedInternships.map(
      (internship, index) => (
        <div
          key={index}
          className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 flex justify-between items-center"
        >
          <p>{internship}</p>

          <button
            onClick={() => {
              const updatedInternships =
                completedInternships.filter(
                  (_, i) => i !== index
                );

              setCompletedInternships(
                updatedInternships
              );

              localStorage.setItem(
                `internships_${user.email}`,
                JSON.stringify(
                  updatedInternships
                )
              );
            }}
            className="text-red-500 font-semibold"
          >
            ✕
          </button>
        </div>
      )
    )}
  </div>
</div>

            </div>
          </div>
        )}

        {/* INSTRUCTOR PROFILE */}
        {user.role === 'instructor' && (
          <div className="space-y-8">
           {/* BIO */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
  <h3 className="text-2xl font-bold mb-5">
    Biography
  </h3>

  <textarea
    value={biography}
    onChange={(e) =>
      setBiography(e.target.value)
    }
    rows="5"
    placeholder="Write your biography..."
    className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
  />


</div>

            {/* RESEARCH */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">
                Research Interests
              </h3>

              <textarea
                value={researchInterests}
                onChange={(e) =>
                  setResearchInterests(
                    e.target.value
                  )
                }
                rows="5"
                placeholder="Add research interests..."
                className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
              />
            </div>

            {/* EDUCATION */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">
                Education Background
              </h3>

              <textarea
                value={education}
                onChange={(e) =>
                  setEducation(e.target.value)
                }
                rows="5"
                placeholder="Add education background..."
                className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
              />
            </div>

            {/* COURSES */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">
                Courses Taught
              </h3>

              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  value={courseInput}
                  onChange={(e) =>
                    setCourseInput(e.target.value)
                  }
                  placeholder="Add course..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#10b981]"
                />

                <button
                  onClick={addCourse}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-5 rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {courses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-[#ecfdf5] text-[#065f46] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    {course}

                    <button
                      onClick={() =>
                        removeCourse(course)
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYER PROFILE */}
        {user.role === 'employer' && (
          <div className="space-y-8">
            {/* COMPANY BIO */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">
                Company Biography
              </h3>

            <textarea
  value={companyBio}
  onChange={(e) =>
    setCompanyBio(e.target.value)
  }
  rows="5"
  placeholder="Write company biography..."
  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
/>

<button
  onClick={saveCompanyBio}
  className="mt-5 bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl font-semibold"
>
  Save Biography
</button>
            </div>

           {/* ADDRESS */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
  <h3 className="text-2xl font-bold mb-5">
    Company Address
  </h3>

  <input
    type="text"
    value={companyAddress}
    onChange={(e) =>
      setCompanyAddress(e.target.value)
    }
    placeholder="Enter company address..."
    className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
  />

  <div className="flex gap-3 mt-5">
    <button
      onClick={saveCompanyAddress}
      className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl font-semibold"
    >
      Save Address
    </button>

    <button
      onClick={openGoogleMaps}
      className="bg-[#111827] hover:bg-black text-white px-6 py-3 rounded-xl font-semibold"
    >
      Open Google Maps
    </button>
  </div>
</div>

            {/* CONTACT */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">
                Contact Information
              </h3>

              <textarea
  value={companyContact}
  onChange={(e) =>
    setCompanyContact(
      e.target.value
    )
  }
  rows="4"
  placeholder="Add contact information..."
  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
/>

<button
  onClick={saveCompanyContact}
  className="mt-5 bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl font-semibold"
>
  Save Contact Info
</button>
            </div>

            {/* FAVORITES */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">
                Favorite Projects & Portfolios
              </h3>

              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((fav, index) => (
                    <div
                      key={index}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 flex justify-between items-center"
                    >
                      <div>
  <p className="font-semibold text-[#111827]">
    {fav.title}
  </p>

  <p className="text-gray-500 text-sm mt-1">
    {fav.course}
  </p>
</div>

                      <button
                        onClick={() =>
                          setFavorites((prev) =>
                            prev.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                        className="text-red-500 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No favorites added yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );


};

export default Profile;