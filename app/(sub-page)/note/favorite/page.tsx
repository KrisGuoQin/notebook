import NoteList from "@/components/NoteList";
import PageHeader from "@/components/PageHeader";

export default function Favorite() {
  return (
    <div id="draft-page">
      <PageHeader>我的收藏</PageHeader>
      <NoteList url="/api/note/favorites"/>
    </div>
  );
}
