import React from 'react';
import StarIcon from '../ui/StarIcon';

interface Props {
    value: number;
}

const Rating = ({ value }: Props) => {
    const data = new Array(5).fill('');

    const fullStars = Math.floor(value);
    const halfStar = value - fullStars >= 0.1;

    return (
        <div
            className="flex items-center space-x-1"

        >
            {data.map((_, index) => {
                return index + 1 <= fullStars ? (
                    <StarIcon.Full key={index} />
                ) : halfStar && index + 1 === fullStars + 1
                    ? (
                        <StarIcon.Half key={index} />
                    ) : (
                        <StarIcon.Empty key={index} />
                    );
            })}
            <span className="text-gray-500
                font-semibold text-xs
            ">{value}</span>
        </div>
    );
};

export default Rating;
