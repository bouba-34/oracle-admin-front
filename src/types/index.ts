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

export type TableSpaceInfo = {
    next_extent: string,
    segment_space_management: string,
    initial_extent: string,
    status: string,
    contents: string,
    name: string,
    extent_management: string,
    block_size: string,
    allocation_type: string,
}

export type TableSpace = {
    name: string;
    dataFilePath: string;
    size: string;
    maxSize: string;
    autoExtend: boolean;
    incrementSize?: string;
}

export type TableSpaceDetail = {
    autoextensible: string;
    size_mb: string;
    file_name: string;
    max_size_mb: string;
}

export type UserData = {
    username: string
    roles: string[]
    quotas: [
        {
            bytes_mb: string
            max_bytes_mb: string
            tablespace_name: string
        }
    ]
    default_tablespace: string
    temporary_tablespace: string
}

export type User = {
    newUsername: string
    newPassword: string
    newRole: string
    defaultTablespace: string
    temporaryTablespace: string
    quota: string
}
