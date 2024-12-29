import axios from "axios";
import { Connection } from "@/types";

// Définir l'URL de base pour l'API
const BASE_URL = "http://localhost:8080/api/roles";

// Créer un rôle
export const saveRole = async (roleName: string, connection: Connection): Promise<string> => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, null, {
            params: { roleName, ...connection },
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de la création du rôle.");
    }
};

// Supprimer un rôle
export const deleteRole = async (roleName: string, connection: Connection): Promise<string> => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete`, {
            params: { roleName, ...connection },
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de la suppression du rôle.");
    }
};

// Accorder un privilège système à un rôle
export const grantSystemPrivilege = async (roleName: string, privilege: string, connection: Connection): Promise<string> => {
    try {
        const response = await axios.post(`${BASE_URL}/grant/system`, null, {
            params: { roleName, privilege, ...connection },
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de l'attribution du privilège système.");
    }
};

// Révoquer un privilège système d'un rôle
export const revokeSystemPrivilege = async (roleName: string, privilege: string, connection: Connection): Promise<string> => {
    try {
        const response = await axios.post(`${BASE_URL}/revoke/system`, null, {
            params: { roleName, privilege, ...connection },
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de la révocation du privilège système.");
    }
};

// Accorder un privilège objet à un rôle sur une table
export const grantObjectPrivilege = async (roleName: string, privilege: string, tableName: string, connection: Connection): Promise<string> => {
    try {
        const response = await axios.post(`${BASE_URL}/grant/object`, null, {
            params: { roleName, privilege, tableName, ...connection },
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de l'attribution du privilège objet.");
    }
};

// Révoquer un privilège objet d'un rôle sur une table
export const revokeObjectPrivilege = async (roleName: string, privilege: string, tableName: string, connection: Connection): Promise<string> => {
    try {
        const response = await axios.post(`${BASE_URL}/revoke/object`, null, {
            params: { roleName, privilege, tableName, ...connection },
        });
        return response.data.message;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de la révocation du privilège objet.");
    }
};

// Récupérer tous les rôles
export const getAllRoles = async (connection: Connection): Promise<any[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/all`, {
            params: { ...connection },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || error.message || "Erreur lors de la récupération des rôles.");
    }
};
