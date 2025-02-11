import {AuthProvider, CheckResponse} from "@refinedev/core";
import appState from "../appState";

// @ts-ignore
import base64 from "base-64";


function getHeaders() {
    const headers = new Headers()
    headers.append("Accept", "application/vnd.api+json")
    return headers
}

export const authProvider: AuthProvider = {
    check: async () => {
        const apiToken = appState.getState().apiToken
        return { authenticated: Boolean(apiToken) } as CheckResponse;
    },
    login: async ({ username, password, domain }: {username: string, password: string, domain: string}) => {
        const setApiToken = appState.getState().setApiToken
        const setApiUrl = appState.getState().setApiUrl

        const headers = getHeaders()
        if((password.startsWith("admin-") || password.startsWith("prod-")) && password.length > 65) {
            headers.set("Authorization", `Bearer ${password}`)
            const res = await fetch(`${domain}/me`, {headers})
            if(res.status === 200) {
                setApiToken(password)
                setApiUrl(`${domain}`)
                return {success: true, redirectTo: "/"}
            }
        } else {
            headers.set("Accept", "application/json")

            const base64Auth = base64.encode(`${username}:${password}`);
            headers.set("Authorization", `Basic ${base64Auth}`)
            const res = await fetch(`${domain}/tokens`, {
                method: "POST",
                headers,
            })
            if(res.ok) {
                const resJson = await res.json()
                setApiToken(resJson.data.attributes.token)
                setApiUrl(`${domain}`)
                return {success: true, redirectTo: "/"}
            }
        }

        return {success: false, redirectTo: "/login"}
    },
    logout: async () => {
        const setApiToken = appState.getState().setApiToken
        const setApiUrl = appState.getState().setApiUrl
        setApiToken("")
        setApiUrl("")
        return { success: true, redirectTo: "/login" }
    },
    onError: async (error) => {
        if(error?.status === 401) {
            return {
                redirectTo: '/',
                error,
                logout: error?.status === 401,
            }
        }
        // else {
        //     return {
        //         error,
        //     }
        // }
        return {
            error
        }

    },
    // optional methods
    register: async (params) => { throw new Error("Not implemented"); },
    forgotPassword: async (params) => { throw new Error("Not implemented"); },
    updatePassword: async (params) => { throw new Error("Not implemented"); },
    getIdentity: async () => {
        const apiToken = appState.getState().apiToken
        const apiUrl = appState.getState().apiUrl

        const headers = getHeaders()
        headers.set("Authorization", `Bearer ${apiToken}`)

        const response = await fetch(`${apiUrl}/me`, { headers })

        if(response.status !== 200) { return null }
        const data = await response.json()
        return data.data.attributes
    },
    getPermissions: async () => { throw new Error("Not implemented"); },
};