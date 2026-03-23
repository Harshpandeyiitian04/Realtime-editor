import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
    content: string;
    onChange: (value: string) => void;
};

const Editor = ({ content, onChange }: Props) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editorProps: {
            attributes: {
                style:
                    "min-height:300px; outline:none; font-size:16px; line-height:1.6;",
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content]);

    return <EditorContent editor={editor} />;
};

export default Editor;