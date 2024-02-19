'use client'
import NoteItem from "@/components/NoteItem";
import { useRequest } from "ahooks";
import type { Note } from "@/app/api/home/route";
import { useProcessResponse } from "@/hooks";
import { useEffect, type CSSProperties } from 'react';

interface IProps {
    url: string;
    draft?: boolean;
    className?: string;
    style?: CSSProperties;
}

export default function NoteList({ url, style, className, draft }: IProps) {
  const processResponse = useProcessResponse();

  const { data: notes, error, loading } = useRequest(async () => {
    const response = await fetch(url, {
      next: {
        revalidate: 0,
      },
    });
    const data = await processResponse(response);

    return data.data as Note[];
  });

  useEffect(() => {
    error && console.error(error)
  }, [error])

  if (error) {
    return <div>发生了错误，{}</div>
  }

  if (!notes && !loading) {
    return <div>空空如也</div>;
  }


  return (
    <div className={`feeds-page ${className ?? ''}`} style={style}>
      <div className="feeds-container">
        {notes?.map((note) => (
          <NoteItem key={note.id} {...note} draft />
        ))}
      </div>
    </div>
  );
}
