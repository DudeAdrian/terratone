// src/pages/services/Community.js

import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import sofieCore from "../../core/SofieCore";

const Community = () => {
  const communityService = sofieCore.getService("community");

  const [posts, setPosts] = useState(communityService.getPosts());

  const addPost = () => {
    const newPost = {
      author: "Admin",
      content: `Community announcement at ${new Date().toLocaleTimeString()}`,
    };
    communityService.addPost(newPost);
    setPosts(communityService.getPosts());
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-4">Community Tools</h1>
        <p className="text-lg text-gray-700 mb-6">
          Local forums and collaboration tools to connect and empower communities.
        </p>

        <button
          onClick={addPost}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Post
        </button>

        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div key={idx} className="p-4 bg-white rounded shadow border">
              <p className="font-semibold">{post.author}</p>
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
