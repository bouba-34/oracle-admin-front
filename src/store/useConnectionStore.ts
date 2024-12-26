import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {Connection} from "@/types";



type ConnectionStore = {
    clientId: string;
    activeConnection: Connection | null;
    setActiveConnection: (connection: Connection) => void;
    clearActiveConnection: () => void;
};

// Zustand store
export const useConnectionStore = create<ConnectionStore>((set) => ({
    // Generate clientId once and store it
    clientId: (() => {
        const storedClientId = localStorage.getItem("clientId");
        if (storedClientId) return storedClientId;

        const newClientId = uuidv4();
        localStorage.setItem("clientId", newClientId);
        return newClientId;
    })(),

    // Retrieve the active connection from localStorage
    activeConnection: (() => {
        const storedConnection = localStorage.getItem("activeConnection");
        return storedConnection ? JSON.parse(storedConnection) : null;
    })(),

    // Set a new active connection and save it to localStorage
    setActiveConnection: (connection) =>
        set(() => {
            localStorage.setItem("activeConnection", JSON.stringify(connection));
            return { activeConnection: connection };
        }),

    // Clear the active connection and remove it from localStorage
    clearActiveConnection: () =>
        set(() => {
            localStorage.removeItem("activeConnection");
            return { activeConnection: null };
        }),
}));
