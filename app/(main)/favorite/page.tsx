"use client";
import { useAuth } from "@/hooks";
import List from "./List";

export default function Favorite() {
  const {loading, user} = useAuth();

  return (
    <div id="favorite-page" className="p-2">
      <List id={user?.id} />
    </div>
  );
}
