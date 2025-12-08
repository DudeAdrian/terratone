// src/services/KnowledgeBaseService.js

class KnowledgeBaseService {
  constructor() {
    this.status = "idle";
    this.articles = [];
    this.guides = [];
    this.bestPractices = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      this.loadInitialContent();
      console.log("[KnowledgeBaseService] Knowledge base initialized");
    } catch (error) {
      this.status = "error";
      console.error("[KnowledgeBaseService] Initialization failed", error);
    }
  }

  loadInitialContent() {
    this.articles = [
      {
        id: 1,
        title: "Getting Started with Solar Energy",
        category: "energy",
        content: "A comprehensive guide to installing and maintaining solar panels...",
        author: "Sarah Johnson",
        date: "2025-01-15",
        views: 324,
      },
      {
        id: 2,
        title: "Water Harvesting Techniques",
        category: "water",
        content: "Learn how to capture and store rainwater for sustainable use...",
        author: "Michael Chen",
        date: "2025-01-10",
        views: 512,
      },
      {
        id: 3,
        title: "Organic Gardening Basics",
        category: "food",
        content: "Start your journey to growing your own food sustainably...",
        author: "Emma Rodriguez",
        date: "2025-01-08",
        views: 687,
      },
    ];

    this.bestPractices = [
      {
        id: 1,
        title: "Closed-Loop Composting System",
        description: "Zero-waste composting that produces nutrient-rich soil",
        community: "Green Oasis",
        sustainability: 95,
      },
      {
        id: 2,
        title: "Community Solar Sharing Model",
        description: "How Harmonic Valley shares solar energy generation equitably",
        community: "Harmonic Valley",
        sustainability: 88,
      },
      {
        id: 3,
        title: "Permaculture Forest Garden",
        description: "Design and management of multi-layered food forests",
        community: "Earth Commons",
        sustainability: 92,
      },
    ];
  }

  getArticles(category = null) {
    if (category) {
      return this.articles.filter((a) => a.category === category);
    }
    return this.articles;
  }

  searchArticles(query) {
    return this.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  getBestPractices() {
    return this.bestPractices;
  }

  addArticle(article) {
    try {
      const newArticle = {
        id: this.articles.length + 1,
        ...article,
        date: new Date().toISOString().split("T")[0],
        views: 0,
      };
      this.articles.push(newArticle);
      return newArticle;
    } catch (error) {
      console.error("[KnowledgeBaseService] Add article failed", error);
    }
  }

  getStats() {
    return {
      totalArticles: this.articles.length,
      totalBestPractices: this.bestPractices.length,
      categories: [...new Set(this.articles.map((a) => a.category))],
      totalViews: this.articles.reduce((sum, a) => sum + a.views, 0),
    };
  }
}

const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService;
