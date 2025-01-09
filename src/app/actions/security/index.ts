import axios from 'axios';
import {Connection} from "@/types";

const BASE_URL = "http://localhost:8080/api/security";


export const createTDEPolicy = async (connection: Connection, tablespaceName: string, encryptionAlgorithm: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/tde/configure`, connection, {
            params: {tablespaceName, encryptionAlgorithm},
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de la création du rôle.");
    }
}