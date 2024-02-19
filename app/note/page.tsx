import NoteList from "@/components/NoteList";
import PageHeader from "@/components/PageHeader";

export default function Note() {
  return (
    <div id="note-page">
      <PageHeader>我的笔记</PageHeader>
      <NoteList url="/api/note/list" />
    </div>
  );
}
