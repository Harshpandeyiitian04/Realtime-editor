import { useParams, useNavigate } from "react-router-dom";
import Editor from "../Editor";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

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

        fetch(`http://localhost:5000/api/documents/${id}`, {
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

        fetch(`http://localhost:5000/api/documents/${id}/history`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setHistory);

        fetch(`http://localhost:5000/api/documents/${id}/comments`, {
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
            fetch(`http://localhost:5000/api/documents/${id}`, {
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
        fetch(`http://localhost:5000/api/documents/${id}/title`, {
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
            `http://localhost:5000/api/documents/${id}/comment`,
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

        fetch(`http://localhost:5000/api/documents/${id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setComments);

        setComment("");
    };

    const handleDelete = async () => {
        if (!confirm("Delete document?")) return;

        await fetch(`http://localhost:5000/api/documents/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/dashboard");
    };

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "just now";
        if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + " hrs ago";
        return Math.floor(seconds / 86400) + " days ago";
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ width: "250px", padding: 10, background: "#f1f1f1" }}>
                <h4>👥 Active Users</h4>
                {users.map((u, i) => (
                    <div key={i}>{u.email} ({u.role})</div>
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

                    {userRole !== "viewer" && (
                        <button onClick={handleDelete}>Delete</button>
                    )}
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