import { config } from 'dotenv'
config()

import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

// Create SQLite database connection
let db: Database<sqlite3.Database, sqlite3.Statement>;

export const initDB = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database,
    });

    // Create tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
            email TEXT,
            status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Projects (
            project_id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_name TEXT NOT NULL,
            state TEXT DEFAULT 'ACTIVE',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Collaborators (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER REFERENCES Projects(project_id),
            user_id INTEGER REFERENCES Users(user_id),
            is_owner BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS AuditLogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES Users(user_id),
            action TEXT NOT NULL,
            details TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_users_role ON Users(role);
        CREATE INDEX IF NOT EXISTS idx_users_status ON Users(status);
        CREATE INDEX IF NOT EXISTS idx_projects_state ON Projects(state);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON AuditLogs(user_id);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON AuditLogs(timestamp);
    `);

    // Insert default admin user if not exists
    const adminExists = await db.get('SELECT * FROM Users WHERE username = ?', ['admin']);
    if (!adminExists) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.run('INSERT INTO Users (username, password, role, email) VALUES (?, ?, ?, ?)',
            ['admin', hashedPassword, 'ADMIN', 'admin@example.com']);
        console.log('Default admin user created: username=admin, password=admin123');
    }

    return db;
};

// Mock Supabase-like interface
class MockSupabaseClient {
    from(table: string) {
        return new MockTable(db, table);
    }
}

class MockTable {
    constructor(private db: Database<sqlite3.Database, sqlite3.Statement>, private table: string) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(...args: any[]) {
        const columns = args[0];
        const options = args[1];
        if (options) {
            return new MockQuery(this.db, this.table, 'SELECT', { columns, ...options });
        }
        return new MockQuery(this.db, this.table, 'SELECT', columns);
    }

    insert(data: any) {
        return new MockQuery(this.db, this.table, 'INSERT', data);
    }

    update(data: any) {
        return new MockQuery(this.db, this.table, 'UPDATE', data);
    }

    delete() {
        return new MockQuery(this.db, this.table, 'DELETE');
    }
}

class MockQuery {
    private conditions: string[] = [];
    private params: any[] = [];
    private selectColumns = '*';
    private insertData: any = null;
    private updateData: any = null;
    private countOption: any = null;
    private rangeStart: number | null = null;
    private rangeEnd: number | null = null;
    private orderBy: { column: string, ascending: boolean } | null = null;

    constructor(private db: Database<sqlite3.Database, sqlite3.Statement>, private table: string, private operation: string, data?: any) {
        if (operation === 'SELECT' && data) {
            if (typeof data === 'string') {
                this.selectColumns = data;
            } else if (data && typeof data === 'object') {
                this.selectColumns = data.columns || '*';
                this.countOption = data.count || null;
            }
        } else if (operation === 'INSERT') {
            this.insertData = data;
        } else if (operation === 'UPDATE') {
            this.updateData = data;
        }
    }

    eq(column: string, value: any) {
        this.conditions.push(`${column} = ?`);
        this.params.push(value);
        return this;
    }

    neq(column: string, value: any) {
        this.conditions.push(`${column} != ?`);
        this.params.push(value);
        return this;
    }

    gte(column: string, value: any) {
        this.conditions.push(`${column} >= ?`);
        this.params.push(value);
        return this;
    }

    ilike(column: string, value: any) {
        this.conditions.push(`${column} LIKE ?`);
        this.params.push(value);
        return this;
    }

    order(column: string, options: { ascending: boolean } = { ascending: true }) {
        this.orderBy = { column, ascending: options.ascending };
        return this;
    }

    range(start: number, end: number) {
        this.rangeStart = start;
        this.rangeEnd = end;
        return this;
    }

    limit(count: number) {
        this.rangeEnd = this.rangeStart !== null ? this.rangeStart + count - 1 : count - 1;
        if (this.rangeStart === null) {
            this.rangeStart = 0;
        }
        return this;
    }

    single() {
        this.conditions.push('LIMIT 1');
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(...args: any[]): MockQuery {
        const columns = args[0];
        const options = args[1];
        
        if (columns) {
            if (typeof columns === 'string') {
                this.selectColumns = columns;
                if (options && options.count) {
                    this.countOption = options.count;
                }
            } else if (typeof columns === 'object') {
                this.selectColumns = columns.columns || '*';
                this.countOption = columns.count || null;
            }
        }
        return this;
    }

    async then(callback: (result: any) => void, errorCallback?: (error: any) => void) {
        try {
            let query = '';
            let result: any = {};

            if (this.operation === 'SELECT') {
                query = `SELECT ${this.selectColumns} FROM ${this.table}`;
                if (this.conditions.length > 0) {
                    query += ' WHERE ' + this.conditions.join(' AND ');
                }
                if (this.orderBy) {
                    query += ` ORDER BY ${this.orderBy.column} ${this.orderBy.ascending ? 'ASC' : 'DESC'}`;
                }
                if (this.rangeStart !== null && this.rangeEnd !== null) {
                    query += ` LIMIT ${this.rangeEnd - this.rangeStart + 1} OFFSET ${this.rangeStart}`;
                }
                
                let rows: any[];
                if (this.countOption) {
                    rows = await this.db.all(query, this.params);
                    const countQuery = `SELECT COUNT(*) as count FROM ${this.table}` + (this.conditions.length > 0 ? ' WHERE ' + this.conditions.join(' AND ') : '');
                    const countResult = await this.db.get(countQuery, this.params);
                    result = { data: rows, count: countResult?.count || 0, error: null };
                } else {
                    rows = await this.db.all(query, this.params);
                    result = { data: rows, error: null };
                }
            } else if (this.operation === 'INSERT') {
                const columns = Object.keys(this.insertData).join(', ');
                const placeholders = Object.keys(this.insertData).map(() => '?').join(', ');
                const values = Object.values(this.insertData);
                query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
                const stmt = await this.db.run(query, values);
                result = { data: [{ ...this.insertData, [this.table.slice(0, -1) + '_id']: stmt.lastID }], error: null };
            } else if (this.operation === 'UPDATE') {
                const setClause = Object.keys(this.updateData).map(key => `${key} = ?`).join(', ');
                const values = Object.values(this.updateData);
                query = `UPDATE ${this.table} SET ${setClause}`;
                if (this.conditions.length > 0) {
                    query += ' WHERE ' + this.conditions.join(' AND ');
                }
                await this.db.run(query, [...values, ...this.params]);
                result = { data: null, error: null };
            } else if (this.operation === 'DELETE') {
                query = `DELETE FROM ${this.table}`;
                if (this.conditions.length > 0) {
                    query += ' WHERE ' + this.conditions.join(' AND ');
                }
                await this.db.run(query, this.params);
                result = { data: [], error: null };
            }

            callback(result);
        } catch (error) {
            if (errorCallback) {
                errorCallback(error);
            } else {
                callback({ data: null, error });
            }
        }
    }
}

const mockClient = new MockSupabaseClient();
export default mockClient;
