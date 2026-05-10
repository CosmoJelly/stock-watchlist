const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
  console.log("✅ WebSocket Connected");
};

socket.onerror = (err) => {
  console.error("❌ WebSocket Error:", err);
};

socket.onclose = () => {
  console.log("❌ WebSocket Closed");
};

export default socket;
