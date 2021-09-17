import loadable from '../../../../../utils/loadable';
import LoadingPage from '../../../../../components/LoadingPage';

export default loadable(() => import('./index1'), {
    fallback: <LoadingPage />,
});