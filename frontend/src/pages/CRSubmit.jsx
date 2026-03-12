import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CRSubmit = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        project_department: '',
        description: '',
        reason: '',
        planned_start: '',
        planned_end: '',
        priority: 'P3',
        impacted_users_apps: ''
    });

    const [files, setFiles] = useState({
        implementation_plan: null,
        rollback_plan: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (files.implementation_plan) {
            data.append('implementation_plan', files.implementation_plan);
        }

        if (files.rollback_plan) {
            data.append('rollback_plan', files.rollback_plan);
        }

        try {
            await api.post('/cr', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/crs');

        } catch (err) {
            console.error(err);
            alert("Failed to submit Change Request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-blue-900 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold">Submit New Change Request</h2>
                <p className="text-blue-200 text-sm mt-1">
                    Submit a new ITIL Change Request for review
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Project / Department */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Project / Department *
                        </label>

                        <input
                            type="text"
                            name="project_department"
                            required
                            value={formData.project_department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                            placeholder="e.g., Network Infrastructure"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Priority *
                        </label>

                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none bg-white"
                        >
                            <option value="P3">P3 - Low</option>
                            <option value="P2">P2 - Medium</option>
                            <option value="P1">P1 - High (Urgent)</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description of Change *
                        </label>

                        <textarea
                            name="description"
                            required
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                            placeholder="Detailed description of what is changing..."
                        />
                    </div>

                    {/* Reason */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Reason for Change *
                        </label>

                        <textarea
                            name="reason"
                            required
                            rows="2"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                            placeholder="Why is this change necessary?"
                        />
                    </div>

                    {/* Planned Start */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Planned Start Date & Time *
                        </label>

                        <input
                            type="datetime-local"
                            name="planned_start"
                            required
                            value={formData.planned_start}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                        />
                    </div>

                    {/* Planned End */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Planned End Date & Time *
                        </label>

                        <input
                            type="datetime-local"
                            name="planned_end"
                            required
                            value={formData.planned_end}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                        />
                    </div>

                    {/* Impacted Users */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Users / Applications Impacted *
                        </label>

                        <input
                            type="text"
                            name="impacted_users_apps"
                            required
                            value={formData.impacted_users_apps}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                            placeholder="e.g., ERMS, All Head Office Users"
                        />
                    </div>

                    {/* Implementation Plan */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Implementation Plan (PDF/Docx)
                        </label>

                        <input
                            type="file"
                            name="implementation_plan"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800"
                        />
                    </div>

                    {/* Rollback Plan */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rollback Plan (PDF/Docx)
                        </label>

                        <input
                            type="file"
                            name="rollback_plan"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                        />
                    </div>

                </div>

                {/* Buttons */}
                <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">

                    <button
                        type="button"
                        onClick={() => navigate('/crs')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-blue-900 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Change Request"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default CRSubmit;