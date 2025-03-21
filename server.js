const express = require("express");
const WebSocket = require("ws");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 10000;

// Serve a simple message on the root route
app.get("/", (req, res) => {
    res.send("WebSocket Server is running!");
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Create WebSocket Server
const wss = new WebSocket.Server({ server });

console.log("WebSocket server is running...");

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.send("Welcome to the WebSocket server!");

    ws.on("message", (message) => {
        console.log(`Received: ${message}`);

        // Broadcast message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Client says: ${message}`);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
