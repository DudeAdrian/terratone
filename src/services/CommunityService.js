// src/services/CommunityService.js

class CommunityService {
  constructor() {
    this.status = "idle";
    this.posts = []; // ✅ Add posts array
  }

  initialize() {
    this.status = "initialized";
    console.log("[CommunityService] Community module initialized.");
  }

  addPost(post) {
    this.posts.push(post);
    console.log("[CommunityService] Post added:", post);
  }

  getPosts() {
    return this.posts;
  }
}

const communityService = new CommunityService();
export default communityService;