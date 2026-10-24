import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/message", (req, res) => {
    res.json({
        message: "Hello Express"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("thanakrit wongwitsut");
});