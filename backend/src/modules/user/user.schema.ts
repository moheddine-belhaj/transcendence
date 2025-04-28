import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';
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

export const {schemas:userSchema, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
});