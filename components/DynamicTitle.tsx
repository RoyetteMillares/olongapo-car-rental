import React from 'react';

interface DynamicTitleProps {
    title: string;
    image: string;
    width?: string;
    height?: string;
}

const DynamicTitle: React.FC<DynamicTitleProps> = ({
    title,
    image,
    width,
    height,
}) => {
    return (
        <div className='relative flex overflow-hidden md:p-3 md:m-2'>
            <h3>{title}</h3>
            <img src={image} alt={title} className={`${width} ${height} absolute top-0 left-0`} />
        </div>
    );
};

export default DynamicTitle;
