const app = require("./src/app");
const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// process.on("unhandledRejection", (err) => {
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     })
// })
process.on("SIGINT", () => {
    server.close(() => console.log("\n => Server exit"));
});
