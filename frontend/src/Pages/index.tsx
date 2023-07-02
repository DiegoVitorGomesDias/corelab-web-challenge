import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { Home } from "./Home"
import { Login } from "./Login"
import { Register } from "./Register"
import { Dashboard } from "./Dashboard"
import axios from "axios";

const router = createBrowserRouter
    ([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: ":authorid",
            element: <Dashboard />,
            loader: async ({ params }) => {
                const response = await axios
                    ({
                        method: "get",
                        baseURL: process.env.REACT_APP_API_URL,
                        url: params.authorid,
                    });
                return response.data
            }
        },
    ]);

export const Router = () => <RouterProvider router={router} />;