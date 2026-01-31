// src/services/MarketplaceService.js

class MarketplaceService {
  constructor() {
    this.status = "idle";
    this.listings = [];
    this.transactions = [];
    this.communityId = "community-1";
  }

  initialize() {
    try {
      this.status = "initialized";
      this.loadMockListings();
      console.log("[MarketplaceService] Marketplace service initialized");
    } catch (error) {
      this.status = "error";
      console.error("[MarketplaceService] Initialization failed", error);
    }
  }

  loadMockListings() {
    this.listings = [
      {
        id: "list-1",
        title: "Organic Tomatoes",
        category: "food",
        quantity: 50,
        unit: "kg",
        price: "Free/Trade",
        provider: "Community Garden",
        createdAt: new Date().toISOString(),
        status: "active",
      },
      {
        id: "list-2",
        title: "Solar Panel Expertise",
        category: "skills",
        description: "Installation and maintenance guidance",
        provider: "Energy Team",
        createdAt: new Date().toISOString(),
        status: "active",
      },
    ];
  }

  createListing(item) {
    try {
      const listing = {
        id: `listing-${Date.now()}`,
        ...item,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      this.listings.push(listing);
      return listing;
    } catch (error) {
      console.error("[MarketplaceService] Create listing failed", error);
    }
  }

  getListings(filter = {}) {
    try {
      return this.listings.filter((listing) => {
        if (filter.category && listing.category !== filter.category) return false;
        if (filter.status && listing.status !== filter.status) return false;
        return true;
      });
    } catch (error) {
      console.error("[MarketplaceService] Get listings failed", error);
      return [];
    }
  }

  completeTrade(fromId, toId, items) {
    try {
      const transaction = {
        id: `txn-${Date.now()}`,
        from: fromId,
        to: toId,
        items,
        timestamp: new Date().toISOString(),
        status: "completed",
      };
      this.transactions.push(transaction);
      return transaction;
    } catch (error) {
      console.error("[MarketplaceService] Complete trade failed", error);
    }
  }

  getTransactionHistory() {
    return this.transactions;
  }

  getStats() {
    return {
      totalListings: this.listings.length,
      activeListings: this.listings.filter((l) => l.status === "active").length,
      totalTransactions: this.transactions.length,
      totalItemsTraded: this.transactions.reduce((sum, t) => sum + t.items.length, 0),
    };
  }
}

const marketplaceService = new MarketplaceService();
export default marketplaceService;
