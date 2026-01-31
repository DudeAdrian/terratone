// src/services/HerbalLibraryService.js
// Community-facing indigenous herbal library for Sofie Systems

class HerbalLibraryService {
  constructor() {
    this.status = "idle";
    this.herbs = [];
  }

  initialize() {
    this.status = "ready";
    this.herbs = this.loadHerbData();
    console.log("[HerbalLibraryService] Initialized with", this.herbs.length, "herbs");
  }

  loadHerbData() {
    // Compact set; can be expanded. Focus on community wellness and resilience.
    return [
      {
        id: "ashwagandha",
        commonName: "Ashwagandha",
        scientificName: "Withania somnifera",
        traditions: ["Ayurveda"],
        origin: "India",
        communityUses: ["stress resilience", "sleep support", "mood balance"],
        preparation: ["tea", "tincture", "powder"],
        safety: { pregnancy: false, notes: "Avoid with hyperthyroid or sedative meds" },
        energetics: "warming, grounding, adaptogenic",
      },
      {
        id: "tulsi",
        commonName: "Tulsi (Holy Basil)",
        scientificName: "Ocimum sanctum",
        traditions: ["Ayurveda"],
        origin: "India",
        communityUses: ["respiratory", "immune tone", "calm focus"],
        preparation: ["tea", "fresh leaf", "tincture"],
        safety: { pregnancy: true, notes: "Generally gentle; monitor blood sugar" },
        energetics: "warming, uplifting, aromatic",
      },
      {
        id: "turmeric",
        commonName: "Turmeric",
        scientificName: "Curcuma longa",
        traditions: ["Ayurveda", "Southeast Asian"],
        origin: "India",
        communityUses: ["inflammation", "joint comfort", "digestion"],
        preparation: ["food spice", "golden milk", "paste"],
        safety: { pregnancy: true, notes: "Caution with gallstones or high-dose anticoagulants" },
        energetics: "warming, moving",
      },
      {
        id: "reishi",
        commonName: "Reishi",
        scientificName: "Ganoderma lucidum",
        traditions: ["Traditional Chinese Medicine"],
        origin: "East Asia",
        communityUses: ["immune balance", "sleep depth", "adaptation"],
        preparation: ["decoction", "powder", "tincture"],
        safety: { pregnancy: false, notes: "May potentiate anticoagulants" },
        energetics: "neutral-cool, calming, shen tonic",
      },
      {
        id: "ginseng",
        commonName: "Asian Ginseng",
        scientificName: "Panax ginseng",
        traditions: ["Traditional Chinese Medicine"],
        origin: "East Asia",
        communityUses: ["energy", "cognition", "recovery"],
        preparation: ["decoction", "chew slice", "powder"],
        safety: { pregnancy: false, notes: "Avoid with hypertension or stimulant meds" },
        energetics: "warming, qi/yang tonic",
      },
      {
        id: "echinacea",
        commonName: "Echinacea",
        scientificName: "Echinacea purpurea",
        traditions: ["Native American"],
        origin: "North America",
        communityUses: ["immune response", "oral health", "lymph support"],
        preparation: ["tincture", "tea", "topical wash"],
        safety: { pregnancy: true, notes: "Short-term use; caution with autoimmune" },
        energetics: "cooling, dispersing",
      },
      {
        id: "sage",
        commonName: "White Sage",
        scientificName: "Salvia apiana",
        traditions: ["Native American"],
        origin: "Southwestern USA",
        communityUses: ["respiratory", "clearing smoke", "ceremonial"],
        preparation: ["tea", "steam inhalation", "smoke"],
        safety: { pregnancy: false, notes: "Overharvested—use cultivated sources" },
        energetics: "warming, drying, aromatic",
      },
      {
        id: "catclaw",
        commonName: "Cat's Claw",
        scientificName: "Uncaria tomentosa",
        traditions: ["Amazonian"],
        origin: "Amazon Basin",
        communityUses: ["immune modulation", "joint comfort", "gut balance"],
        preparation: ["decoction", "tincture"],
        safety: { pregnancy: false, notes: "Avoid with immunosuppressants" },
        energetics: "cooling, drying",
      },
      {
        id: "teatree",
        commonName: "Tea Tree",
        scientificName: "Melaleuca alternifolia",
        traditions: ["Aboriginal Australian"],
        origin: "Australia",
        communityUses: ["topical antiseptic", "skin", "respiratory steam"],
        preparation: ["topical diluted oil", "steam"],
        safety: { pregnancy: true, notes: "Topical only; never ingest essential oil" },
        energetics: "cooling, antimicrobial",
      },
      {
        id: "chamomile",
        commonName: "Chamomile",
        scientificName: "Matricaria chamomilla",
        traditions: ["European"],
        origin: "Europe/North Africa",
        communityUses: ["sleep", "digestion", "children's calm"],
        preparation: ["tea", "compress"],
        safety: { pregnancy: true, notes: "Caution with ragweed allergy" },
        energetics: "cooling, relaxing, mildly bitter",
      },
      {
        id: "lavender",
        commonName: "Lavender",
        scientificName: "Lavandula angustifolia",
        traditions: ["European"],
        origin: "Mediterranean",
        communityUses: ["sleep", "mood", "skin"],
        preparation: ["tea", "aroma", "topical"],
        safety: { pregnancy: true, notes: "Gentle; topical dilute for skin" },
        energetics: "cooling, aromatic, relaxing",
      },
    ];
  }

  getHerbs(filters = {}) {
    const { search, tradition, communityUse, pregnancySafe } = filters;
    return this.herbs.filter((herb) => {
      const matchesSearch = search
        ? [herb.commonName, herb.scientificName, ...(herb.communityUses || []), ...(herb.traditions || [])]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      const matchesTradition = tradition ? herb.traditions?.includes(tradition) : true;
      const matchesUse = communityUse ? herb.communityUses?.some((u) => u.toLowerCase().includes(communityUse.toLowerCase())) : true;
      const matchesSafety = pregnancySafe ? herb.safety?.pregnancy === true : true;
      return matchesSearch && matchesTradition && matchesUse && matchesSafety;
    });
  }

  getHerbById(id) {
    return this.herbs.find((h) => h.id === id);
  }

  getTraditions() {
    return Array.from(new Set(this.herbs.flatMap((h) => h.traditions))).sort();
  }

  getCommunityUses() {
    return Array.from(new Set(this.herbs.flatMap((h) => h.communityUses))).sort();
  }

  getStats() {
    return {
      totalHerbs: this.herbs.length,
      traditions: this.getTraditions().length,
      pregnancySafeCount: this.herbs.filter((h) => h.safety?.pregnancy).length,
      resilienceFocus: this.herbs.filter((h) => (h.communityUses || []).includes("immune response") || (h.communityUses || []).includes("stress resilience")).length,
    };
  }
}

const herbalLibraryService = new HerbalLibraryService();
export default herbalLibraryService;
