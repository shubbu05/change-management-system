import React from 'react';

const StatusBadge = ({ status }) => {
    const statusConfig = {
        'Submitted': 'bg-gray-100 text-gray-800 border-gray-200',
        'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Security Review': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Final Approval': 'bg-purple-100 text-purple-800 border-purple-200',
        'Assigned for Implementation': 'bg-blue-100 text-blue-800 border-blue-200',
        'Implemented': 'bg-green-100 text-green-800 border-green-200',
        'Closed': 'bg-gray-800 text-gray-100 border-gray-900',
        'Failed': 'bg-red-100 text-red-800 border-red-200',
    };

    const classes = statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
