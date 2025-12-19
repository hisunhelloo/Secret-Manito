export interface Member {
    id: string;
    name: string;
    token: string;
    targetName?: string;
}

export interface Room {
    id: string;
    roomName: string;
    adminId: string;
    adminName: string;
    isAssigned: boolean;
    members: Member[];
    createdAt: number;
}
