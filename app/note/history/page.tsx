import NoteList from "@/components/NoteList";
import PageHeader from "@/components/PageHeader";

export default function History() {
  return (
    <div id="history-page">
      <PageHeader>我的足迹</PageHeader>
      <NoteList url="/api/note/history"/>
    </div>
  );
}
