import prisma from "../../utils/prisma";
import fs from 'fs';
import path from 'path';

const AVATAR_UPLOAD_DIR = './uploads/avatars';

// Ensure upload directory exists
if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
  fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

export async function updateUserAvatar(userId: number, file: any) {
  // Generate unique filename
  const ext = path.extname(file.filename);
  const newFilename = `avatar-${userId}-${Date.now()}${ext}`;
  const filePath = path.join(AVATAR_UPLOAD_DIR, newFilename);

  // Save file
  await fs.promises.writeFile(filePath, file.data);

  // Update user record
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: newFilename },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true
    }
  });

  return updatedUser;
}

export async function getUserAvatar(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true }
  });

  if (!user || !user.avatar) {
    return null;
  }

  const filePath = path.join(AVATAR_UPLOAD_DIR, user.avatar);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return {
    filename: user.avatar,
    path: filePath
  };
}