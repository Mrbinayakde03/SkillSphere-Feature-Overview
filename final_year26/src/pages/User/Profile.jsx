export function UserProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Resume</h1>
        <p className="text-gray-600">Manage your profile, skills, and resume</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" defaultValue="john@university.edu" />
              </div>
                <button className="px-6 py-2 bg-blue-600 text-text-primary rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">Resume</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600">Drag and drop your resume here or click to upload</p>
            </div>
          </div>
        </div>

        {/* Skills Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
          <div className="space-y-2">
            {['Python', 'React', 'JavaScript', 'UI/UX', 'Web Development'].map(skill => (
              <div key={skill} className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">{skill}</span>
                <button className="text-red-600 hover:text-red-700 text-xs">✕</button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            + Add Skill
          </button>
        </div>
      </div>
    </div>
  );
}
