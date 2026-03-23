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
                    <li
                        key={doc.id}
                        style={{ cursor: "pointer", marginTop: 10 }}
                        onClick={() => navigate(`/editor/${doc.id}`)}
                    >
                        {doc.title || "Untitled"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;