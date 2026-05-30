import { Loader2 } from "lucide-react";

export default function Loader({ size = 32 }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 size={size} className="animate-spin text-blue-500" />
    </div>
  );
}
