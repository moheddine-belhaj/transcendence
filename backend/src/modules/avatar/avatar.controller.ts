import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { updateUserAvatar, getUserAvatar } from './avatar.service';
import path from 'path';
import fs from 'fs';


export async function uploadAvatarHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const authenticatedUser = request.user;
    if (!authenticatedUser) {
      return reply.code(401).send({ error: 'Not authenticated' });
    }

    const userId = parseInt(request.params.userId);
    if (authenticatedUser.id !== userId) {
      return reply.code(403).send({ error: 'You can only update your own avatar' });
    }

    const file = await request.file();
    if (!file) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    // Read the file into a buffer
    const buffer = await file.toBuffer();
    const updatedUser = await updateUserAvatar(userId, {
      filename: file.filename,
      mimetype: file.mimetype,
      data: buffer
    });

    return reply.code(200).send(updatedUser);
  } catch (error) {
    console.error('Avatar upload error:', error);
    return reply.code(500).send({ error: 'Failed to process avatar upload' });
  }
}
export async function getAvatarHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = parseInt(request.params.userId);
    const avatar = await getUserAvatar(userId);

    if (!avatar) {
      return reply.code(404).send({ error: 'Avatar not found' });
    }

    reply.type('image/' + path.extname(avatar.filename).substr(1));
    return reply.send(fs.createReadStream(avatar.path));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return reply.code(500).send({ error: errorMessage });
  }
}