import { useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { deleteObject, getDownloadURL, uploadString } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storageRef, userDocumentRef } from 'constants/refs';
import { toast } from 'react-toastify';

import styles from './profile.module.scss';
import { ReactComponent as DefaultAvatar } from '../../assets/bapsae_icon.svg';
import { ReactComponent as Setting } from '../../assets/setting.svg';
import { ReactComponent as Photo } from '../../assets/photo_fill.svg';
import { ReactComponent as Delete } from '../../assets/circle_x.svg';
import { updateDoc } from 'firebase/firestore';

export default function ProfileSetForm() {
    const STORAGE_DOWNLOAD_URL_STR = 'https://firebasestorage.googleapis.com';
    const { user } = useContext(AuthContext);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>((user?.displayName as string) || '사용자');
    const [imgUrl, setImgUrl] = useState<string | null>((user?.photoURL as string) || null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleDeleteImg = () => {
        setImgUrl(null);
    };

    const handleImgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
                const result = (e.currentTarget as FileReader).result;
                if (result) {
                    setImgUrl(result as string);
                }
            };
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const key = `${user?.uid}/${crypto.randomUUID()}`;
        let newImgUrl = null;

        try {
            if (user) {
                if (user?.photoURL && user.photoURL.includes(STORAGE_DOWNLOAD_URL_STR)) {
                    await deleteObject(storageRef(user.photoURL)).catch(error => {
                        console.log(error);
                    });
                }

                if (imgUrl) {
                    const data = await uploadString(storageRef(key), imgUrl, 'data_url');
                    newImgUrl = await getDownloadURL(data?.ref);
                }

                await updateProfile(user, {
                    displayName,
                    photoURL: newImgUrl,
                });

                await updateDoc(userDocumentRef(user.uid), {
                    displayName,
                    photoURL: newImgUrl,
                });

                toast.success('프로필이 변경되었습니다.');
                setIsEdit(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('프로필 수정 중 문제가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.profile__settings}>
            <form onSubmit={handleProfileSubmit}>
                {isEdit ? (
                    <input
                        type="submit"
                        className={styles.profile__settings__submit}
                        disabled={isSubmitting}
                        value="확인"
                    />
                ) : (
                    <button type="button" className={styles.profile__settings_btn} onClick={() => setIsEdit(true)}>
                        <Setting />
                    </button>
                )}
                <div className={styles.profile__user_info}>
                    <div className={styles.profile__user_info__avatar}>
                        {imgUrl ? <img src={imgUrl} alt="user avatar" /> : <DefaultAvatar />}
                        {isEdit && (
                            <div className={styles.profile__user_info__avatar_input}>
                                <button
                                    type="button"
                                    className={styles.profile__user_info__avatar_input_reset}
                                    onClick={handleDeleteImg}>
                                    <Delete />
                                </button>
                                <label htmlFor="img-input">
                                    <Photo />
                                </label>
                                <input
                                    type="file"
                                    name="img-input"
                                    id="img-input"
                                    accept="image/*"
                                    onChange={handleImgFileUpload}
                                    className={styles.hidden}
                                />
                            </div>
                        )}
                    </div>
                    {isEdit ? (
                        <div className={styles.profile__user_info__edit}>
                            <input
                                type="text"
                                placeholder={displayName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className={styles.profile__user_info__name}>{displayName}</div>
                    )}
                    <div className={styles.profile__user_info__email}>{user?.email}</div>
                </div>
            </form>
        </div>
    );
}
