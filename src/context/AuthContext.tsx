import { userDocumentRef } from 'constants/refs';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import { app } from 'firebaseApp';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface UserType {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    [key: string]: any;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserType | null;
}
interface AuthProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
});

export const AuthContextProvider = ({ children }: AuthProps) => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [user, setUser] = useState<UserType | null>(null);

    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, curUser => {
            setAuthUser(curUser);
        });
    }, [auth]);

    useEffect(() => {
        if (authUser) {
            onSnapshot(userDocumentRef(authUser.uid), snapshot => {
                setUser((snapshot.data() as UserType) || null);
            });
        }
    }, [authUser]);

    return <AuthContext.Provider value={{ isAuthenticated: !!authUser, user }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
