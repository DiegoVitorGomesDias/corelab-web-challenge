import "./index.css"
import { NavLink } from "react-router-dom"

export const Home = () => {
    return <div id="page-home">
        <img src="/assets/iconMain.png" alt="" />
        <h1>CoreNotes</h1>
        <NavLink to={"/login"} className={"navlink"}><button title="login" tabIndex={1}>Login</button></NavLink>
        <NavLink to={"/register"} className={"navlink"}><button title="register">Register</button></NavLink>
    </div>
}