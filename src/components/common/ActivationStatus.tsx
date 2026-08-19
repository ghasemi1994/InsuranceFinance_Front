import React from 'react'


/**active or not*/
interface IProps {
    status: boolean
}
export default function ActivationStatus({ status }: IProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: status ? '#4CAF50' : '#F44336',
                boxShadow: status ? '0 0 8px #4CAF50' : '0 0 8px #F44336'
            }} />
            <span>{status ? 'فعال' : 'غیرفعال'}</span>
        </div>
    )
}
