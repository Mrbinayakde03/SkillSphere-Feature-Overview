import { useState } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, X } from 'lucide-react';
import { allSkills } from '../data/mockData';

export function ResumeParser({ currentSkills, onSkillsExtracted }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processResume(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processResume(files[0]);
    }
  };

  const processResume = (file) => {
    setFileName(file.name);
    setIsProcessing(true);
    
    // Simulate AI processing with NLP
    setTimeout(() => {
      // Mock skill extraction - randomly select 5-8 skills that aren't already in user's profile
      const availableSkills = allSkills.filter(skill => !currentSkills.includes(skill));
      const numSkillsToExtract = Math.floor(Math.random() * 4) + 5; // 5-8 skills
      const shuffled = [...availableSkills].sort(() => 0.5 - Math.random());
      const skills = shuffled.slice(0, Math.min(numSkillsToExtract, availableSkills.length));
      
      setExtractedSkills(skills);
      setIsProcessing(false);
    }, 2500);
  };

  const handleAddSkills = () => {
    onSkillsExtracted(extractedSkills);
    setExtractedSkills([]);
    setFileName('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setExtractedSkills(extractedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Parser</h2>
            <p className="text-gray-600">Upload your resume to extract skills using AI</p>
          </div>
        </div>

        {/* AI Technology Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">AI-Powered Extraction</h4>
              <p className="text-sm text-purple-700">
                Our system uses Natural Language Processing (NLP) with spaCy and TensorFlow to intelligently parse your resume and identify technical skills, programming languages, frameworks, and tools.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">Processing Resume...</p>
                <p className="text-sm text-gray-600 mb-4">
                  Analyzing "{fileName}" with AI
                </p>
                <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full animate-progress w-full"></div>
                </div>
              </div>
            </div>
          ) : extractedSkills.length > 0 ? (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {extractedSkills.length} Skills Extracted!
                </h3>
                <p className="text-gray-600 mb-6">
                  Review the skills found in your resume and add them to your profile
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {extractedSkills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-blue-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleAddSkills}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-text-primary rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Add to Profile
                  </button>
                  <button
                    onClick={() => {
                      setExtractedSkills([]);
                      setFileName('');
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Upload Your Resume
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your resume here, or click to browse
              </p>
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="resume-upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-text-primary rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, DOC, DOCX
              </p>
            </>
          )}
        </div>

        {/* Current Skills */}
        {currentSkills.length > 0 && !isProcessing && extractedSkills.length === 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-gray-900 mb-4">Current Skills in Your Profile</h3>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map(skill => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
