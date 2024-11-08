import { createBrowserRouter, RouterProvider, RouteObject, Navigate } from 'react-router-dom';

import { ROUTE_PATH } from 'constants/route';
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
import MainLayout from 'components/layout/MainLayout';

interface RouterProps {
    isAuthenticated: boolean;
}

const authenticatedRoutes: RouteObject[] = [
    {
        path: '',
        element: <MainLayout />,
        children: [
            { path: ROUTE_PATH.HOME, element: <HomePage /> },
            { path: ROUTE_PATH.POST, element: <PostListPage /> },
            { path: ROUTE_PATH.POST_CREATE, element: <CreatePostPage /> },
            { path: ROUTE_PATH.POST_EDIT, element: <PostEditPage /> },
            { path: ROUTE_PATH.POST_DETAIL, element: <PostDetailPage /> },
            { path: ROUTE_PATH.SEARCH, element: <SearchPage /> },
            { path: ROUTE_PATH.BOOKMARKS, element: <BookmarksPage /> },
            { path: ROUTE_PATH.POPULAR, element: <PopularPage /> },
            { path: ROUTE_PATH.PROFILE, element: <ProfilePage /> },
            { path: ROUTE_PATH.PROFILE_EDIT, element: <ProfileEditPage /> },
            { path: ROUTE_PATH.NOTI, element: <NotificationsPage /> },
        ],
    },
];

const unauthenticatedRoutes: RouteObject[] = [
    { path: ROUTE_PATH.LOGIN, element: <LoginPage /> },
    { path: ROUTE_PATH.SIGNUP, element: <SignupPage /> },
    { path: '*', element: <Navigate replace to={ROUTE_PATH.LOGIN} /> },
];

const createRoutes = (isAuthenticated: boolean): RouteObject[] =>
    isAuthenticated ? authenticatedRoutes : unauthenticatedRoutes;

export default function Router({ isAuthenticated }: RouterProps) {
    const router = createBrowserRouter(createRoutes(isAuthenticated));

    return <RouterProvider router={router} />;
}
