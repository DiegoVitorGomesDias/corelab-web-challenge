import Router from "@koa/router";

import * as user from "./user/index.js";
import * as note from "./note/index.js";

export const router = new Router();

router.get("/", (ctx) => ctx.body = "Bem Vindo");

// router.get("/users", user.getUsers); //Disabled for Production
router.get("/login", user.login);
router.post("/user", user.createUser);
router.delete("/user", user.deleteUser);

router.get("/allnotes", note.getAllNotes);
router.get("/notes", note.getNotesFromAuthor);
router.patch("/note", note.patchNote);
router.delete("/note", note.deleteNote);


router.get("/:authorid", note.getNotesFromAuthor);