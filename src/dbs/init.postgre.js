"use strict";
const { Pool } = require("pg");
const {
  db: { host, port, name, username, password },
} = require("../configs/config.js");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    this.pool = new Pool({
      user: username,
      host: host,
      database: name,
      password: password,
      port: port,
      max: 50,
    });

    this.pool.on("connect", () => {
      console.log("Connected to PostgreSQL database");
    });

    this.pool.on("error", (err) => {
      console.error("Error connecting to PostgreSQL database:", err);
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async query(text, params) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(text, params);
      client.release();
      return result;
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    }
  }
}


module.exports = Database.getInstance();
