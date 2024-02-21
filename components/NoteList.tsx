"use client";

import NoteItem from "@/components/NoteItem";
import { useRequest } from "ahooks";
import { useProcessResponse } from "@/hooks";
import { useEffect, type CSSProperties, ReactNode } from "react";
import Empty from "./Empty";
import { useAtom } from "jotai";
import { userAtom } from "@/state";
import type {  User, Note } from '@/server';

export interface NoteType {
  note: Note & { author: User };
  likeCount?: number;
  isMyLike?: boolean;
}

interface IProps {
  url: string;
  draft?: boolean;
  className?: string;
  style?: CSSProperties;
  empty?: ReactNode;
}

export default function NoteList({
  url,
  style,
  className,
  draft,
  empty,
}: IProps) {
  const [user] = useAtom(userAtom);
  const processResponse = useProcessResponse();

  const {
    data: list,
    error,
    loading,
    refresh,
  } = useRequest(
    async () => {
      const response = await fetch(url, {
        next: {
          revalidate: 0,
        },
      });
      const data = await processResponse(response);

      return data.data as NoteType[];
    },
    {
      refreshDeps: [user],
    }
  );

  const handleLike = async (id: string, like: boolean) => {
    try {
      const response = await fetch("/api/note/like", {
        method: "POST",
        body: JSON.stringify({
          id,
          like,
        }),
      });
      await processResponse(response);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    error && console.error(error);
  }, [error]);

  if (error) {
    return <div>发生了错误</div>;
  }

  if (!list?.length && !loading) {
    return empty ? empty : <Empty />;
  }

  return (
    <div className={`feeds-page ${className ?? ""}`} style={style}>
      <div className="feeds-container">
        {list?.map((item) => (
          <NoteItem
            key={item.note.id}
            data={item}
            draft={draft}
            onLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
}
