import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, icon}) => {
    return (
        <div className='metric-card'>
            <div className='metric-info'>
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
            <div className='metric-icon'>
                {icon}
            </div>
        </div>
    )
}

export default MetricCard;