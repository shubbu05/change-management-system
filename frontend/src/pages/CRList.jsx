import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, Eye } from 'lucide-react';

const CRList = () => {
    const [crs, setCrs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCrs = async () => {
            try {
                const res = await api.get('/cr');
                setCrs(res.data);
            } catch (err) {
                console.error("Failed to fetch CRs");
            } finally {
                setLoading(false);
            }
        };
        fetchCrs();
    }, []);

    const filteredCrs = crs.filter(cr =>
        cr.cr_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.project_department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Change Requests</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and track ITIL Change Requests</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search CR ID or Status..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-aai-light focus:border-aai-light w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CR ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Planned Start</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading Change Requests...</td></tr>
                        ) : filteredCrs.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No Change Requests Found.</td></tr>
                        ) : (
                            filteredCrs.map(cr => (
                                <tr key={cr.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-aai-blue">{cr.cr_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cr.project_department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`font-semibold ${cr.priority === 'P1' ? 'text-red-600' : cr.priority === 'P2' ? 'text-amber-500' : 'text-green-600'}`}>
                                            {cr.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={cr.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(cr.planned_start).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/crs/${cr.id}`} className="text-aai-blue hover:text-aai-light inline-flex items-center gap-1">
                                            <Eye size={16} /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default CRList;
