import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { categories, allSkills } from '../data/mockData';

export function EventFilters({ filters, onFilterChange }) {
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  const handleSkillToggle = (skill) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    
    onFilterChange({ ...filters, skills: newSkills });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <h3 className="font-bold text-gray-900">Filter Events</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Skills Filter */}
      <div className="mt-4">
        <button
          onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Filter className="w-4 h-4" />
          <span>Filter by Skills ({filters.skills.length} selected)</span>
        </button>

        {showSkillsDropdown && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {allSkills.map(skill => (
                <label key={skill} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Selected Skills */}
        {filters.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => handleSkillToggle(skill)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
