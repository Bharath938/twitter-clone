import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useUserSearch } from "../../hooks/queries/user.queries";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 400);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useUserSearch(debouncedText);

  const users = data?.pages.flatMap((page) => page.users) ?? [];
  const showDropdown = debouncedText.length > 0;

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search users..."
          className="
            input input-bordered w-full rounded-full
            bg-base-100 pr-10
            focus:outline-none focus:border-primary
          "
        />
        {/* Search Icon */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-base-100 shadow-lg border border-base-200">
          {/* Loading */}
          {isFetching && users.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              Searching users...
            </div>
          )}

          {/* Empty */}
          {!isFetching && users.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              No users found
            </div>
          )}

          {/* Results */}
          {users.length > 0 && (
            <ul className="max-h-64 overflow-y-auto">
              {users.map((user) => (
                <Link to={`/profile/${user._id}`}>
                  <li
                    key={user._id}
                    className="
                    flex items-center gap-3 px-4 py-3
                    hover:bg-base-200 cursor-pointer
                  "
                  >
                    {/* Avatar */}
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={user.profileImg || "/avatar-placeholder.png"}
                          alt={user.fullName}
                        />
                      </div>
                    </div>

                    {/* Name & Username */}
                    <div className="flex flex-col">
                      <span className="font-medium">{user.fullName}</span>
                      <span className="text-xs text-gray-400">
                        @{user.username}
                      </span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}

          {/* Load More */}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="
                w-full py-2 text-sm font-medium
                text-primary hover:bg-base-200
                rounded-b-2xl
              "
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
