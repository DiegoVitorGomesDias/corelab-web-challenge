import axios from "axios"
import "./index.css"
import { useEffect, useState } from "react"
import { typeUser, typeNotes } from "../../types"

export const Note =
    ({ data, login, allNotes }:
        {
            data: typeNotes, login: typeUser,
            allNotes: { list: typeNotes[], set: React.Dispatch<React.SetStateAction<typeNotes[]>> }
        }) => {

        const [inEdit, setInEdit] = useState(false as boolean)
        const [handleFavorite, sethandleFavorite] = useState(data.isFavorite)
        const [handleColor, sethandleColor] = useState(data.backgroundColor)
        const [activePalette, setActivePallete] = useState(false as boolean)

        const authorid = window.location.pathname.replace("/", "");
        const isAdmin = authorid === login.user.id;

        const deleteNote = async () => {
            await axios({
                method: "delete",
                baseURL: process.env.REACT_APP_API_URL,
                url: "note",
                headers: { Authorization: `Bearer ${login.accessToken}` },
                data: { noteId: data.id }
            })
            allNotes.set(allNotes.list.filter((note) => note.id !== data.id))
        }

        useEffect(() => {
            if (!login.accessToken) return;

            axios({
                method: "patch",
                baseURL: process.env.REACT_APP_API_URL,
                url: "note",
                headers: { Authorization: `Bearer ${login.accessToken}` },
                data:
                {
                    noteId: data.id,
                    title: data.title,
                    description: data.description,
                    attachment: null,
                    isFavorite: data.isFavorite,
                    backgroundColor: data.backgroundColor
                }
            })
            allNotes.set(JSON.parse(JSON.stringify(allNotes.list)))
        }, [inEdit, handleFavorite, handleColor])


        const handleBackground = (props: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            props.preventDefault()
            sethandleColor(props.currentTarget.title);
            setActivePallete(false)
            data.backgroundColor = props.currentTarget.title;
        }

        const colorInPallete =
            [
                "#BAE2FF", "#B9FFDD", "#FFE8AC", "#FFCAB9", "#F99494", "#9DD6FF",
                "#ECA1FF", "#DAFF8B", "#FFA285", "#CDCDCD", "#979797", "#A99A7C"
            ]

        return <form className="note" style={{ backgroundColor: data.backgroundColor }}>
            <span
                style={{ borderBottom: `1px solid ${data.backgroundColor !== "#FFFFFF" ? "#FFFFFF" : "#D9D9D9"}` }}>
                <input
                    type="text" name="title"
                    id="title" placeholder={data.title}
                    defaultValue={data.title}
                    onChange={({ target }) => data.title = target.value}
                    disabled={!inEdit}
                />
                <img alt=""
                    src={data.isFavorite ? "/assets/starOn.svg" : "/assets/starOff.svg"}
                    onClick={(props) => {
                        props.currentTarget.src =
                            props.currentTarget.src.split("/")[4] === "starOff.svg" && isAdmin
                                ? "/assets/starOn.svg" : "/assets/starOff.svg";
                        data.isFavorite = !data.isFavorite;
                        sethandleFavorite(!handleFavorite);
                    }}
                />
            </span>
            <textarea
                name="description" id="description"
                cols={50} rows={10} placeholder="Criar nota..."
                disabled={!inEdit}
                defaultValue={String(data.description)}
                onChange={({ target }) => data.description = target.value}
            >
            </textarea>
            {
                isAdmin ?
                    <div className="actions">
                        <span>
                            <img src="/assets/pen.svg" alt="pen"
                                className={inEdit ? "inEdit" : ""}
                                onClick={() => setInEdit(!inEdit)}
                            />
                            <img src="/assets/paintBucket.svg" alt="paintBucket"
                                className={activePalette ? "inEdit" : ""}
                                onClick={() => setActivePallete(!activePalette)}
                            />
                            {
                                activePalette
                                    ?
                                    <div className="pallete">
                                        {
                                            colorInPallete.map((color, i) =>
                                                <button style={{ backgroundColor: color }}
                                                    onClick={handleBackground} key={i} title={color}
                                                >
                                                </button>)
                                        }
                                    </div>
                                    : ""
                            }
                        </span>
                        <span>
                            <img src="/assets/close.svg" alt="delete"
                                onClick={deleteNote} />
                        </span>
                    </div>
                    : ""
            }
        </form>
    }