import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import { AuthContextProvider } from 'context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>,
);
