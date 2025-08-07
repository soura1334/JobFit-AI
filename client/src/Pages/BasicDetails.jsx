import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Target,
    ArrowRight,
    CheckCircle,
    Upload,
    FileText,
    Sparkles
} from 'lucide-react';

const BasicDetails = () => {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Career Goals
        targetRole: '',
        // targetSalary: '',
        // Resume
        resumeFile: null,
        // Profile completion
        profileCompleted: false
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (file) => {
        setFormData(prev => ({ ...prev, resumeFile: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate profile completion
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mark profile as completed
            setFormData(prev => ({ ...prev, profileCompleted: true }));

            // Navigate to dashboard after successful submission
            setTimeout(() => {
                // console.log('Profile completed successfully!');
                alert('Profile completed! Ready to find your dream job!');

                navigate('/dashboard');

            }, 1000);

        } catch (error) {
            console.error('Profile completion failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        return formData.targetRole &&
            // formData.targetSalary &&
            formData.resumeFile;
    };

    if (formData.profileCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md mx-4"
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Complete!</h2>
                    <p className="text-gray-600 mb-4">
                        Welcome to your personalized career dashboard. Let's help you find your dream job!
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-3 tracking-tight">
                        Complete Your Profile
                    </h1>
                    <p className="text-red-500 font-semibold italic text-base md:text-lg">
                        Please fill out the form below to complete your profile.
                    </p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Career Goals Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Career Goals</h2>
                            </div>

                            <div className="grid grid-cols-1  gap-6">
                                {/* md:grid-cols-2 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Role *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.targetRole}
                                        onChange={(e) => handleInputChange('targetRole', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                                        placeholder="e.g., Senior React Developer"
                                    />
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Salary (Annual) *
                                    </label>
                                    <input
                                        type="text" required
                                        value={formData.targetSalary}
                                        onChange={(e) => handleInputChange('targetSalary', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                                        placeholder="e.g., $70,000"
                                    />
                                </div> */}

                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Resume Upload Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Upload Your Resume</h2>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                {formData.resumeFile ? (
                                    <div className="space-y-4">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                        <div>
                                            <p className="text-lg font-medium text-gray-900">{formData.resumeFile.name}</p>
                                            <p className="text-green-600 font-medium">Resume uploaded successfully!</p>
                                            <button
                                                type="button"
                                                onClick={() => handleFileUpload(null)}
                                                className="mt-2 text-blue-600 hover:text-blue-700 underline transition-colors"
                                            >
                                                Upload different file
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                                        <div>
                                            <p className="text-lg font-medium text-gray-900">Upload your resume *</p>
                                            <p className="text-gray-600">Drag and drop your PDF file here, or click to browse</p>
                                            <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileUpload(e.target.files[0])}
                                            className="hidden"
                                            id="resume-upload"
                                            required
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose File
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-blue-800">
                                        <strong>Pro Tip:</strong> A well-formatted resume helps our AI provide better job recommendations and career insights tailored specifically to your experience.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isFormValid()}
                                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl relative overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-md transition-opacity duration-500 group-hover:opacity-40 pointer-events-none"></span>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin motion-safe:animate-spin-slow"></div>
                                        <span className="animate-pulse">Completing Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="transition-transform duration-300 group-hover:-translate-x-1">Complete Setup</span>
                                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 italic">
                        This information helps us provide personalized job recommendations and career insights
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BasicDetails;