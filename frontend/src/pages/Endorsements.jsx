import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ThumbsUp, Search, User, Loader2, X } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { createEndorsement, getUserEndorsements, searchUsers } from "../api/endorsementApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm";

export default function Endorsements() {
  const { user } = useContext(AuthContext);
  const [received, setReceived]     = useState([]);
  const [searchQ, setSearchQ]       = useState("");
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchReceived = useCallback(async () => {
    if (!user?._id) return;

    try {
      const data = await getUserEndorsements(user._id);
      setReceived(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [user?._id]);

  useEffect(() => { fetchReceived(); }, [fetchReceived]);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    try {
      setSearching(true);
      const data = await searchUsers(q);
      setResults(data.filter((u) => u._id !== user._id));
    } catch { /* silent */ }
    finally { setSearching(false); }
  }, [user._id]);

  useEffect(() => {
    const t = setTimeout(() => handleSearch(searchQ), 400);
    return () => clearTimeout(t);
  }, [searchQ, handleSearch]);

  const handleEndorse = async () => {
    if (!selectedUser || !skillInput.trim()) {
      toast.error("Select a user and enter a skill to endorse.");
      return;
    }
    try {
      await createEndorsement({ toUser: selectedUser._id, skill: skillInput.trim() });
      toast.success(`Endorsed ${selectedUser.name} for "${skillInput.trim()}"!`);
      setSkillInput("");
      setSelectedUser(null);
      setSearchQ("");
      setResults([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Endorsement failed.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Endorsements</h1>
          <p className="text-slate-400 mt-1">Endorse peers for their skills and view endorsements you received.</p>
        </div>

        {/* Give Endorsement */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ThumbsUp size={18} className="text-blue-400" /> Give an Endorsement
          </h2>

          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search users by name or username..."
              className={`${inputClass} pl-10`}
            />
            {searching && <Loader2 size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 animate-spin" />}
          </div>

          {results.length > 0 && !selectedUser && (
            <div className="bg-slate-800 rounded-xl overflow-hidden mb-4">
              {results.map((u) => (
                <button key={u._id} onClick={() => { setSelectedUser(u); setSearchQ(u.name); setResults([]); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition text-left">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{u.name}</div>
                    <div className="text-slate-500 text-xs">@{u.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 mb-4">
              <User size={15} className="text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">{selectedUser.name}</span>
              <button onClick={() => { setSelectedUser(null); setSearchQ(""); }} className="ml-auto text-slate-500 hover:text-white transition">
                <X size={15} />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Skill to endorse (e.g. React, Leadership...)"
              className={`${inputClass} flex-1`}
              onKeyDown={(e) => e.key === "Enter" && handleEndorse()}
            />
            <button onClick={handleEndorse} disabled={!selectedUser || !skillInput.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition px-5 py-3 rounded-xl text-white font-semibold text-sm">
              <ThumbsUp size={16} /> Endorse
            </button>
          </div>
        </div>

        {/* Received */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Endorsements Received ({received.length})
          </h2>
          {loading ? <div className="flex justify-center py-8"><Loader /></div>
          : received.length === 0 ? (
            <div className="text-center py-10">
              <ThumbsUp size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No endorsements yet. Share your profile to receive endorsements.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {received.map((e, i) => (
                <motion.div key={e._id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 bg-slate-800 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {e.fromUser?.name?.[0] || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{e.fromUser?.name || "Anonymous"}</div>
                    <div className="text-slate-500 text-xs">@{e.fromUser?.username}</div>
                  </div>
                  <span className="bg-blue-500/15 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                    {e.skill}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
