import { FastifyReply, FastifyRequest } from "fastify";
import { createUser } from "./user.service";
import { CreateUserInput } from "./user.schema";

export async function registerUserHandler(
    request:FastifyRequest <{
        Body: CreateUserInput;
    }>,
    reply:FastifyReply
) {
    const body = request.body ;
    try {

        // Call the service to create a new user
        const user = await createUser(body);

        // Send a success response
        return reply.code(201).send(user);
    }   catch (error) {
        // Handle errors and send an appropriate response
        console.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
    }

}