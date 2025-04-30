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
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;




const loginResponseSchema = z.object({
    access_token: z.string({
        required_error: 'Access token is required',
        invalid_type_error: 'Access token must be a string',
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

export const {schemas:userSchema, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,

    loginResponseSchema,
    loginSchema,
});

