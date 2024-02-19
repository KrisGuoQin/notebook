'use client';

import Header from "@/components/Header";
import NoteList from "@/components/NoteList";

export default function Home() {
  return (
    <div id="home-page">
      <Header />
      <NoteList style={{ paddingTop: 72 }} url="/api/home" />
    </div>
  );
}