import { Tooltip } from "@material-ui/core";
import { FC, useState } from "react";
import './style.scss';

type InfoPropsType = {
    content: string,
}

const Info: FC<InfoPropsType> = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='tooltip-container'>
            <div className='tooltip-container__icon'>
                <i
                    onMouseOver={() => { setIsOpen(true) }}
                    onMouseLeave={() => { setIsOpen(false) }}
                    style={{ cursor: 'pointer' }} className="fas fa-info-circle"></i>
            </div>

            <div
                style={{ display: isOpen ? 'flex' : 'none' }}
                className='tooltip-container__modal'>
                {content}
            </div>
        </div >
    )
}

export default Info;