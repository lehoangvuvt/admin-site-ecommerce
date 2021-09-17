import loadable from '../../../../../utils/loadable';
import LoadingPage from '../../../../../components/LoadingPage';
import './style.scss';

export default loadable(() => import('./index'), {
    fallback: <LoadingPage />,
});