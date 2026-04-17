export interface User
{
    id: string;
    name: string;
    lastName: string;
    role: "admin" | "devops" | "developer";
}