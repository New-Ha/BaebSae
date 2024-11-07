import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from 'firebaseApp';
import { useEffect, useState } from 'react';
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
    return <>{init ? <Router isAuthenticated={isAuthenticated} /> : <div>loading...</div>}</>;
}

export default App;
