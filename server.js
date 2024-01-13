const app = require("./src/app");
const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}\n`);
});

// process.on("SIGINT", () => {
//     server.close(() => console.log("\n => Server exit"));
// });
