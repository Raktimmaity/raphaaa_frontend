// import React, { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import axios from "axios";
// import { toast } from "sonner";

// const AdminAboutSettings = () => {
//   const [loading, setLoading] = useState(false);

//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: "<p>Loading...</p>",
//   });

//   // Load existing content
//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/settings/about`);
//         editor?.commands.setContent(data.content || "");
//       } catch {
//         toast.error("Failed to fetch about content");
//       }
//     };
//     if (editor) fetchContent();
//   }, [editor]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const content = editor.getHTML();
//       await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/settings/about`, { content });
//       toast.success("About content updated successfully!");
//     } catch {
//       toast.error("Failed to update content");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow-xl rounded-xl border border-gray-200">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit About Us Page</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="bg-white border border-gray-300 rounded-md p-4 min-h-[200px]">
//           <EditorContent editor={editor} />
//         </div>
//         <div className="pt-4 text-right">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-md mt-4"
//           >
//             {loading ? "Saving..." : "Update About Us"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminAboutSettings;
