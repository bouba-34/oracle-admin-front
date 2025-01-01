"use client";
import { useState, useEffect } from "react";
import { Role } from "@/types";
import {
    getAllRoles,
    deleteRole,
    grantSystemPrivilege,
    grantObjectPrivilege,
    revokeSystemPrivilege,
    revokeObjectPrivilege,
    saveRole
} from "@/app/actions/roles";
import { useConnectionStore } from "@/store/useConnectionStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, PlusIcon, MinusIcon } from "@radix-ui/react-icons";

const RoleManagementPage = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isAddRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [privilegeType, setPrivilegeType] = useState("system");
    const [privilegeName, setPrivilegeName] = useState("");
    const [tableName, setTableName] = useState("");
    const [tableToRevokePrivilege, setTableToRevokePrivilege] = useState("");
    const { toast } = useToast();
    const { activeConnection } = useConnectionStore();

    useEffect(() => {
        document.title = "Role Management";
        const fetchRoles = async () => {
            if (!activeConnection) return;
            try {
                const data = await getAllRoles(activeConnection);
                setRoles(data);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Erreur lors de la récupération des rôles.",
                });
            }
        };
        if(activeConnection?.id !== undefined) {
            fetchRoles();
        }
    }, [activeConnection]);


    const handleAddRole = async () => {
        if (!newRoleName.trim() || !activeConnection) return;
        try {
            await saveRole(newRoleName, activeConnection);
            setAddRoleDialogOpen(false);
            setNewRoleName("");
            toast({
                title: "Role created",
                description: "New role has been created successfully",
            });
            const updatedRoles = await getAllRoles(activeConnection);
            setRoles(updatedRoles);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Erreur lors de l'ajout du rôle.",
            });
        }
    };

    const handleDeleteRole = async (roleName: string) => {
        if (!activeConnection) return;
        try {
            await deleteRole(roleName, activeConnection);
            toast({
                title: "Role deleted",
                description: "Role has been deleted successfully",
            });
            const updatedRoles = await getAllRoles(activeConnection);
            setRoles(updatedRoles);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Erreur lors de la suppression du rôle.",
            });
        }
    };

    const handleGrantPrivilege = async () => {
        if (!selectedRole || !privilegeName.trim() || !activeConnection) return;
        try {
            if (privilegeType === "system") {
                await grantSystemPrivilege(selectedRole.name, privilegeName, activeConnection);
            } else {
                await grantObjectPrivilege(selectedRole.name, privilegeName, tableName, activeConnection);
            }
            toast({
                title: "Privilege granted",
                description: "Privilege has been granted successfully",
            });
            const updatedRoles = await getAllRoles(activeConnection);
            setRoles(updatedRoles);
            setSelectedRole(null);
            setPrivilegeName("");
            setTableName("");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Erreur lors de l'attribution du privilège.",
            });
        }
    };

    const handleRevokePrivilege = async (roleName: string, privilegeType: string, privilegeName: string) => {
        if (!activeConnection) return;
        try {
            if (privilegeType === "system") {
                await revokeSystemPrivilege(roleName, privilegeName, activeConnection);
            } else {
                await revokeObjectPrivilege(roleName, privilegeName, tableToRevokePrivilege, activeConnection);
            }
            toast({
                title: "Privilege revoked",
                description: "Privilege has been revoked successfully",
            });
            const updatedRoles = await getAllRoles(activeConnection);
            setRoles(updatedRoles);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Erreur lors de la révocation du privilège.",
            });
        }
    };

    if(activeConnection?.id === undefined) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Role Management</h1>
                <p className="text-red-500">Please select a connection to manage roles.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Role Management</h1>

            {/* Add Role Dialog */}
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4">New role</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new role</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Nom du rôle"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="mb-4"
                    />
                    <DialogFooter>
                        <Button onClick={handleAddRole}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Roles Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>System Privileges</TableHead>
                        <TableHead>Object Privileges</TableHead>
                        <TableHead>Tables</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.name}>
                            <TableCell>{role.name}</TableCell>
                            <TableCell>
                                {role.system_privilege?.map((priv) => (
                                    <div key={priv} className="flex items-center">
                                        {priv}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleRevokePrivilege(role.name, "system", priv)}
                                        >
                                            <MinusIcon />
                                        </Button>
                                    </div>
                                )) || "N/A"}
                            </TableCell>
                            <TableCell>
                                {role.object_privilege?.map((priv) => (
                                    <div key={priv} className="flex items-center">
                                        {priv}
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MinusIcon />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Please provide the object (table) name</DialogTitle>
                                                </DialogHeader>
                                                <Input
                                                    placeholder="Table to revoke privilege from"
                                                    value={tableToRevokePrivilege}
                                                    onChange={(e) => setTableToRevokePrivilege(e.target.value)}
                                                    className="mb-4"
                                                    />
                                                <DialogFooter>
                                                    <Button onClick={() => handleRevokePrivilege(role.name, "object", priv)}>Revoke Privilege</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )) || "N/A"}
                            </TableCell>
                            <TableCell>{role.table_names?.join(", ") || "N/A"}</TableCell>
                            <TableCell>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDeleteRole(role.name)}
                                    className="mr-2"
                                >
                                    <TrashIcon />
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon"
                                                onClick={() => setSelectedRole(role)}
                                        >
                                            <PlusIcon />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add new privilege to {role.name}</DialogTitle>
                                        </DialogHeader>
                                        <Select onValueChange={(value) => setPrivilegeType(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Type de privilège" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="system">System</SelectItem>
                                                <SelectItem value="object">Object</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Nom du privilège"
                                            value={privilegeName}
                                            onChange={(e) => setPrivilegeName(e.target.value)}
                                            className="mb-4"
                                        />
                                        {privilegeType === "object" && (
                                            <Input
                                                placeholder="Nom de la table"
                                                value={tableName}
                                                onChange={(e) => setTableName(e.target.value)}
                                                className="mb-4"
                                            />
                                        )}
                                        <DialogFooter>
                                            <Button onClick={handleGrantPrivilege}>Add Privilege</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RoleManagementPage;
