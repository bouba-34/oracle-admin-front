import axios from 'axios';

import { Connection } from "@/types";

const BASE_URL = "http://localhost:8080/api/performance";

export const getSlowQueries = async (connection: Connection) => {
    try {
        const response = await axios.get(`${BASE_URL}/slow-queries`, {
            params: connection,
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getSqlTuningAdvisor = async (connection: Connection, sqlId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/tune-query`, {
            params: { ...connection, sqlId },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}