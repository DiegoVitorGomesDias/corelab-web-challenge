import "./index.css"
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Note } from "./../../Components/note"
import axios from "axios";
import { typeUser, typeNotes } from "./../../types"

export const Dashboard = () => {
    const [newNote, setNewNote] = useState({ title: "", description: "", isFavorite: false } as typeNotes)
    const [notes, setNotes] = useState(useLoaderData() as typeNotes[])
    const [search, setSearch] = useState("")

    const login: typeUser = JSON.parse(String(localStorage.getItem("user"))) || { user: "none" }
    const authorid = window.location.pathname.replace("/", "");
    const isAdmin = authorid === login.user.id;

    const postNote = async (props: React.FormEvent<HTMLFormElement>) => {
        props.preventDefault();
        if (!newNote.title) return;
        const res = await axios({
            method: "patch",
            baseURL: process.env.REACT_APP_API_URL,
            url: "note",
            headers: { Authorization: `Bearer ${login.accessToken}` },
            data: newNote
        })
        setNotes([res.data, ...notes])
        setNewNote({ ...newNote, title: "", description: "", isFavorite: false })
    }

    return <div id="page-dashboard">
        <header>
            <a href="/"><span><img src="./assets/iconMain.png" alt="note icon" />CoreNotes</span></a>
            <div>
                <form>
                    <input type="text" name="search" id="search" placeholder='Pesquisar notas'
                        onChange={({ currentTarget }) => setSearch(currentTarget.value)}
                    />
                    <label htmlFor="search"><img src="./assets/search.svg" alt="search" /></label>
                </form>
            </div>
            <img src="./assets/close.svg" alt="close" />
        </header>
        <section>
            {
                isAdmin ?
                    <form id="createNote" onSubmit={postNote}>
                        <span>
                            <input type="text" name="title" id="title" placeholder="Título"
                                onChange={({ target }) => setNewNote({ ...newNote, title: target.value })}
                                value={newNote.title}
                            />
                            <img alt="isFavorite"
                                src={newNote.isFavorite ? "/assets/starOn.svg" : "/assets/starOff.svg"}
                                onClick={() => setNewNote({ ...newNote, isFavorite: !newNote.isFavorite })}
                            />
                        </span>
                        <input
                            type="text" placeholder="Criar nota..."
                            name="description" id="description"
                            onChange={({ target }) => setNewNote({ ...newNote, description: target.value })}
                            value={newNote.description || ""}
                        />
                        <button type="submit"></button>
                    </form>
                    : ""
            }
            <main>
                <h3>Favoritas</h3>
                <div>
                    {
                        notes
                            .filter((note) => note.isFavorite)
                            .filter(({ title, description }) =>
                                new RegExp(`${search.toLowerCase()}`)
                                    .test(`${title.toLowerCase()}${description?.toLowerCase()}`))
                            .map((note: typeNotes) =>
                                <Note data={note} login={login} allNotes={{ list: notes, set: setNotes }} key={note.id} />
                            )
                    }
                </div>
                <h3>Outras</h3>
                <div>
                    {
                        notes
                            .filter((note) => !note.isFavorite)
                            .filter(({ title, description }) =>
                                new RegExp(`${search.toLowerCase()}`)
                                    .test(`${title.toLowerCase()}${description?.toLowerCase()}`))
                            .map((note: typeNotes) =>
                                <Note data={note} login={login} allNotes={{ list: notes, set: setNotes }} key={note.id} />
                            )
                    }
                </div>
            </main>
        </section>
    </div>
}