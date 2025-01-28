import RichTextEditor from "./RichTextEditor";
import './global.css'; // Global styles only

export default function Home() {
  return (
    <div className = "bg-container">
      <h1 className="text-2xl font-bold mb-4 text">Todo List</h1>
      <RichTextEditor />
    </div>
  );
}
