import axios from 'axios';
import {Connection, User} from "@/types";

export const BASE_URL = "http://localhost:8080/api/users";

export const createUser = async (user: User, connection: Connection) => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, connection, {params: user});
        return response.data;
    } catch (error) {
        return error;
    }
}


export const getAllUsers = async (connection:Connection) => {
    try {
        const response = await axios.get(`${BASE_URL}/all`, {params: connection});
        //console.log("action", response.data);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const deleteUser = async (targetUsername: string, connection: Connection) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete`, {params: {targetUsername, ...connection}});
        return response.data;
    } catch (error) {
        return error;
    }
}