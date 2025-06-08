import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  uploadAvatarHandler,
  getAvatarHandler
} from './avatar.controller';

// Extend FastifyJWT to include the user property with the correct type
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { id: number };
  }
}

async function avatarRoutes(server: FastifyInstance) {
  server.post<{
    Params: { userId: string }
  }>('/:userId/avatar', {
    preHandler: [server.authenticate],
    // Add schema for proper OpenAPI documentation
    schema: {
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' }
          }
        }
      }
    }
  }, uploadAvatarHandler);

  server.get('/:userId/avatar', getAvatarHandler);
}

export default avatarRoutes;