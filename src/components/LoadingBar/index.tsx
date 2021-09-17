import LinearProgress from '@material-ui/core/LinearProgress';
import { FC, useEffect, useState } from 'react';
import './style.scss';

type LoadingBarPropsType = {
    percentCompleted: number
}

const LoadingBar: FC<LoadingBarPropsType> = ({ percentCompleted }) => {
    const [isDislay, setIsDisplay] = useState(true);

    useEffect(() => {
        if (percentCompleted >= 100) {
            setTimeout(() => {
                setIsDisplay(false)
            }, 500)
        } else {
            setIsDisplay(true);
        }
    }, [percentCompleted])

    return (
        <div className='loading-bar-container'>
            <div style={{
                display: isDislay ? 'flex' : 'none',
                width: `${percentCompleted}%`
            }}
                className='loading-bar-container__bar'>
            </div>
        </div>
    )
}

export default LoadingBar;