"use client";

import NavBar from "./NavBar";
import Footer from './Footer';
import Detail from "./Detail";
import { Dialog } from 'antd-mobile';
import { useRequest } from "ahooks";
import { useProcessResponse } from "@/hooks";
import { useRouter } from "next/navigation";

export default function Note({ params }: { params: Record<string, string> }) {
  const id = params.id;
  const router = useRouter();
  const processResponse = useProcessResponse();
  const { data, loading, refresh } = useRequest(
    async () => {
      try {
        const response = await fetch(`/api/note/detail?id=${id}`);
        const data = await processResponse(response);

        return data.data;
      } catch (error) {
        console.error(error);
      }
    },
    { refreshDeps: [id] }
  );

  const handleLike = async () => {
    try {
      const response = await fetch("/api/note/like", {
        method: "POST",
        body: JSON.stringify({
          id,
          like: !data.like,
        }),
      });
      await processResponse(response);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };
  const handleFavorite = async () => {
    try {
      const response = await fetch("/api/note/favorite", {
        method: "POST",
        body: JSON.stringify({
          id,
          favorite: !data.favorite,
        }),
      });
      await processResponse(response);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    Dialog.confirm({
      content: "确定删除该笔记吗?",
      onConfirm: async () => {
        const response = await fetch("/api/note/delete", {
          method: "POST",
          body: JSON.stringify({
            id,
          }),
        });
        await processResponse(response)
        router.back();
      },
    });
  }

  if (!data) {
    return null
  }

  return (
    <div id="detail-page">
      <NavBar {...data.note.author} isMine={data.isMine} onDeleted={handleDelete} />
      <Detail {...data.note} />
      <Footer {...data} onLike={handleLike} onFavorite={handleFavorite} />
    </div>
  );
}

