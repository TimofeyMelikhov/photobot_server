-- CreateTable
CREATE TABLE "Photographer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tg_user_id" BIGINT NOT NULL,
    "tg_username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tg_channel" TEXT,
    "portfolio_url" TEXT,
    "other_resource" TEXT,
    "profile_photo" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Distributor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tg_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DistributorPhotographerLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "distributor_id" INTEGER NOT NULL,
    "photographer_id" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DistributorPhotographerLink_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "Distributor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DistributorPhotographerLink_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "Photographer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photographer_id" INTEGER NOT NULL,
    "tg_user_id" BIGINT NOT NULL,
    "tg_username" TEXT NOT NULL,
    "referrer_id" INTEGER,
    "isConfirmed" INTEGER,
    "communicationMethod" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Client_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "Photographer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Client_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "Distributor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photographer_id" INTEGER NOT NULL,
    "referrer_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Referral_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "Photographer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Referral_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "Distributor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Photographer_tg_user_id_key" ON "Photographer"("tg_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Distributor_tg_user_id_key" ON "Distributor"("tg_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DistributorPhotographerLink_distributor_id_photographer_id_key" ON "DistributorPhotographerLink"("distributor_id", "photographer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_tg_user_id_key" ON "Client"("tg_user_id");
