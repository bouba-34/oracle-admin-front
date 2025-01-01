"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
    createConnection, deleteConnectionById,
    getConnectionsByClientId,
    testConnection,
} from "@/app/actions/connection";

import { useConnectionStore } from "@/store/useConnectionStore";
import { Connection } from "@/types";

export default function Home() {
    const { clientId, activeConnection, setActiveConnection } = useConnectionStore();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [newConnection, setNewConnection] = useState<Partial<Connection>>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch all connections for the current clientId on mount
    useEffect(() => {
        document.title = "Dashboard";
        const fetchConnections = async () => {
            try {
                const data = await getConnectionsByClientId(clientId);
                setConnections(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des connexions :", error.message);
            }
        };

        fetchConnections();
    }, [clientId]);

    //console.log("Active Connexion :", activeConnection);

    // Handle creation of a new connection
    const handleCreateConnection = async () => {
        if (
            newConnection.ip &&
            newConnection.port &&
            newConnection.serviceName &&
            newConnection.username &&
            newConnection.password // Vérifie que le mot de passe est présent
        ) {
            try {
                setLoading(true);
                const connectionToCreate: Connection = {
                    connectionName: newConnection.connectionName || `conn-${Date.now()}`, // Nom par défaut
                    ...(newConnection as Connection),
                    clientId, // Attach the clientId to the connection
                };
                const createdConnection = await createConnection(connectionToCreate);
                setConnections([...connections, createdConnection]);
                setNewConnection({});
                setIsDialogOpen(false);
            } catch (error: any) {
                console.error("Erreur lors de la création de la connexion :", error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle deletion of a connection
    const handleDeleteConnection = async (connectionId: string, connectionName: string) => {
        try {
            setLoading(true);
            await deleteConnectionById(connectionId);
            setConnections(connections.filter((conn) => conn.connectionName !== connectionName));
            if(activeConnection?.connectionName === connectionName) {
                setActiveConnection({
                    clientId,
                    connectionName: "",
                    ip: "",
                    port: "",
                    serviceName: "",
                    username: "",
                    password: "",
                    role: "",
                });
            }
        } catch (error: any) {
            console.error("Erreur lors de la suppression de la connexion :", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle testing of a connection
    const handleTestConnection = async (connection: Connection) => {
        try {
            setLoading(true);
            const status = await testConnection(connection);
            console.log("Statut de la connexion :", status);
            setConnections(
                connections.map((conn) =>
                    conn.connectionName === connection.connectionName
                        ? { ...conn, status: status === "success" ? "success" : "failed" }
                        : conn
                )
            );
        } catch (error: any) {
            console.error("Erreur lors du test de la connexion :", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle setting a connection as active
    const handleSetActiveConnection = (connection: Connection) => {
        setActiveConnection(connection);
        console.log("Connexion active définie :", connection);
    };

    const totalConnections = connections.length;
    //const activeConnections = connections.filter((conn) => conn.status === "Active").length;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Active Database Connections</h1>

            {/* Stats Section */}
            <div className="mb-6 flex gap-4">
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Connections</h3>
                    <p className="text-2xl">{totalConnections}</p>
                </div>
                {/*<div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Active Connections</h3>
                    <p className="text-2xl">{activeConnections}</p>
                </div>*/}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Current Active Connection</h3>
                    <p className="text-2xl">
                        {activeConnection ? activeConnection.connectionName : "None"}
                    </p>
                </div>
            </div>

            {/* Create Connection Dialog */}
            <div className="mb-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={loading}>Create New Connection</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Connection</DialogTitle>
                            <DialogDescription>Enter the details for the new database connection.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Input fields */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="connectionName" className="text-right">Connection Name</Label>
                                <Input
                                    id="connectionName"
                                    value={newConnection.connectionName || ""}
                                    onChange={(e) => setNewConnection({ ...newConnection, connectionName: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            {["ip", "port", "serviceName", "username", "role", "password"].map((field) => (
                                <div className="grid grid-cols-4 items-center gap-4" key={field}>
                                    <Label htmlFor={field} className="text-right capitalize">
                                        {field}
                                    </Label>
                                    <Input
                                        id={field}
                                        type={field === "port" ? "number" : field === "password" ? "password" : "text"}
                                        value={newConnection[field] || ""}
                                        onChange={(e) =>
                                            setNewConnection({ ...newConnection, [field]: e.target.value })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button disabled={loading} onClick={handleCreateConnection}>
                                Create Connection
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Connections Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Connection Name</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Port</TableHead>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {connections.map((connection) => (
                        <TableRow key={connection.connectionName}>
                            <TableCell>{connection.connectionName}</TableCell>
                            <TableCell>{connection.ip}</TableCell>
                            <TableCell>{connection.port}</TableCell>
                            <TableCell>{connection.serviceName}</TableCell>
                            <TableCell>{connection.username}</TableCell>
                            <TableCell>
                                <Badge>{connection.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        connection.status === "success"
                                            ? "success"
                                            : connection.status === "failed"
                                                ? "destructive"
                                                : "default"
                                    }
                                    className={connection.status === "success" ? "bg-green-500 text-white" : "bbg-red-500 text-white"}
                                >
                                    {connection.status || "Unknown"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => handleTestConnection(connection)}
                                >
                                    Test
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="mr-2"
                                    onClick={() => handleSetActiveConnection(connection)}
                                    disabled={activeConnection?.connectionName === connection.connectionName}
                                >
                                    {activeConnection?.connectionName === connection.connectionName
                                        ? "Active"
                                        : "Set Active"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteConnection(connection.id!, connection.connectionName)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
