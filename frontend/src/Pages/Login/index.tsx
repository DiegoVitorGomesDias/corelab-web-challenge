import "./index.css"
import { NavLink } from "react-router-dom"
import React, { ChangeEvent, useState } from "react"
import axios, { AxiosResponse } from "axios";

export const Login = () => {
    type login = { email: string, password: string }
    const [valuelogin, setValueLogin] = useState({ email: "", password: "" } as login)
    const [loading, setLoading] = useState(false as boolean)

    const setValues = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === "email") valuelogin.email = target.value;
        if (target.name === "password") valuelogin.password = target.value;
        setValueLogin(valuelogin);
    }

    type data = { AxiosResponse: AxiosResponse, data: { acessToken: string, user: { id: string, name: string, email: string } } }
    const getLogin = async (form: React.FormEvent) => {
        form.preventDefault();
        setLoading(true);
        try {
            const response: data = await axios
                ({
                    method: "get",
                    baseURL: process.env.REACT_APP_API_URL,
                    url: "/login",
                    auth: { username: valuelogin.email, password: valuelogin.password }
                });
            localStorage.setItem("user", JSON.stringify(response.data));
            window.location.pathname = `/${response.data.user.id}`
        }
        catch (error) {
            alert(`Login Invalid! Try again or register.`)
        }
        setLoading(false)
    }

    return <div id="page-login">
        <h1>Login</h1>
        <form onSubmit={getLogin} method="get">
            <label htmlFor="email">E-mail:</label>
            <input type="email" name="email" id="email"
                onChange={setValues} />

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password"
                onChange={setValues} />

            <button type="submit">{!loading ? "Enter" : "..."}</button>
            <NavLink to={"/register"} className={"navlink"}><button title="register">Register</button></NavLink>
        </form>
    </div>
}