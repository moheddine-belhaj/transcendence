import { FastifyInstance } from "fastify";
import { $ref, UpdateUserInput } from "./user.schema";
import { acceptFriendHandler, addFriendHandler, deleteFriendHandler, getFriendsHandler, getUserFriendsListHandler, getUserhandler, loginHandler, refuseFriendHandler, registerUserHandler, updateUserHandler, verifyEmailHandler } from "./user.controller";
import { z } from "zod";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
  {
    schema: {
    body: $ref("createUserSchema"),
    response:{
      201: $ref("createUserResponseSchema"),
    }
  },
},
  registerUserHandler);


  server.post("/login",{
    schema: {
      body: $ref("loginSchema"),
      response: {
        200: $ref("loginResponseSchema"),
      },
    },
  }, loginHandler);


  server.get("/",
  {
    preHandler: [server.authenticate],

  }, getUserhandler);

  server.get<{ Params: { userId: number } }>('/friends/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' }
        },
        required: ['userId']
      }
    },
    preHandler: [server.authenticate]
  }, getFriendsHandler);

   server.post<{
    Body: { userId: number; friendId: number; status?: "pending" | "accepted" | "rejected" }
  }>('/friends', {
    schema: {
      body: $ref('friendSchema'),
      response: {
        201: $ref('friendResponseSchema')
      }
    },
    preHandler: [server.authenticate]
  }, addFriendHandler);

  server.patch<{
    Body: { userId: number; friendId: number }
  }>('/friends/accept', {
    schema: {
      body: $ref('acceptFriendSchema'),
      response: {
        200: $ref('friendResponseSchema')
      }
    },
    preHandler: [server.authenticate]
  }, acceptFriendHandler);


server.patch<{
  Body: { userId: number; friendId: number }
}>("/friends/refuse", {
  schema: {
    body: $ref('refuseFriendSchema'),
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  },
  preHandler: [server.authenticate]
}, refuseFriendHandler);


// Add to user.routes.ts
server.delete<{
  Body: { userId: number; friendId: number }
}>("/friends", {
  schema: {
    body: $ref("deleteFriendSchema"),
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  },
  preHandler: [server.authenticate]
}, deleteFriendHandler);

server.get<{ Params: { userId: number } }>('/friends/list/:userId', {
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' }
      },
      required: ['userId']
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            name: { type: 'string' },
            avatar: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  preHandler: [server.authenticate]
}, getUserFriendsListHandler);

server.put<{
  Params: { userId: number };
  Body: UpdateUserInput;
}>('/update/:userId', {
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' }
      },
      required: ['userId']
    },
    body: $ref('updateUserSchema'),
    response: {
      200: $ref('updateUserResponseSchema')
    }
  },
  preHandler: [server.authenticate]
}, updateUserHandler);

server.get('/verify-email', {
  schema: {
    querystring: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
}, verifyEmailHandler);
}


export default userRoutes;


