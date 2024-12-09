import React, { useState } from "react";

const Notification = () => {
//   const [token, setToken] = useState("");
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");

  return (
    <div>
      <h1>Send Notification</h1>
      <input
        type="text"
        placeholder="FCM Token"
        // value={token}
        // onChange={(e) => setToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="Notification Title"
        // value={title}
        // onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Notification Body"
        // value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button>Send Notification</button>
    </div>
  );
};

export default Notification;
