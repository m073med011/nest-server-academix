import { Connection, ClientSession } from 'mongoose';
export declare class DatabaseService {
    private readonly connection;
    constructor(connection: Connection);
    withTransaction<T>(operation: (session: ClientSession) => Promise<T>): Promise<T>;
}
