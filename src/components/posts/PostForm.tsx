import { useContext, useState } from 'react';

import { ReactComponent as DefaultAvatar } from '../../assets/bapsae.svg';
import { ReactComponent as Photo } from '../../assets/photo.svg';
import { toast } from 'react-toastify';
import AuthContext from 'context/AuthContext';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from 'firebaseApp';
import { addDoc, collection } from 'firebase/firestore';

interface PostFormType {
    content: string;
    hashtags?: string[];
    imageUrl?: string;
}

export default function PostForm() {
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState<PostFormType>({
        content: '',
        hashtags: undefined,
        imageUrl: undefined,
    });
    const [tag, setTag] = useState<string>('');
    const [imgFile, setImgFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value);
    };

    const handleKeyUpTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            if (post.hashtags?.includes(tag)) {
                toast.error('같은 태그가 존재합니다.');
            } else {
                setPost(prev => ({ ...prev, hashtags: [...(prev.hashtags ?? []), e.currentTarget.value] }));
            }

            setTag('');
        }
    };

    const preventSubmit = (e: any) => {
        if (e.detail === 0) {
            e.preventDefault();
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
        const storageRef = ref(storage, key);

        try {
            // image를 먼저 storage에 upload
            let imgUrl = '';
            if (imgFile) {
                const data = await uploadString(storageRef, imgFile, 'data_url');
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
                email: user?.email,
                name: user?.displayName || '사용자',
                avatar: user?.photoURL || '',
            });
            toast.success('게시글을 생성했습니다.');
            setPost(prev => ({ ...prev, content: '', hashtags: undefined, imageUrl: undefined }));
            setImgFile(null);
            setTag('');
        } catch (error: any) {
            console.log(error);
            toast.error('게시글 생성 중 문제가 발생하였습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="post-form" onSubmit={handleSubmitPost}>
            <div className="post-form__avatar">
                {user?.photoURL ? <img src={user.photoURL} alt="user avatar" /> : <DefaultAvatar />}
            </div>
            <div className="post-form__form">
                {imgFile && (
                    <div className="post-form__img-view">
                        <img src={imgFile} alt="attachment" width={100} height={100} />
                        <button type="button" onClick={handleDeleteImg}>
                            x
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

                <div className="post-form__hashtag">
                    <div className="post-form__hashtag__outputs">
                        {post.hashtags &&
                            post.hashtags.length > 0 &&
                            post.hashtags.map((tag, idx) => (
                                <span className="post-form__hashtag-tag" key={idx} onClick={() => handleDeleteTag(tag)}>
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
                        placeholder="해시태그 + 엔터 입력"
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
                            onClick={preventSubmit}
                            className="hidden"
                        />
                    </div>
                    <input type="submit" value="게시" className="post-form__submit-btn" disabled={isSubmitting} />
                </div>
            </div>
        </form>
    );
}
