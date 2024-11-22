import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PeopleYouMayKnow from '../components/PeopleYouMayKnow';
import Trends from '../components/Trends';
import FeedItem from '../components/FeedItem';
import FeedForm from '../components/FeedForm';

import { useSelector, useDispatch } from 'react-redux';
import { initStore, setToken, removeToken, setUserInfo, refreshToken } from '../stores/userSlice';
import { showToast } from '../stores/toastSlice';

const ProfileView = () => {
  const { id } = useParams(); // Get route parameter
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);


  const [posts, setPosts] = useState([]);
  const [userState, setUserState] = useState({ id: '', name: '', friends_count: 0, posts_count: 0, get_avatar: '' });
  // const [canSendFriendshipRequest, setCanSendFriendshipRequest] = useState(null);

  // const userStore = useUserStore();

  useEffect(() => {
    getFeed();
  }, [id]); // Fetch feed whenever the `id` changes

  const getFeed = async () => {
    try {
      const response = await axios.get(`/api/posts/profile/${id}/`);
      console.log('data', response.data);
      setPosts(response.data.posts);
      setUserState(response.data.user);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  // const sendFriendshipRequest = async () => {
  //   try {
  //     const response = await axios.post(`/api/friends/${id}/request/`);
  //     console.log('data', response.data);
  //     setCanSendFriendshipRequest(false);

  //     if (response.data.message === 'request already sent') {
  //       dispatch(showToast(5000, 'The request has already been sent!', 'bg-red-300'));
  //     } else {
  //       dispatch(showToast(5000, 'The request was sent!', 'bg-emerald-300'));
  //     }
  //   } catch (error) {
  //     console.error('Error sending friendship request:', error);
  //   }
  // };

  const sendDirectMessage = async () => {
    try {
      const response = await axios.get(`/api/chat/${id}/get-or-create/`);
      console.log(response.data);
      navigate('/chat');
    } catch (error) {
      console.error('Error sending direct message:', error);
    }
  };

  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const logout = () => {
    console.log('Log out');
    dispatch(removeToken());
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      {/* Left Panel */}
      <div className="main-left col-span-1">
        <div className="p-4 bg-white border border-gray-200 text-center rounded-lg">
          <img src={user.avatar} alt="User Avatar" className="mb-6 rounded-full" />
          <p>
            <strong>{user.name}</strong>
          </p>

          {user.id && (
            <div className="mt-6 flex space-x-8 justify-around">
              <a href={`/friends/${user.id}`} className="text-xs text-gray-500">
                {user.friends_count} friends
              </a>
              <p className="text-xs text-gray-500">{user.posts_count} posts</p>
            </div>
          )}

          <div className="mt-6">
            {/* {userStore.user.id !== user.id && canSendFriendshipRequest && (
              <button
                className="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg"
                // onClick={sendFriendshipRequest}
              >
                Send friendship request
              </button>
            )} */}

            {userState.id !== user.id && (
              <button
                className="inline-block mt-4 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg"
                onClick={sendDirectMessage}
              >
                Send direct message
              </button>
            )}

            {userState.id === user.id && (
              <>
                <a
                  className="inline-block mr-2 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg"
                  href="/profile/edit"
                >
                  Edit profile
                </a>
                <button
                  className="inline-block py-4 px-3 bg-red-600 text-xs text-white rounded-lg"
                  onClick={logout}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center Panel */}
      <div className="main-center col-span-2 space-y-4">
        {userState.id === user.id && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <FeedForm user={user} posts={posts} />
          </div>
        )}

        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white border border-gray-200 rounded-lg">
            <FeedItem post={post} deletePost={deletePost} />
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="main-right col-span-1 space-y-4">
        <PeopleYouMayKnow />
        <Trends />
      </div>
    </div>
  );
};

export default ProfileView;
