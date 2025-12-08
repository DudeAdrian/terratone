// src/services/CommunityService.js
import sofieCore from "../core/SofieCore";

class CommunityService {
  constructor() {
    this.status = "idle";
    this.posts = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      sofieCore.getService("logger").log("[CommunityService] Community module initialized.");
    } catch (error) {
      this.status = "error";
      sofieCore.getService("logger").error("[CommunityService] Initialization failed", error);
      throw error;
    }
  }

  addPost(post) {
    try {
      if (!post || typeof post !== 'object') {
        throw new Error('Post must be a valid object');
      }
      const postWithMetadata = {
        id: Date.now(),
        ...post,
        createdAt: new Date().toISOString(),
      };
      this.posts.push(postWithMetadata);
      sofieCore.updateState("communityPosts", this.posts);
      sofieCore.getService("logger").debug("[CommunityService] Post added");
      return postWithMetadata;
    } catch (error) {
      sofieCore.getService("logger").error("[CommunityService] Add post failed", error);
      throw error;
    }
  }

  getPosts() {
    try {
      return [...this.posts];
    } catch (error) {
      sofieCore.getService("logger").error("[CommunityService] Get posts failed", error);
      return [];
    }
  }

  deletePost(postId) {
    try {
      const initialLength = this.posts.length;
      this.posts = this.posts.filter(p => p.id !== postId);
      if (this.posts.length < initialLength) {
        sofieCore.updateState("communityPosts", this.posts);
        sofieCore.getService("logger").debug("[CommunityService] Post deleted");
        return true;
      }
      return false;
    } catch (error) {
      sofieCore.getService("logger").error("[CommunityService] Delete post failed", error);
      return false;
    }
  }
}

const communityService = new CommunityService();
export default communityService;