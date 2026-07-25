// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { PrismaClient } from "@prisma/client";

/**
 * Normalizes connection strings from Laravel Forge / SSH formats into standard MySQL URIs for Prisma.
 * Example Forge input: "mysql+ssh://aieducation@YOUR_FORGE_IP/forge:1234567890@127.0.0.1/forge?name=holy-creek&usePrivateKey=true"
 * Output: "mysql://forge:1234567890@127.0.0.1:3306/forge"
 */
export function getNormalizedDatabaseUrl(rawUrl?: string): string {
  const url = rawUrl || process.env.DATABASE_URL || "";

  if (!url) {
    return "mysql://forge:forge@127.0.0.1:3306/forge";
  }

  // Handle Laravel Forge mysql+ssh format
  if (url.startsWith("mysql+ssh://")) {
    try {
      // Format: mysql+ssh://sshuser@sshhost/dbuser:dbpass@dbhost/dbname?params
      const match = url.match(/mysql\+ssh:\/\/[^/]+\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
      if (match) {
        const [, dbUser, dbPass, dbHost, dbName] = match;
        const hostWithPort = dbHost.includes(":") ? dbHost : `${dbHost}:3306`;
        return `mysql://${dbUser}:${dbPass}@${hostWithPort}/${dbName}`;
      }
    } catch {
      // Fallback
    }
  }

  return url;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getNormalizedDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
