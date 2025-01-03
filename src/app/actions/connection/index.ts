import axios from "axios";
import {Connection} from "@/types";

// Définir l'URL de base et le point d'entrée
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const ENDPOINT_URL = "/api/connections";



// Actions serveur pour gérer les connexions

/**
 * Crée une nouvelle connexion.
 * @param connection Détails de la connexion.
 */
export const createConnection = async (connection: Connection) => {
    console.log(API_BASE_URL);
    try {
        const response = await axios.post(`http://localhost:8080${ENDPOINT_URL}/save`, connection);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data || error.message || "Erreur lors de la création de la connexion.");
    }
};

/**
 * Récupère toutes les connexions.
 */
export const getAllConnections = async (): Promise<Connection[]> => {
    try {
        const response = await axios.get(`http://localhost:8080${ENDPOINT_URL}/all`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data || error.message || "Erreur lors de la récupération des connexions.");
    }
};

/**
 * Récupère une connexion par son nom.
 * @param connectionName Nom de la connexion.
 */
export const getConnectionByName = async (connectionName: string): Promise<Connection> => {
    try {
        const response = await axios.get(`http://localhost:8080${ENDPOINT_URL}/${connectionName}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data || error.message || `Erreur lors de la récupération de la connexion : ${connectionName}.`);
    }
};

/**
 * Récupère toutes les connexions associées à un clientId.
 * @param clientId Identifiant unique du client.
 */
export const getConnectionsByClientId = async (clientId: string): Promise<Connection[]> => {
    try {
        const response = await axios.get(`http://localhost:8080${ENDPOINT_URL}/user/${clientId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data || error.message || `Erreur lors de la récupération des connexions pour le clientId : ${clientId}.`);
    }
};

/**
 * Supprime une connexion par son nom.
 * @param connectionId Nom de la connexion.
 */
export const deleteConnectionById = async (connectionId: string) => {
    try {
        const response = await axios.delete(`http://localhost:8080${ENDPOINT_URL}/${connectionId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data || error.message || `Erreur lors de la suppression de la connexion : ${connectionId}.`);
    }
};

/**
 * Teste une connexion à la base de données.
 * @param connection Détails de la connexion.
 */
export const testConnection = async (connection: Connection): Promise<string> => {
    try {
        const response = await axios.post(`http://localhost:8080${ENDPOINT_URL}/test`, connection);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data || error.message || "Erreur lors du test de connexion.");
    }
};
