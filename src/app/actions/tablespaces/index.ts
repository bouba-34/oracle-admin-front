import axios from 'axios';
import {Connection, TableSpace} from "@/types";

const BASE_URL = "http://localhost:8080/api/tablespaces";


export const getAllTableSpaces = async (connection: Connection) => {
    try {
        const response = await axios.get(`${BASE_URL}/all`, {
            params: connection,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const createTableSpace = async (tableSpace: TableSpace, connection: Connection) => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, tableSpace, {
            params: connection,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getTableSpaceDetail = async (tableSpaceName: string, connection: Connection) => {
    try {
        const response = await axios.get(`${BASE_URL}/${tableSpaceName}/file-usage`, {
            params: connection,
        });
        //console.log(response.data);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const deleteTableSpace = async (tableSpaceName: string,includingContentsAndDataFiles: boolean,  connection: Connection) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${tableSpaceName}`, {
            params: { includingContentsAndDataFiles, ...connection },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}