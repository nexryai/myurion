-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passkeyUserId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Passkey_passkeyUserId_key" ON "Passkey"("passkeyUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Passkey_name_userId_key" ON "Passkey"("name", "userId");
