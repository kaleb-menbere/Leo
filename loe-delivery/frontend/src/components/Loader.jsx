import React from "react";

function Loader({ text = "Loading..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", padding: 16 }}>
      <div className="spinner" style={{
        width: 24,
        height: 24,
        border: "3px solid #eee",
        borderTop: "3px solid #FF7A00",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <span>{text}</span>
      <style>{`@keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

export default Loader;
