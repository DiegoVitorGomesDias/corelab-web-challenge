import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

import jsonwebtoken from "jsonwebtoken";

export const patchNote = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ _typeAuthorization, tokenUser] = (ctx.headers.authorization).split(" ");
    
    const { noteId, title, description, attachment, isFavorite, backgroundColor } = ctx.request.body

    const createNoteFromUser = async ({ authorId }) =>
    {
        const findNote = noteId ? await prisma.note.findMany({ where: { authorId, id: noteId } }) : [];
        const post = findNote.length > 0
        ?
            await prisma.note.update
            ({ 
                where: { id: findNote[0].id },
                data: { authorId, title, description, attachment, isFavorite, backgroundColor },
            })
        :
            await prisma.note.create
            ({ 
                data: { authorId, title, description, attachment, isFavorite, backgroundColor },
            })
        ;

        ctx.body = post;
        return ctx.status = 201;
    }

    try 
    {
        const verifyToken = jsonwebtoken.verify( tokenUser, process.env.JWT_SECRET );
        return createNoteFromUser({ authorId: verifyToken.sub });
    }
    catch (error) { return ctx.status = 400 };
}

export const getNotesFromAuthor = async (ctx) =>
{
    const authorId = String(ctx.request.url).replace("/", "");
    if(!authorId) return ctx.status = 500;

    const getNotes = async ({ authorId }) =>
    {
        try
        {
            const notes = await prisma.note.findMany({ where: {authorId} })
            ctx.body = notes;
            ctx.status = 200;
        } 
        catch (error)
        {
            console.error(error);
            ctx.body = error;
            ctx.status = 500;
        }
    }

    try { return getNotes({ authorId }) } 
    catch (error) { return ctx.status = 400; }
}

export const getAllNotes = async (ctx) =>
{
    try
    {
        ctx.body = await prisma.note.findMany();
        ctx.status = 200;
    } 
    catch (error)
    {
        console.error(error);
        ctx.body = error;
        ctx.status = 500;
    }    
}

export const deleteNote = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ _typeAuthorization, token ] = (ctx.headers.authorization).split(" ");
    const { noteId } = ctx.request.body

    try 
    {
        const verifyToken = jsonwebtoken.verify( token, process.env.JWT_SECRET );
        const authorId = verifyToken.sub;
        console.log({ authorId, noteId });
        const dataDelete = await prisma.note.deleteMany({ where: { authorId, id: noteId } });
        return ctx.body = dataDelete;
    }
    catch (error) { return ctx.status = 400 };
}