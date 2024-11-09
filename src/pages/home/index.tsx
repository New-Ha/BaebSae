import Header from 'components/Header';
import PostForm from 'components/posts/PostForm';

export default function HomePage() {
    return (
        <main className="home">
            <Header title="Home" />
            <PostForm />
        </main>
    );
}
