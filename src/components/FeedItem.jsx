import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FeedItem = ({ post, userStore }) => {
  const [showExtraModal, setShowExtraModal] = useState(false);

  const likePost = (id) => {
    axios
      .post(`/api/posts/${id}/like/`)
      .then((response) => {
        if (response.data.message === 'like created') {
          post.likes_count += 1;
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const reportPost = () => {
    axios
      .post(`/api/posts/${post.id}/report/`)
      .then((response) => {
        console.log(response.data);
        // Toast logic to show message
      })
      .catch((error) => console.error('Error:', error));
  };

  const deletePost = () => {
    // Pass delete action to parent component
    // Emit deletePost and then delete the post
    axios
      .delete(`/api/posts/${post.id}/delete/`)
      .then((response) => {
        console.log(response.data);
        // Show success toast
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <img src={post.created_by.get_avatar} className="w-[40px] rounded-full" alt="avatar" />
        <p>
          <strong>
            <Link to={`/profile/${post.created_by.id}`}>{post.created_by.name}</Link>
          </strong>
        </p>
      </div>
      <p className="text-gray-600">{post.created_at_formatted} ago</p>

      {post.attachments.length > 0 && (
        <div>
          {post.attachments.map((image) => (
            <img key={image.id} src={image.get_image} className="w-full mb-4 rounded-xl" alt="post" />
          ))}
        </div>
      )}

      <p>{post.body}</p>

      <div className="my-6 flex justify-between">
        <div className="flex space-x-6 items-center">
          <div className="flex items-center space-x-2" onClick={() => likePost(post.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-gray-500 text-xs">{post.likes_count} likes</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            <Link to={`/postview/${post.id}`} className="text-gray-500 text-xs">
              {post.comments_count} comments
            </Link>
          </div>

          {post.is_private && (
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              <span>Is private</span>
            </div>
          )}
        </div>

        <div>
          <div onClick={() => setShowExtraModal(!showExtraModal)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9L18 9M6 15L18 15" />
            </svg>
          </div>
          {showExtraModal && (
            <div>
              <button onClick={reportPost}>Report</button>
              <button onClick={deletePost}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
