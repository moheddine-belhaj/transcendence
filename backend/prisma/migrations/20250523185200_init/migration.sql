-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "2FA secret" TEXT
);

-- CreateTable
CREATE TABLE "Friend" (
    "user/user_ind" INTEGER NOT NULL,
    "friend/user_ind" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    PRIMARY KEY ("user/user_ind", "friend/user_ind"),
    CONSTRAINT "Friend_user/user_ind_fkey" FOREIGN KEY ("user/user_ind") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friend_friend/user_ind_fkey" FOREIGN KEY ("friend/user_ind") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OAuth 2.0" (
    "user_id" INTEGER NOT NULL,
    "service_type" TEXT NOT NULL,

    PRIMARY KEY ("user_id", "service_type"),
    CONSTRAINT "OAuth 2.0_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
