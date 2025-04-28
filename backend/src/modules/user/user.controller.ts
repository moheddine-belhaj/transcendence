import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { access } from "fs";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";

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


export async function loginHandler(
    request: FastifyRequest<{Body:LoginInput}>,
    reply: FastifyReply
) {

    const body = request.body;

    const user = await findUserByEmail(body.email);

    if (!user) {
        return reply.code(401).send({ error: "Invalid email or password" });
    }
// verify the password
    const correctPassword = verifyPassword({
        condidatepassword: body.password,
        hash: user.password,
        salt: user.salt,
    });
    if (correctPassword) {
        const {password, salt, ...rest} = user;
        return {access_token: server.jwt.sign(rest)};
    }   

    return reply.code(401).send({ error: "Invalid email or password" });

}