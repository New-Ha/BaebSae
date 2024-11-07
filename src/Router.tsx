import { Route, Routes } from 'react-router-dom';

import { ROUTE_PATH } from './constants/route';
import HomePage from 'pages/home';
import PostListPage from 'pages/posts';
import CreatePostPage from 'pages/posts/create';
import PostEditPage from 'pages/posts/edit';
import PostDetailPage from 'pages/posts/detail';
import SearchPage from 'pages/search';
import BookmarksPage from 'pages/bookmarks';
import PopularPage from 'pages/popular';
import ProfilePage from 'pages/profile';
import ProfileEditPage from 'pages/profile/edit';
import NotificationsPage from 'pages/notifications';
import LoginPage from 'pages/user/login';
import SignupPage from 'pages/user/signup';

export default function Router() {
    return (
        <Routes>
            <Route path={ROUTE_PATH.HOME} element={<HomePage />} />
            <Route path={ROUTE_PATH.POST} element={<PostListPage />} />
            <Route path={ROUTE_PATH.POST_CREATE} element={<CreatePostPage />} />
            <Route path={ROUTE_PATH.POST_EDIT} element={<PostEditPage />} />
            <Route path={ROUTE_PATH.POST_DETAIL} element={<PostDetailPage />} />
            <Route path={ROUTE_PATH.SEARCH} element={<SearchPage />} />
            <Route path={ROUTE_PATH.BOOKMARKS} element={<BookmarksPage />} />
            <Route path={ROUTE_PATH.POPULAR} element={<PopularPage />} />
            <Route path={ROUTE_PATH.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTE_PATH.PROFILE_EDIT} element={<ProfileEditPage />} />
            <Route path={ROUTE_PATH.NOTI} element={<NotificationsPage />} />
            <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
            <Route path={ROUTE_PATH.SIGNUP} element={<SignupPage />} />
            <Route path={ROUTE_PATH.NOT_FOUND} element={<LoginPage />} />
        </Routes>
    );
}
