const app = require("./src/app");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}\n`);
});

// process.on("SIGINT", () => {
//     server.close(() => console.log("\n => Server exit"));
// });
