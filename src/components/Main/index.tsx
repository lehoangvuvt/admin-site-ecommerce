import { FC } from "react";
import { connect } from "react-redux";
import { RootReducerType } from "../../containers/reducer";
import './style.scss';

type MainPropsType = {
    title1?: string,
    title2?: string,
    children: JSX.Element | null,
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        config: state.global.config,
    }
}

const Main: FC<MainPropsType & ReturnType<typeof mapStateToProps>> = ({ title1, title2, children, config }) => {
    const { collapsed, darkMode } = config;

    return (
        <div
            data-theme={darkMode ? "dark-main" : "light-main"}
            className={collapsed ? 'main main--collapsed' : 'main'}>
            <div className='main__header'>
                <div className='main__header__left'>
                    <div className='main__header__left__top'>
                        <h1>{title1}</h1>
                    </div>
                    <div className='main__header__left__bottom'>
                        <h1>{title2}</h1>
                    </div>
                </div>
            </div>
            {children ?
                children
                :
                <h1>Empty</h1>
            }
        </div >
    )
}

export default connect(mapStateToProps)(Main);