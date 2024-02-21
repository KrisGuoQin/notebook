import NoteList from "@/components/NoteList";
import PageHeader from "@/components/PageHeader";

export default function Note() {
  return (
    <div id="draft-page">
      <PageHeader>我的草稿</PageHeader>
      <NoteList url="/api/note/drafts" draft/>
    </div>
  );
}
