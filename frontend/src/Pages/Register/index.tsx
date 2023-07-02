import "./index.css"
import { NavLink } from "react-router-dom"
import React, { ChangeEvent, useState } from "react"
import axios, { AxiosResponse } from "axios";

export const Register = () => {
    type register = { name: string, username: string, email: string, password: string }
    const [valueRegister, setValueRegister] = useState({ name: "", username: "", email: "", password: "" } as register)

    const setValues = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === "name") valueRegister.name = target.value;
        if (target.name === "username") valueRegister.username = target.value.toLowerCase();
        if (target.name === "email") valueRegister.email = target.value;
        if (target.name === "password") valueRegister.password = target.value;
        setValueRegister(valueRegister)
    }

    type data = { AxiosResponse: AxiosResponse, data: { acessToken: string, user: { id: string, name: string, email: string } } }
    const getregister = async (form: React.FormEvent) => {
        form.preventDefault();
        try {

            const register = await axios
                ({
                    method: "post",
                    baseURL: process.env.REACT_APP_API_URL,
                    url: "/user",
                    data: valueRegister
                });
            if (register.status !== 201) new Error("Attention: Register Invalid!")

            const response: data = await axios
                ({
                    method: "get",
                    baseURL: process.env.REACT_APP_API_URL,
                    url: "/login",
                    auth: { username: valueRegister.email, password: valueRegister.password }
                });
            localStorage.setItem("user", JSON.stringify(response.data));
            window.location.pathname = `/${response.data.user.id}`
        }
        catch (error) {
            alert(`Register Invalid! Username or email already exist. Try again.`)
        }
    }

    return <div id="page-register">
        <h1>Register</h1>
        <form onSubmit={getregister} method="get">
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" id="name"
                onChange={setValues} />

            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="username" pattern="[a-zA-Z]{1,15}"
                onChange={setValues} />

            <label htmlFor="email">E-mail:</label>
            <input type="email" name="email" id="email"
                onChange={setValues} />

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password"
                onChange={setValues} />

            <button type="submit">Enter</button>
            <NavLink to={"/login"} className={"navlink"}><button title="login">Login</button></NavLink>
        </form>
    </div>
}