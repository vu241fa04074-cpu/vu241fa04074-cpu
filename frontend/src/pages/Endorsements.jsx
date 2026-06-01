import { useCallback, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, Search, ThumbsUp, User, X } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { createEndorsement, getUserEndorsements, searchUsers } from "../api/endorsementApi";
import { AuthContext } from "../context/AuthContext";

const inputClass = "app-input";

export default function Endorsements() {
  const { user } = useContext(AuthContext);
  const [received, setReceived] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchReceived = useCallback(async () => {
    if (!user?._id) return;

    try {
      const data = await getUserEndorsements(user._id);
      setReceived(data);
    } catch {
      setReceived([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => { fetchReceived(); }, [fetchReceived]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim() || !user?._id) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);
      const data = await searchUsers(query);
      setResults(data.filter((candidate) => candidate._id !== user._id));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [user?._id]);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQ), 400);
    return () => clearTimeout(timer);
  }, [searchQ, handleSearch]);

  const handleEndorse = async () => {
    if (!selectedUser || !skillInput.trim()) {
      toast.error("Select a user and enter a skill to endorse.");
      return;
    }

    try {
      await createEndorsement({ toUser: selectedUser._id, skill: skillInput.trim() });
      toast.success(`Endorsed ${selectedUser.name} for ${skillInput.trim()}!`);
      setSkillInput("");
      setSelectedUser(null);
      setSearchQ("");
      setResults([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Endorsement failed.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <ThumbsUp size={24} />
            </span>
            <div>
              <h1 className="text-3xl font-black text-slate-950">Endorsements</h1>
              <p className="mt-1 text-slate-600">Endorse peers for their skills and view endorsements you received.</p>
            </div>
          </div>
        </div>

        <section className="app-card mb-8 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
            <ThumbsUp size={18} className="text-blue-600" /> Give an Endorsement
          </h2>

          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQ}
              onChange={(event) => setSearchQ(event.target.value)}
              placeholder="Search users by name or username..."
              className={`${inputClass} pl-10`}
            />
            {searching && <Loader2 size={15} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />}
          </div>

          {results.length > 0 && !selectedUser && (
            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {results.map((candidate) => (
                <button
                  key={candidate._id}
                  onClick={() => { setSelectedUser(candidate); setSearchQ(candidate.name); setResults([]); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {candidate.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{candidate.name}</div>
                    <div className="text-xs text-slate-500">@{candidate.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
              <User size={15} className="text-blue-700" />
              <span className="text-sm font-semibold text-blue-700">{selectedUser.name}</span>
              <button onClick={() => { setSelectedUser(null); setSearchQ(""); }} className="ml-auto text-slate-500 transition hover:text-blue-700">
                <X size={15} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              placeholder="Skill to endorse, e.g. React, Leadership"
              className={`${inputClass} flex-1`}
              onKeyDown={(event) => event.key === "Enter" && handleEndorse()}
            />
            <button onClick={handleEndorse} disabled={!selectedUser || !skillInput.trim()} className="app-button-primary px-5 py-3">
              <ThumbsUp size={16} /> Endorse
            </button>
          </div>
        </section>

        <section className="app-card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-950">
            Endorsements Received ({received.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-8"><Loader /></div>
          ) : received.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <ThumbsUp size={38} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-600">No endorsements yet. Share your public profile to receive endorsements.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {received.map((endorsement, index) => (
                <motion.div
                  key={endorsement._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {endorsement.fromUser?.name?.[0] || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-950">{endorsement.fromUser?.name || "Anonymous"}</div>
                    <div className="text-xs text-slate-500">@{endorsement.fromUser?.username}</div>
                  </div>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {endorsement.skill}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
