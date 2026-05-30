import {
  GitBranch,
  ExternalLink,
  BadgeCheck,
  Pencil,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";

function ProjectCard({
  title,
  description,
  technologies,
  verified,
  onDelete,
  onEdit,
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>

            {verified && (
              <div className="bg-green-500/20 text-green-400 p-1 rounded-lg">
                <BadgeCheck size={18} />
              </div>
            )}
          </div>

          <p className="text-slate-400 leading-7">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {Array.isArray(
          technologies
        ) &&
        technologies.length >
          0 ? (
          technologies.map(
            (item, index) => (
              <span
                key={index}
                className="bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-sm"
              >
                {item}
              </span>
            )
          )
        ) : (
          <span className="text-slate-500">
            No technologies added
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-4 py-3 rounded-xl text-white">
            <GitBranch size={18} />
            GitHub
          </button>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-4 py-3 rounded-xl text-white">
            <ExternalLink size={18} />
            Live Demo
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 transition px-4 py-3 rounded-xl text-black font-semibold"
          >
            <Pencil size={18} />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-4 py-3 rounded-xl text-white"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;