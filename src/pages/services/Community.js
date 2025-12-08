import React, { useState } from "react";
import sofieCore from "../../core/SofieCore";

const Community = () => {
  const communityService = sofieCore.getService("community");
  const [posts, setPosts] = useState(communityService.getPosts());
  const [newPost, setNewPost] = useState("");
  const [author, setAuthor] = useState("Community Member");

  const addPost = () => {
    if (newPost.trim()) {
      const post = {
        author,
        content: newPost,
        timestamp: new Date().toLocaleString(),
        likes: 0,
      };
      communityService.addPost(post);
      setPosts(communityService.getPosts());
      setNewPost("");
    }
  };

  const handleLike = (idx) => {
    const updatedPosts = [...posts];
    updatedPosts[idx].likes = (updatedPosts[idx].likes || 0) + 1;
    setPosts(updatedPosts);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">👥 Community Hub</h1>
        <p className="text-lg text-gray-600">Connect, collaborate, and empower local initiatives</p>
      </div>

      {/* Create Post */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Share with the Community</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name or role"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="What would you like to share?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24"
            />
            <button
              onClick={addPost}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md"
            >
              📤 Post to Community
            </button>
          </div>
      </div>

      {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">No posts yet. Be the first to share! 💬</p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{post.author}</p>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                  <span className="text-2xl">💭</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => handleLike(idx)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold transition"
                  >
                    ❤️ {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition">
                    💬 Reply
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-semibold transition">
                    🔄 Share
                  </button>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
};

Community.propTypes = {};

export default Community;