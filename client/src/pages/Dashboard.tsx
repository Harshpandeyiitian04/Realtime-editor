import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [documents, setDocuments] = useState<any[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/api/documents", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setDocuments(data));
    }, []);

    const createDocument = async () => {
        const res = await fetch("http://localhost:5000/api/documents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: "Untitled Document" }),
        });

        const data = await res.json();
        navigate(`/editor/${data.id}`);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard 📄</h2>
            <button onClick={createDocument}>➕ New Document</button>
            <ul>
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => navigate(`/editor/${doc.id}`)}
                        style={{
                            padding: 10,
                            marginTop: 10,
                            background: "white",
                            cursor: "pointer",
                            borderRadius: 5,
                        }}
                    >
                        <strong>{doc.title}</strong>

                        <span
                            style={{
                                color:
                                    doc.role === "owner"
                                        ? "green"
                                        : doc.role === "editor"
                                            ? "blue"
                                            : "gray",
                            }}
                        >
                            {doc.role}
                        </span>
                    </div>
                ))}
            </ul>
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
    );
}

export default Dashboard;