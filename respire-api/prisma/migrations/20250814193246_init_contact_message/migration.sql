-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "offer" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
