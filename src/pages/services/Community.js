import React, { useState, useEffect } from "react";
import sofieCore from "../../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../../theme/QuantumGlassTheme";
import { useCommunityData } from "../../hooks/useApi";

const Community = () => {
  const { data: apiCommunity, loading, error, refetch } = useCommunityData("default");
  const communityService = sofieCore.getService("community");
  const [posts, setPosts] = useState(communityService.getPosts());
  const [newPost, setNewPost] = useState("");
  const [author, setAuthor] = useState("Community Member");

  useEffect(() => {
    if (apiCommunity && Array.isArray(apiCommunity.posts)) {
      setPosts(apiCommunity.posts);
    }
  }, [apiCommunity]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950 flex items-center justify-center">
        <QuantumCard chakra="throat">
          <div className="p-8 text-cyan-100 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-cyan-400 border-t-transparent rounded-full mr-3"></div>
            Loading community data...
          </div>
        </QuantumCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950 flex items-center justify-center p-4">
        <QuantumCard chakra="throat">
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Community Data</h2>
            <p className="text-cyan-100/80 mb-4">{error}</p>
            <button onClick={refetch} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">Retry</button>
          </div>
        </QuantumCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="throat">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,187,255,0.5)] mb-2">👥 Community Hub</h1>
          <p className="text-cyan-200">Connect, collaborate, and empower local initiatives</p>
        </QuantumSection>

        {/* Create Post */}
        <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow={true} edgeGlow={true}>
          <h2 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,187,255,0.5)]">Share with the Community</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name or role"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
            />
            <textarea
              placeholder="What would you like to share?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none h-24"
            />
            <button
              onClick={addPost}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_30px_rgba(0,187,255,0.7)] text-white font-bold py-2 px-6 rounded-lg transition"
            >
              📤 Post to Community
            </button>
          </div>
        </QuantumCard>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <QuantumCard chakra="throat" blurLevel="medium" opacityLevel="veil" glow={true}>
              <div className="text-center py-12">
                <p className="text-xl text-cyan-200">No posts yet. Be the first to share! 💬</p>
              </div>
            </QuantumCard>
          ) : (
            posts.map((post, idx) => (
              <QuantumCard key={idx} chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow={true} edgeGlow={true}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{post.author}</p>
                    <p className="text-sm text-cyan-300">{post.timestamp}</p>
                  </div>
                  <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">💭</span>
                </div>
                <p className="text-cyan-100 mb-4 leading-relaxed">{post.content}</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => handleLike(idx)}
                    className="flex items-center gap-2 text-cyan-200 hover:text-pink-400 font-semibold transition drop-shadow-[0_0_5px_rgba(0,187,255,0.3)]"
                  >
                    ❤️ {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-2 text-cyan-200 hover:text-blue-400 font-semibold transition">
                    💬 Reply
                  </button>
                  <button className="flex items-center gap-2 text-cyan-200 hover:text-green-400 font-semibold transition">
                    🔄 Share
                  </button>
                </div>
              </QuantumCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

Community.propTypes = {};

export default Community;