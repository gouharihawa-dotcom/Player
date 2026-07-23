import { Clock, Calendar, Play } from "lucide-react";

export default function LibraryFilters({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: "newest", label: "Newest", icon: Calendar },
    { value: "oldest", label: "Oldest", icon: Clock },
    { value: "lastPlayed", label: "Last Played", icon: Play },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1">
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                sortBy === opt.value
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text hover:bg-surface-light"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
