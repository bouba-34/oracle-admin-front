export type Connection = {
    id?: string;
    connectionName: string;
    clientId: string;
    ip: string;
    port: string;
    serviceName: string;
    username: string;
    password: string;
    status?: string;
    role?: string;
    createdAt?: string;
};

export interface Role {
    name: string;  // Le nom du rôle, par exemple "ROLES" ou "MY_ROLE"
    system_privilege?: string[];  // Liste des privilèges système du rôle
    object_privilege?: string[];  // Liste des privilèges objets du rôle
    table_names?: string[];
}
