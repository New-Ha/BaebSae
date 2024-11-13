import { doc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { db, storage } from 'firebaseApp';

export const postListRef = (postId: string) => doc(db, 'posts');

export const postRef = (postID: string) => doc(db, 'posts', postID);

export const imageRef = (imageUrl: string) => ref(storage, imageUrl);

export const storageRef = (key: string) => ref(storage, key);

export const fiendRef = (userId: string) => doc(db, 'friend', userId);

export const partnerRef = (userId: string) => doc(db, 'partner', userId);
