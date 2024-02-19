"use client";

import Note from "@/components/NoteItem";
import { useProcessResponse } from "@/hooks";
import { useEffect, useState } from "react";

export default function List({ id }: { id?: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const processResponse = useProcessResponse()

  useEffect(() => {
    (async () => {
        if (!id) return;
        const response = await fetch(`/api/favorite?userId=${id}`, {
            next: {
                revalidate: 0,
            }
        })
        const data = await processResponse(response)
        setNotes(data.data || []);
    })()
  }, [id]);

  if (!notes) {
    return <div>空空如也</div>;
  }

  return (
    <div>
      {notes.map((note) => (
        <Note key={note.id} {...note} />
      ))}
    </div>
  );
}
