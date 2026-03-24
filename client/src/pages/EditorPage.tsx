import { useParams, useNavigate } from "react-router-dom";
import Editor from "../Editor";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://realtime-editor-e85n.onrender.com");

function EditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("Untitled");
    const [users, setUsers] = useState<any[]>([]);
    const [typingUser, setTypingUser] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [shareEmail, setShareEmail] = useState("");
    const [shareRole, setShareRole] = useState("viewer");

    const token = localStorage.getItem("token");
    const saveTimeout = useRef<any>(null);
    const userRole = users.find(
        (u) => u.email === localStorage.getItem("email")
    )?.role;

    useEffect(() => {
        if (!id) return;
        socket.emit("join-document", {
            documentId: id,
            user: {
                email: localStorage.getItem("email") || "user",
                role: "editor",
            },
        });

        fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch document");
                }
                return res.json();
            })
            .then((data) => {
                setContent(data?.content || "");
                setTitle(data?.title || "Untitled");
            })
            .catch((err) => {
                console.error("Error:", err.message);
                if (err.message.includes("401")) {
                    alert("Session expired, please login again");
                    window.location.href = "/login";
                }
            });

        socket.on("receive-changes", setContent);
        socket.on("active-users", setUsers);
        socket.on("cursor-update", setTypingUser);
        socket.emit("leave-document", id);

        fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}/history`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setHistory);

        fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setComments);

        return () => {
            socket.off("receive-changes");
            socket.off("active-users");
            socket.off("cursor-update");
        };
    }, [id]);

    const handleChange = (value: string) => {
        setContent(value);

        socket.emit("send-changes", { documentId: id, content: value });

        socket.emit("cursor-move", {
            documentId: id,
            email: localStorage.getItem("email"),
        });

        if (saveTimeout.current) clearTimeout(saveTimeout.current);

        saveTimeout.current = setTimeout(() => {
            fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: value }),
            });
        }, 1000);
    };

    const handleTitleBlur = () => {
        fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}/title`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
        });
    };

    const handleComment = async () => {
        const res = await fetch(
            `https://realtime-editor-e85n.onrender.com/api/documents/${id}/comment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: comment }),
            }
        );

        const data = await res.json();

        fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setComments);

        setComment("");
    };

    const handleDelete = async () => {
        if (!confirm("Delete document?")) return;

        await fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/dashboard");
    };

    const timeAgo = (date: string) => {
        const now = new Date().getTime();
        const past = new Date(date).getTime();

        const seconds = Math.floor((now - past) / 1000);

        if (seconds < 10) return "just now";
        if (seconds < 60) return seconds + " sec ago";

        if (seconds < 3600) {
            return Math.floor(seconds / 60) + " min ago";
        }

        if (seconds < 86400) {
            return Math.floor(seconds / 3600) + " hrs ago";
        }

        return Math.floor(seconds / 86400) + " days ago";
    };

    const handleShare = async () => {
        const res = await fetch(
            `https://realtime-editor-e85n.onrender.com/api/documents/${id}/share`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: shareEmail,
                    role: shareRole,
                }),
            }
        );

        const data = await res.json();
        alert(data.message || data.error);
    };

    const handleSave = async () => {
        await fetch(`https://realtime-editor-e85n.onrender.com/api/documents/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        });

        alert("Saved!");
    };

    const handleSaveAs = async () => {
        const res = await fetch(`https://realtime-editor-e85n.onrender.com/api/documents`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title + " (Copy)",
                content: content,
            }),
        });

        const data = await res.json();

        navigate(`/editor/${data.id}`);
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ width: "250px", padding: 10, background: "#f1f1f1" }}>
                <h4>👥 Active Users</h4>
                {users.map((u, i) => (
                    <div key={i}>
                        {u.email} - <b>{u.role}</b>
                    </div>
                ))}

                <h4>Typing</h4>
                <div>{typingUser}</div>

                <h4>History</h4>
                {history.map((h, i) => (
                    <div key={i}>
                        {h.email} - {timeAgo(h.created_at)}
                    </div>
                ))}

                <h4>Comments</h4>
                <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={handleComment}>Add</button>

                {comments.map((c, i) => (
                    <div key={i}>
                        <strong>{c.email}</strong>: {c.text}
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
                    <button onClick={() => navigate("/dashboard")}>Back</button>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleSaveAs}>Save As</button>

                    {userRole !== "viewer" && (
                        <button onClick={handleDelete}>Delete</button>
                    )}
                    <input
                        placeholder="Share email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                    />

                    <select
                        value={shareRole}
                        onChange={(e) => setShareRole(e.target.value)}
                    >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                    </select>

                    <button onClick={handleShare}>Share</button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                        }}
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            background: "red",
                            color: "white",
                            padding: "6px 12px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Logout
                    </button>
                </div>
                <div style={{ padding: 20 }}>
                    <Editor
                        content={content}
                        onChange={userRole === "viewer" ? () => { } : handleChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default EditorPage;