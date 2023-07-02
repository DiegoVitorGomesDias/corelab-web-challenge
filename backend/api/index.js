import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

import { app } from "./setup.js";
app.listen(PORT);

console.log(`Listen in http://localhost:${PORT}/`)