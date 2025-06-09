import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';
import { TLSSocket } from 'tls';
import { access } from 'fs';
const userCore =({
    email: z
    .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    })
    .email(),
    name: z.string(),
    verificationToken: z.string().optional(),

});

const createUserSchema =  z.object({
    ...userCore,

    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    }),
    
});

const createUserResponseSchema = z.object({
    id: z.number({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a number',
    }),
    ...userCore,
    isVerified: z.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddFriendInput = z.infer<typeof friendSchema>;
export type RefuseFriendInput = z.infer<typeof refuseFriendSchema>;
export type AcceptFriendInput = z.infer<typeof acceptFriendSchema>;
export type DeleteFriendInput = z.infer<typeof deleteFriendSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;

export const verifyEmailSchema = z.object({
  token: z.string()
});

export const verifyEmailResponseSchema = z.object({
  message: z.string()
});

export const verifyEmailErrorSchema = z.object({
  error: z.string()
});
// match schemas
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
export type MatchResponse = z.infer<typeof matchResponseSchema>;


const loginResponseSchema = z.object({
    access_token: z.string({
        required_error: 'Access token is required',
        invalid_type_error: 'Access token must be a string',
    }),
    user: z.object({
        id: z.number({
            required_error: 'ID is required',
            invalid_type_error: 'ID must be a number',
        }),
        email: z.string(),
        name: z.string(),
        avatar: z.string().optional(),
    }),
});

    const loginSchema = z.object({ 
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    })
    .email(),
    password: z.string(),
});


const friendSchema = z.object({
  userId: z.number(),
  friendId: z.number(),
  status: z.enum(['pending', 'accepted', 'rejected']).optional()
});

const friendResponseSchema = z.object({
  user_user_ind: z.number(),
  friend_user_ind: z.number(),
  status: z.string()
});


const refuseFriendSchema = z.object({
  userId: z.number(),
  friendId: z.number()
});


const acceptFriendSchema = z.object({
  userId: z.number(),
  friendId: z.number()
});

const deleteFriendSchema = z.object({
  userId: z.number(),
  friendId: z.number()
});


const matchCore = {
  player1Id: z.number(),
  player2Id: z.number()
};

const createMatchSchema = z.object({
  ...matchCore
});

const updateMatchSchema = z.object({
  scorePlayer1: z.number(),
  scorePlayer2: z.number(),
  winnerId: z.number().optional()
});

const matchResponseSchema = z.object({
  id: z.number(),
  ...matchCore,
  status: z.string(),
  matchDate: z.date()
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional()
});

const updateUserResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string()
});

// Update the buildJsonSchemas call to include the new schema
export const {schemas:userSchema, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginResponseSchema,
    loginSchema,
    deleteFriendSchema,
    refuseFriendSchema,
    friendSchema,
    friendResponseSchema,
    updateUserSchema,
    updateUserResponseSchema,
    acceptFriendSchema,
    verifyEmailSchema,
    verifyEmailResponseSchema,
    verifyEmailErrorSchema
});

export const { schemas: matchSchemas, $ref: matchRef } = buildJsonSchemas({
  createMatchSchema,
  updateMatchSchema,
  matchResponseSchema
}, { $id: "MatchSchema" });