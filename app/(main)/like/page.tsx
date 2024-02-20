import NoteList from "@/components/NoteList";
import PageHeader from "@/components/PageHeader";

export default function Favorite() {
  return (
    <div id="note-page">
      <PageHeader backArrow={false}>我的喜欢</PageHeader>
      <NoteList url="/api/my/likes" />
    </div>
  );
}
