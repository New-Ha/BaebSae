import { doc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { db, storage } from 'firebaseApp';

export const postListDocumentRef = () => doc(db, 'posts');

export const postDocumentRef = (postID: string) => doc(db, 'posts', postID);

export const storageRef = (key: string) => ref(storage, key);

export const friendDocumentRef = (userId: string) => doc(db, 'friend', userId);

export const partnerDocumentRef = (userId: string) => doc(db, 'partner', userId);

export const bookmarksDocumentRef = (userId: string) => doc(db, 'bookmarks', userId);
