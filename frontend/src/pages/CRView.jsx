import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle, ArrowLeft, Send } from 'lucide-react';

const CRView = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [cr, setCr] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [action, setAction] = useState('');
    const [comments, setComments] = useState('');

    const [implData, setImplData] = useState({
        actual_start: '',
        actual_end: '',
        status: 'Successful',
        remarks: ''
    });

    const [rcaFile, setRcaFile] = useState(null);


    useEffect(() => {

        const fetchCr = async () => {

            try {

                const res = await api.get(`/cr/${id}`);
                setCr(res.data.cr);
                setHistory(res.data.history);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        fetchCr();

    }, [id]);


    const handleWorkflowSubmit = async (e) => {

        e.preventDefault();

        if (!action || !comments)
            return alert("Action and Comments are required");

        let nextStatus = cr.status;

        if (action === 'Approve') {

            if (cr.status === 'Submitted' && user.role === 'Change Reviewer')
                nextStatus = 'Under Review';

            else if (cr.status === 'Under Review' && user.role === 'InfoSec')
                nextStatus = 'Security Review';

            else if (cr.status === 'Security Review' && user.role === 'Change Approver')
                nextStatus = 'Approved';

        }

        else if (action === 'Reject') {

            nextStatus = 'Closed';

        }

        else if (action === 'Send Back') {

            nextStatus = 'Submitted';

        }

        try {

            await api.post(`/cr/${id}/workflow`, {
                action,
                comments,
                next_status: nextStatus
            });

            window.location.reload();

        } catch (err) {

            console.error(err);
            alert("Failed to update workflow");

        }

    };


    const handleImplementSubmit = async (e) => {

        e.preventDefault();

        const data = new FormData();

        Object.keys(implData).forEach(key =>
            data.append(key, implData[key])
        );

        if (rcaFile)
            data.append('rca_file', rcaFile);

        try {

            await api.post(`/implement/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            window.location.reload();

        } catch (err) {

            console.error(err);
            alert("Failed to save implementation details");

        }

    };


    if (loading)
        return <div className="p-8">Loading Change Request...</div>;

    if (!cr)
        return <div className="p-8 text-red-500 font-bold">CR Not Found</div>;


    // STRICT ROLE + STATUS CONTROL
    const canReview =
        (cr.status === 'Submitted' && user?.role === 'Change Reviewer') ||
        (cr.status === 'Under Review' && user?.role === 'InfoSec') ||
        (cr.status === 'Security Review' && user?.role === 'Change Approver');


    // Implementation allowed only after approval
    const canImplement =
        cr.status === 'Approved' &&
        (user?.role === 'Implementation Team' || user?.role === 'Admin');


    return (

        <div className="space-y-6 max-w-6xl mx-auto">

            <div className="flex items-center gap-4">

                <button
                    onClick={() => navigate('/crs')}
                    className="text-gray-500 hover:text-aai-blue"
                >
                    <ArrowLeft size={24} />
                </button>

                <h2 className="text-2xl font-bold flex-1">
                    Change Request: {cr.cr_id}
                </h2>

                <StatusBadge status={cr.status} />

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                {/* LEFT SIDE */}

                <div className="md:col-span-2 space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border">

                        <h3 className="text-lg font-semibold border-b pb-3 mb-4 text-aai-blue">
                            Core Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">

                            <div>
                                <p className="text-xs text-gray-500">Requester</p>
                                <p className="font-medium text-sm">{cr.requester_name}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="font-medium text-sm">{cr.project_department}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Priority</p>
                                <p className="font-bold text-sm text-amber-500">{cr.priority}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Submitted On</p>
                                <p className="font-medium text-sm">
                                    {new Date(cr.created_at).toLocaleString()}
                                </p>
                            </div>

                        </div>


                        <div className="space-y-4">

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-sm bg-gray-50 p-3 rounded">
                                    {cr.description}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Reason for Change</p>
                                <p className="text-sm bg-gray-50 p-3 rounded">
                                    {cr.reason}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Impacted Systems</p>
                                <p className="text-sm font-medium">
                                    {cr.impacted_users_apps}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* IMPLEMENTATION PANEL */}

                    {canImplement && (

                        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md">

                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-aai-blue">
                                <CheckCircle size={20} />
                                Record Implementation Details
                            </h3>

                            <form onSubmit={handleImplementSubmit} className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">

                                    <input
                                        type="datetime-local"
                                        required
                                        className="border p-2 rounded"
                                        value={implData.actual_start}
                                        onChange={e =>
                                            setImplData({
                                                ...implData,
                                                actual_start: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="datetime-local"
                                        required
                                        className="border p-2 rounded"
                                        value={implData.actual_end}
                                        onChange={e =>
                                            setImplData({
                                                ...implData,
                                                actual_end: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <textarea
                                    placeholder="Implementation Remarks"
                                    className="w-full border p-2 rounded"
                                    rows="2"
                                    value={implData.remarks}
                                    onChange={e =>
                                        setImplData({
                                            ...implData,
                                            remarks: e.target.value
                                        })
                                    }
                                />

                                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Submit Implementation
                                </button>

                            </form>

                        </div>

                    )}

                </div>


                {/* RIGHT PANEL */}

                <div className="space-y-6">

                    {canReview && (

                        <div className="bg-white p-6 rounded-xl border-2 border-aai-light shadow-md">

                            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Your Review is Required
                            </h3>

                            <form onSubmit={handleWorkflowSubmit} className="space-y-4">

                                <select
                                    required
                                    value={action}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                >
                                    <option value="">Select Action...</option>
                                    <option value="Approve">Approve</option>
                                    <option value="Reject">Reject</option>
                                    <option value="Send Back">Send Back with Comments</option>
                                </select>

                                <textarea
                                    rows="3"
                                    required
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Provide justification..."
                                />

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-aai-blue text-white py-3 rounded-lg font-semibold hover:bg-aai-dark"
                                >
                                    <Send size={16} />
                                    Submit Review
                                </button>

                            </form>

                        </div>

                    )}

                    <div className="bg-white p-6 rounded-xl shadow-sm border">

                        <h3 className="font-semibold border-b pb-3 mb-4">
                            Approval History
                        </h3>

                        {history.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No actions taken yet.
                            </p>
                        )}

                        {history.map((h, i) => (

                            <div key={i} className="mb-4">

                                <p className="text-sm font-semibold">
                                    {h.action}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {h.username} • {h.role_name}
                                </p>

                                <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                                    {h.comments}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default CRView;