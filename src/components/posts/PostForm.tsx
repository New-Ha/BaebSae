import { useState } from 'react';

import { ReactComponent as Avatar } from '../../assets/user_circle.svg';
import { ReactComponent as Photo } from '../../assets/photo.svg';

export default function PostForm() {
    const [tags, setTags] = useState<string[]>([]);
    const [imgFile, setImgFile] = useState<string | null>(null);

    return (
        <form className="post-form">
            <div className="post-form__avatar">
                <Avatar />
            </div>
            <div className="post-form__form">
                {imgFile && (
                    <div className="post-form__img-view">
                        <img src={imgFile} alt="post image" width={100} height={100} />
                        <button type="button">x</button>
                    </div>
                )}
                <textarea
                    className="post-form__textarea"
                    name="content"
                    id="content"
                    placeholder="무슨 일이 있었나요?!"
                    required
                />

                <div className="post-form__hashtag">
                    <div className="post-form__hashtag__outputs">
                        {tags?.length > 0 &&
                            tags.map((tag, idx) => (
                                <span className="post-form__hashtag-tag" key={idx}>
                                    # {tag}
                                </span>
                            ))}
                    </div>
                    <input
                        type="text"
                        className="post-form__input"
                        name="hashtag"
                        id="hashtag"
                        placeholder="해시태그 + 엔터 입력"
                    />
                </div>
                <div className="post-form__submit-area">
                    <div className="post-form__image-area">
                        <label htmlFor="img-input" className="post-form__file-input">
                            <Photo />
                        </label>
                        <input type="file" name="img-input" id="img-input" accept="image/*" className="hidden" />
                    </div>
                    <input type="submit" value="게시" className="post-form__submit-btn" />
                </div>
            </div>
        </form>
    );
}
