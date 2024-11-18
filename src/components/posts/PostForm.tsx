import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, uploadString } from 'firebase/storage';
import { db } from 'firebaseApp';
import { toast } from 'react-toastify';
import { PostType } from 'pages/home';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Photo } from '../../assets/photo.svg';
import { ReactComponent as Reset } from '../../assets/circle_x.svg';
import { ROUTE_PATH } from 'constants/route';
import { postDocumentRef, storageRef } from 'constants/refs';

interface PostFormType {
    id?: string;
    content: string;
    hashtags?: string[];
    imageUrl?: string;
}

export default function PostForm() {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState<PostFormType>({
        content: '',
        hashtags: undefined,
        imageUrl: undefined,
    });
    // 현재 입력하는 태그값
    const [tag, setTag] = useState<string>('');
    const [imgFile, setImgFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const isEdit = !!params.postId;

    const handleChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value.trim());
    };

    const handleKeyUpTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 32 && tag.trim() !== '') {
            if (post.hashtags?.includes(tag)) {
                toast.error('같은 태그가 존재합니다.');
            } else {
                setPost(prev => ({ ...prev, hashtags: [...(prev.hashtags ?? []), tag] }));
            }
            setTag('');
        }
    };

    const handleDeleteTag = (tag: string) => {
        const newHashtags = post.hashtags?.filter(val => val !== tag) ?? [];
        setPost(prev => ({ ...prev, hashtags: newHashtags }));
    };

    const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPost(prev => ({ ...prev, content: e.target.value }));
    };

    const handleImgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
                const result = (e.currentTarget as FileReader).result;
                if (result) {
                    setImgFile(result as string);
                }
            };
        }
    };

    const handleDeleteImg = () => {
        setImgFile(null);
    };

    const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const key = `${user?.uid}/${crypto.randomUUID()}`;

        try {
            if (isEdit && post.id) {
                if (post.imageUrl) {
                    await deleteObject(storageRef(post.imageUrl as string)).catch(error => {
                        toast.error('게시글 수정 중 이미지 업로드에 실패하였습니다.');
                    });
                }

                let imgUrl = '';
                if (imgFile) {
                    const data = await uploadString(storageRef(key), imgFile, 'data_url');
                    imgUrl = await getDownloadURL(data.ref);
                }

                await updateDoc(postDocumentRef(post.id), {
                    content: post.content,
                    hashtags: post.hashtags || [],
                    imageUrl: imgFile ? imgUrl : null,
                });
                toast.success('게시글이 수정되었습니다.');
                navigate(-1);
            } else {
                // image를 먼저 storage에 upload
                let imgUrl = '';
                if (imgFile) {
                    const data = await uploadString(storageRef(key), imgFile, 'data_url');
                    imgUrl = await getDownloadURL(data.ref);
                }

                // upload된 image download url을 포함해 post upload
                await addDoc(collection(db, 'posts'), {
                    content: post.content,
                    hashtags: post.hashtags || [],
                    imageUrl: imgUrl || '',
                    createdAt: new Date()?.toLocaleDateString('ko', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    uid: user?.uid,
                });
                toast.success('게시글을 생성했습니다.');
                navigate(ROUTE_PATH.HOME);
            }
            setPost(prev => ({ ...prev, content: '', hashtags: undefined, imageUrl: undefined }));
            setImgFile(null);
            setTag('');
        } catch (error: any) {
            console.log(error);
            if (isEdit) {
                toast.error('게시글 수정 중 문제가 발생하였습니다.');
            } else {
                toast.error('게시글 생성 중 문제가 발생하였습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPost = useCallback(async () => {
        if (params.postId) {
            const docSnap = await getDoc(postDocumentRef(params.postId));
            setPost({ ...(docSnap.data() as PostType), id: docSnap.id });
            setImgFile(docSnap.data()?.imageUrl);
        }
    }, [params.postId]);

    useEffect(() => {
        if (params.postId) {
            getPost();
        }
    }, [params.postId, getPost]);

    return (
        <form className="post-form" onSubmit={handleSubmitPost}>
            <div className="post-form__avatar">
                {user?.photoURL ? <img src={user.photoURL} alt="user avatar" /> : <DefaultAvatar />}
            </div>
            <div className="post-form__form">
                {imgFile && (
                    <div className="post-form__img-view">
                        <img src={imgFile} alt="attachment" />
                        <button type="button" onClick={handleDeleteImg}>
                            <Reset />
                        </button>
                    </div>
                )}
                <textarea
                    className="post-form__textarea"
                    name="content"
                    id="content"
                    value={post.content}
                    onChange={handleChangeTextarea}
                    placeholder="무슨 일이 있었나요?!"
                    required
                />

                <div className="post-form__hashtags">
                    <div className="post-form__hashtags__outputs">
                        {post.hashtags &&
                            post.hashtags.length > 0 &&
                            post.hashtags.map((tag, idx) => (
                                <span
                                    className="post-form__hashtags-tag"
                                    key={idx}
                                    onClick={() => handleDeleteTag(tag)}>
                                    # {tag}
                                </span>
                            ))}
                    </div>
                    <input
                        type="text"
                        className="post-form__hash-input"
                        name="hashtag"
                        id="hashtag"
                        value={tag}
                        onChange={handleChangeTag}
                        onKeyUp={handleKeyUpTag}
                        placeholder="해시태그 + 스페이스바 입력"
                    />
                </div>
                <div className="post-form__submit-area">
                    <div className="post-form__image-area">
                        <label htmlFor="img-input">
                            <Photo />
                        </label>
                        <input
                            type="file"
                            name="img-input"
                            id="img-input"
                            accept="image/*"
                            onChange={handleImgFileUpload}
                            className="hidden"
                        />
                    </div>
                    <input
                        type="submit"
                        value={isEdit ? '수정' : '게시'}
                        className="post-form__submit-btn"
                        disabled={isSubmitting}
                    />
                </div>
            </div>
        </form>
    );
}
