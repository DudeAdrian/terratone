/**
 * Database Connection & ORM Setup
 * Supports PostgreSQL with Prisma ORM
 */

const { PrismaClient } = require('@prisma/client');

class DatabaseManager {
  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error']
    });
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  getInstance() {
    return this.prisma;
  }
}

module.exports = new DatabaseManager();
