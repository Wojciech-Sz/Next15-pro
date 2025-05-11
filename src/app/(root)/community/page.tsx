import { SearchIcon } from "lucide-react";
import React from "react";

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { users } = data || {};

  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          icon={<SearchIcon />}
          placeholder="Search other devs..."
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users: User[]) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </section>
  );
};

export default Community;
