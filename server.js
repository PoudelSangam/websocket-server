const express = require("express");
const WebSocket = require("ws");
const http = require("http");

// Create an Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Create an HTTP server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

console.log(`WebSocket server started on port ${PORT}`);

// Store connected clients
const clients = new Map();

wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
        console.log("Received:", message);

        // Parse the JSON message
        let msgData;
        try {
            msgData = JSON.parse(message);
        } catch (error) {
            console.error("Invalid JSON:", message);
            return;
        }

        // Ensure required fields are present
        if (!msgData.msg || !msgData.outgoing_id || !msgData.incoming_id) {
            console.warn("Invalid message format", msgData);
            return;
        }

        // Store the client by outgoing_id
        clients.set(msgData.outgoing_id, ws);

        // Broadcast message to the intended recipient
        clients.forEach((client, clientId) => {
            if (client.readyState === WebSocket.OPEN && clientId == msgData.incoming_id) {
                client.send(JSON.stringify(msgData));
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        clients.forEach((client, id) => {
            if (client === ws) {
                clients.delete(id);
            }
        });
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Serve static files from the public directory
