import postgres from "postgres";

const sql = postgres("postgres://postgres:root@localhost:5434/postgres");

async function main() {
  try {
    await sql`CREATE DATABASE explorer`;
    console.log("Database explorer created successfully");
  } catch (e: any) {
    if (e.code === "42P04") {
      console.log("Database explorer already exists");
    } else {
      console.error("Failed to create database", e);
      process.exit(1);
    }
  }
  process.exit(0);
}

main();
