import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi'
import { NavigationItemType } from '../../containers/types';
import { useRouter } from '../../hooks/router';
import Item from './item';

type MenuPropsType = {
    title: string,
    items: Array<NavigationItemType>,
};

const Section: FC<MenuPropsType> = ({ title, items }) => {
    return (
        <div className="left-sidebar__section">
            <div className="left-sidebar__section__header">
                <p>{title}</p>
            </div>
            <div className="left-sidebar__section__menu-container">
                {items.map((item1, i1) =>
                    <div className='left-sidebar__section__menu-container__menu left-sidebar__section__menu-container__menu--lv1'>
                        <Item key={i1} {...item1} />
                        <div
                            id={`${item1.title}`}
                            className='left-sidebar__section__menu-container__menu left-sidebar__section__menu-container__menu--lv2'>
                            {item1.items.map((item2, i2) =>
                                <div
                                    id={`${item2.title}`}
                                    className='left-sidebar__section__menu-container__menu left-sidebar__section__menu-container__menu--lv3'>
                                    <Item key={i2} {...item2} />
                                    {item2.items.map((item3, i3) =>
                                        <div
                                            id={`${item3.title}`}
                                            className='left-sidebar__section__menu-container__menu left-sidebar__section__menu-container__menu--lv4'>
                                            <Item key={i3} {...item3} />
                                            {item3.items.map((item4, i4) =>
                                                <div
                                                    id={`${item4.title}`}
                                                    className='left-sidebar__section__menu-container__menu left-sidebar__section__menu-container__menu--lv5'>
                                                    <Item key={i4} {...item4} />
                                                    {item4.items.map((item5, i5) =>
                                                        <div
                                                            id={`${item5.title}`}
                                                            className='left-sidebar__section__menu-container__menu left-sidebar__section__menu-container__menu--lv6'>
                                                            <Item key={i5} {...item5} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Section;
