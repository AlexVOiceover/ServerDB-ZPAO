const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const Database = require('better-sqlite3')

/**
 * If we do not set DB_FILE env var creates an in-memory temp DB.
 * Otherwise connect to the DB contained in the file we specified (if it exists).
 * If it does not exist create a new DB file and connect to it.
 */
// const db = new Database(process.env.DB_FILE)
const db = new Database('microbloggingDB')

/**
 * Make sure DB has the right structure by running schema.sql
 * This is responsible for creating the tables and columns we need
 * It should be safe to run every time
 */
const schemaPath = join('database', 'schema.sql')
const schema = readFileSync(schemaPath, 'utf-8')
db.exec(schema)

/**
 * Export the DB for use in other files
 */

module.exports = db
