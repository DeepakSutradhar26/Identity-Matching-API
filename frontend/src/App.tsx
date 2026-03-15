import { useState } from 'react';
import './App.css'

function App() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async() => {
    const res = await fetch("https://identity-matching-api-jv8j.vercel.app/identify", {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email || null,
        phoneNumber: phone || null,
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return <div style = {{padding : 30}}>
    <h1>Indentity Matching API</h1>

    <input
      placeholder='Email'
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    >
    </input>
    <input
      placeholder='Phone Number'
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    >
    </input>

    <button onClick={handleSubmit}> Submit </button>

    {result && (<pre>{JSON.stringify(result, null, 2)}</pre>)}

  </div>;
}

export default App
