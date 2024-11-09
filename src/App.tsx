import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from 'firebaseApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Router from 'Router';

function App() {
    const auth = getAuth(app);
    const [init, setInit] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth.currentUser);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }

            setInit(true);
        });
    }, [auth]);
    return (
        <>
            <ToastContainer autoClose={1500} hideProgressBar newestOnTop />
            {init ? <Router isAuthenticated={isAuthenticated} /> : <div>loading...</div>}
        </>
    );
}

export default App;
