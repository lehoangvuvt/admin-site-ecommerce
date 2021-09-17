import Main from '../../../../../components/Main';
import AccountsReport from './AccountsReport';
import './style.scss';

const MainAccountsReport = () => {
    return (
        <Main
            title1={'Customer report'}
            title2={'Accounts'}
            children={<AccountsReport />}
        />
    )
}

export default MainAccountsReport;