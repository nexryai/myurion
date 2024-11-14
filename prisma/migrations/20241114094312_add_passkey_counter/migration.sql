-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Passkey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passkeyUserId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transports" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Passkey" ("createdAt", "id", "name", "passkeyUserId", "publicKey", "transports", "userId") SELECT "createdAt", "id", "name", "passkeyUserId", "publicKey", "transports", "userId" FROM "Passkey";
DROP TABLE "Passkey";
ALTER TABLE "new_Passkey" RENAME TO "Passkey";
CREATE UNIQUE INDEX "Passkey_passkeyUserId_key" ON "Passkey"("passkeyUserId");
CREATE UNIQUE INDEX "Passkey_name_userId_key" ON "Passkey"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
