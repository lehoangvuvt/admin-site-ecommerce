import React, { FC } from 'react'
import { connect } from 'react-redux'
import { RootReducerType } from '../../containers/reducer'
import Section from './Section';
import './style.scss';

const mapStateToProps = (state: RootReducerType) => {
    return {
        navigation: state.global.navigation,
        config: state.global.config,
    }
}

const Sidebar: FC<ReturnType<typeof mapStateToProps>> = ({ navigation, config }) => {
    const { collapsed, darkMode } = config;

    return (
        <div
            data-theme={darkMode ? "dark-sidebar" : "light-sidebar"}
            className={collapsed ? "left-sidebar left-sidebar--collapsed" : 'left-sidebar'}>
            <div className="left-sidebar__logo">
                <img src='/uploads/images/logo.png' />
            </div>
            {navigation.map((section, i) =>
                <Section
                    key={i}
                    items={section.items}
                    title={section.title}
                />
            )}
        </div>

    )
}

export default connect(mapStateToProps)(Sidebar);
