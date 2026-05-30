import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import API from "../api/axios";

import Navbar from "../components/Navbar";

function SearchUsers() {

  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const searchUsers = async () => {

    try {

      const response =
        await API.get(
          `/users?search=${search}`
        );

      setUsers(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div>

      <Navbar />

      <div className="max-w-5xl mx-auto mt-10">

        <div className="bg-white p-6 rounded shadow">

          <h1 className="text-3xl font-bold mb-6">
            Search Users
          </h1>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 border p-3 rounded"
            />

            <button
              onClick={searchUsers}
              className="bg-blue-600 text-white px-6 rounded"
            >
              Search
            </button>

          </div>

        </div>

        <div className="grid gap-6 mt-10">

          {
            users.map((user) => (

              <div
                key={user._id}
                className="bg-white p-6 rounded shadow flex justify-between items-center"
              >

                <div>

                  <h2 className="text-2xl font-bold">
                    {user.name}
                  </h2>

                  <p className="text-gray-500">
                    @{user.username}
                  </p>

                </div>

                <Link
                  to={`/portfolio/${user.username}`}
                  className="bg-green-600 text-white px-5 py-2 rounded"
                >
                  View Portfolio
                </Link>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

export default SearchUsers;