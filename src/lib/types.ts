  export interface User {
    username: string;
    defaultTablespace: string;
    temporaryTablespace: string;
    status: 'LOCKED' | 'UNLOCKED';
    roles: string[];
    created_at?: string;
    last_login?: string;
  }
  
  
  export interface Role {
    name: string;
    privileges: string[];
  }
  
  export interface Privilege {
    name: string;
    type: 'SYSTEM' | 'OBJECT';
    description?: string;
  }
  
  export interface UserDTO {
    username: string;
    password: string;
    roles?: string[];
  }
  
  export interface RoleDTO {
    name: string;
    privileges?: string[];
  }
  
  export interface PrivilegeDTO {
    name: string;
    type: 'SYSTEM' | 'OBJECT';
    description?: string;
  }