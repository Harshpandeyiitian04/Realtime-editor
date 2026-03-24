import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        const res = await fetch("https://realtime-editor-e85n.onrender.com/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful");
            navigate("/login");
        } else {
            alert(data.error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Signup</h2>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br /><br />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
}

export default Signup;