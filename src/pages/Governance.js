import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";
import { useGovernanceData } from "../hooks/useApi";

const Governance = () => {
  const [stats, setStats] = useState({});
  const [proposals, setProposals] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRegion, setSelectedRegion] = useState(null);

  // API hook for governance data
  const { data: govData, loading: govLoading, error: govError, refetch: refetchGov } = useGovernanceData(selectedRegion);

  // Initialize component
  useEffect(() => {
    if (govData) {
      setStats(govData.stats || {});
      setProposals(govData.proposals || []);
      setMembers(govData.members || []);
    } else {
      // Fallback to sofieCore if API unavailable
      try {
        const govService = sofieCore.getService("governance");
        if (govService) {
          setStats(govService.getGovernanceStats?.() || {});
          setProposals(govService.getProposals?.() || []);
          setMembers(govService.getMembers?.() || []);
        }
      } catch (err) {
        console.warn('Governance service unavailable:', err);
      }
    }
  }, [govData]);

  const handleRetry = () => {
    refetchGov();
  };

  // Loading state
  if (govLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-950 via-gray-950 to-violet-950">
        <div className="text-center space-y-4">
          <div className="text-3xl quantum-pulse text-indigo-400">
            Loading Governance System...
          </div>
          <div className="text-indigo-300/70">
            Fetching proposals and member data
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (govError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-950 via-gray-950 to-violet-950 space-y-6">
        <div className="text-3xl text-red-400">
          {govError}
        </div>
        <button
          onClick={handleRetry}
          className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50"
        >
          Retry Governance Data
        </button>
      </div>
    );
  }
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-950 to-violet-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <QuantumSection chakra="third_eye" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]">
              🗳️ Community Governance
            </h1>
            <p className="text-lg text-indigo-100/85 max-w-2xl drop-shadow-[0_0_14px_rgba(129,140,248,0.45)]">
              Transparent community decision-making, voting, and smart contract governance with Web3 integration
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-400/40 shadow-[0_0_14px_rgba(99,102,241,0.4)]">
                ⛓️ On-Chain Voting
              </span>
              <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-cyan-400/40 shadow-[0_0_14px_rgba(56,189,248,0.35)]">
                🤝 Multi-Sig Control
              </span>
              <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-purple-400/40 shadow-[0_0_14px_rgba(192,132,252,0.35)]">
                🔐 Decentralized
              </span>
            </div>
          </div>
        </QuantumSection>

        {/* Key Stats */}
        <QuantumGlassGrid columns={4} gap={5} className="grid-cols-2 md:grid-cols-4">
          <QuantumCard chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-indigo-100/80 mb-2">Community Members</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">{stats.totalMembers || 0}</div>
              <p className="text-xs text-indigo-100/70 mt-3">Active participants</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-cyan-100/80 mb-2">Total Proposals</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">{stats.totalProposals || 0}</div>
              <p className="text-xs text-cyan-100/70 mt-3">All-time submissions</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="crown" blurLevel="deep" opacityLevel="ultraClear" glow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-purple-100/80 mb-2">Active Now</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(192,132,252,0.5)]">{stats.activeProposals || 0}</div>
              <p className="text-xs text-purple-100/70 mt-3">Voting in progress</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-emerald-100/80 mb-2">Passed</div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">{stats.passedProposals || 0}</div>
              <p className="text-xs text-emerald-100/70 mt-3">Executed on-chain</p>
            </div>
          </QuantumCard>
        </QuantumGlassGrid>

        {/* Tabs */}
        <QuantumSection chakra="third_eye" opacityLevel="veil" blurLevel="medium" edgeGlow>
          <div className="flex flex-wrap border-b border-indigo-500/30 backdrop-blur-sm">
            {["overview", "members", "proposals", "guidelines"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-indigo-600/50 to-purple-600/30 text-white border-b-2 border-indigo-300 shadow-[0_6px_30px_rgba(99,102,241,0.35)]"
                    : "text-indigo-100/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab === "overview" && "📊"}
                {tab === "members" && "👥"}
                {tab === "proposals" && "📋"}
                {tab === "guidelines" && "📖"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <QuantumCard chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(129,140,248,0.45)]">Governance Structure</h3>
                    <div className="space-y-3 text-indigo-100/80">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔷</span>
                        <span>Democratic voting with 1 member = 1 vote</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔒</span>
                        <span>Multi-signature wallet for treasury control</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⛓️</span>
                        <span>Smart contracts enforce all governance rules</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <span>Web3 wallet integration for transparent voting</span>
                      </div>
                    </div>
                  </div>
                </QuantumCard>

                <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(56,189,248,0.45)]">Voting Power Distribution</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-cyan-100/80">Equal Voting</span>
                          <span className="text-sm font-bold text-white">100%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-3 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-cyan-100/70 mt-4">
                        All active members hold equal voting power. Voting rights confirmed through Web3 wallet verification.
                      </p>
                    </div>
                  </div>
                </QuantumCard>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {members.slice(0, 6).map((member) => (
                  <QuantumCard key={member.id} chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-white drop-shadow-[0_0_10px_rgba(129,140,248,0.45)]">{member.name}</h3>
                          <p className="text-sm text-indigo-100/85 font-medium">{member.role}</p>
                        </div>
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="space-y-2 text-sm text-indigo-100/80">
                        <p>Joined: <span className="font-medium">{member.joinDate}</span></p>
                        <p>Status: <span className="font-medium text-emerald-200">Active</span></p>
                        <p>Votes Cast: <span className="font-medium">5</span></p>
                      </div>
                    </div>
                  </QuantumCard>
                ))}
              </div>
              {members.length === 0 && (
                <div className="text-center py-8 text-indigo-100/70">
                  No members yet. Start inviting community members!
                </div>
              )}
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === "proposals" && (
            <div className="p-8 space-y-5">
              {proposals.slice(0, 5).map((proposal) => (
                <QuantumCard key={proposal.id} chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white mb-2 drop-shadow-[0_0_10px_rgba(129,140,248,0.45)]">{proposal.title}</h3>
                        <p className="text-sm text-indigo-100/80 mb-4">{proposal.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ml-4 ${
                        proposal.status === "active"
                          ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/40"
                          : "bg-blue-500/20 text-blue-100 border border-blue-400/40"
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-emerald-200">For: {proposal.votesFor}</span>
                          <span className="text-sm font-medium text-rose-200">Against: {proposal.votesAgainst}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 flex overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-2"
                            style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                          ></div>
                          <div 
                            className="bg-rose-500 h-2"
                            style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </QuantumCard>
              ))}
              {proposals.length === 0 && (
                <div className="text-center py-8 text-indigo-100/70">
                  No proposals yet. Create one to get started!
                </div>
              )}
            </div>
          )}

          {/* Guidelines Tab */}
          {activeTab === "guidelines" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <QuantumCard chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(129,140,248,0.45)]">Voting Rules</h3>
                    {[
                      { icon: "⏱️", title: "Discussion Period", desc: "24 hours before voting begins" },
                      { icon: "📅", title: "Voting Duration", desc: "7 days per proposal" },
                      { icon: "✅", title: "Quorum", desc: "50%+ participation required" },
                      { icon: "🎯", title: "Passage", desc: "Simple majority (50%+1) wins" }
                    ].map((rule, idx) => (
                      <div key={idx} className="pb-4 border-b border-indigo-500/30 last:border-0">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{rule.icon}</span>
                          <div>
                            <p className="font-bold text-white">{rule.title}</p>
                            <p className="text-sm text-indigo-100/80">{rule.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </QuantumCard>

                <QuantumCard chakra="throat" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]">Governance Values</h3>
                    {[
                      { icon: "🤝", title: "Transparent", desc: "All decisions visible on blockchain" },
                      { icon: "⚖️", title: "Equitable", desc: "Equal voting rights for all members" },
                      { icon: "🔒", title: "Secure", desc: "Smart contracts enforce all rules" },
                      { icon: "📢", title: "Participatory", desc: "Community input on all decisions" }
                    ].map((value, idx) => (
                      <div key={idx} className="pb-4 border-b border-cyan-500/30 last:border-0">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{value.icon}</span>
                          <div>
                            <p className="font-bold text-white">{value.title}</p>
                            <p className="text-sm text-cyan-100/80">{value.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </QuantumCard>
              </div>
            </div>
          )}
        </QuantumSection>

        {/* Web3 Integration Status */}
        <QuantumCard chakra="third_eye" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 drop-shadow-[0_0_12px_rgba(129,140,248,0.45)]">
              <span>⛓️</span>
              <span>Web3 Integration Status</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-bold text-white mb-2">Smart Contracts</h3>
                <p className="text-sm text-emerald-200 font-bold">✓ Deployed</p>
                <p className="text-xs text-indigo-100/70 mt-2">Governance contracts verified on chain</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-white mb-2">Wallet Integration</h3>
                <p className="text-sm text-cyan-200 font-bold">✓ Connected</p>
                <p className="text-xs text-indigo-100/70 mt-2">MetaMask & WalletConnect ready</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-white mb-2">Voting Records</h3>
                <p className="text-sm text-indigo-200 font-bold">✓ Immutable</p>
                <p className="text-xs text-indigo-100/70 mt-2">All votes stored on-chain permanently</p>
              </div>
            </div>
          </div>
        </QuantumCard>

      </div>
    </div>
  );
};

export default Governance;
