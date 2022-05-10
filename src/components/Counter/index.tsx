import React, { useEffect, useState } from 'react';


interface IProps {
    initialValue: number;
    increment: number;
    step?: number;
    msStep?: number;
    msDelayStart?: number;
}

const Counter = ({initialValue, increment, step = 1, msStep = 40, msDelayStart = 0, ...props} : IProps) => {

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setTimeout(() => {
            if (value === initialValue + increment) return;

            if (increment < 0) step = -step;

            let newValue = value + step;
            if ((increment > 0 && newValue > initialValue + increment) ||
                (increment < 0 && newValue < initialValue + increment)) newValue = initialValue + increment;

            setValue(newValue);
        }, (value === initialValue ? msDelayStart : 0) + msStep);        
    }, [value]);


    return (
        <div {...props}>
            {value}
        </div>    
    );
}

export default Counter;