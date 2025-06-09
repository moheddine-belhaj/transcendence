import { FastifyReply, FastifyRequest } from "fastify";
import { addFriend, createUser, deleteFriend, findUserByEmail, findUsers, getUserFriendsList, updateFriendStatus, updateUser, verifyUserEmail } from "./user.service";
import { CreateUserInput, LoginInput ,AddFriendInput, UpdateUserInput} from "./user.schema";
import { access } from "fs";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";

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

export async function verifyEmailHandler(
  request: FastifyRequest<{ Querystring: { token: string } }>,
  reply: FastifyReply
) {
  try {
    const { token } = request.query;
    
    if (!token) {
      return reply.code(400).send({ error: 'Verification token is required' });
    }

    await verifyUserEmail(token);
    return reply.code(200).send({ message: 'Email verified successfully' });
  } catch (error) {
    request.log.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    return reply.code(400).send({ error: errorMessage });
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

  // Check if user is verified
  if (!user.isVerified) {
    return reply.code(403).send({ error: "Please verify your email address first" });
  }

// verify the password
const correctPassword = verifyPassword({
    condidatepassword: body.password,
    hash: user.password,
    salt: user.salt,
});
if (correctPassword) {
    const { password, salt, ...userWithoutPassword } = user;
    const token = server.jwt.sign(userWithoutPassword);
  
    return reply
      .code(200)
      .send({ access_token: token, user: {
        id: user.id,
        email: user.email,
        name: user.name
      }});
  } 

return reply.code(401).send({ error: "Invalid email or password" });


}

export async function getUserhandler(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const users = await findUsers();
      return reply.code(200).send(users);
    } catch (error) {
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  }


export async function getFriends(userId: number) {
  return prisma.friend.findMany({
    where: {
      OR: [
        { user_user_ind: userId, status: 'accepted' },
        { friend_user_ind: userId, status: 'accepted' }
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      },
      friendUser: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  });
}

export async function addFriendHandler(
  request: FastifyRequest<{ Body: AddFriendInput }>,
  reply: FastifyReply
) {
  try {
    const { userId, friendId } = request.body as AddFriendInput;
    const friendship = await addFriend(userId, friendId);
    return reply.code(201).send(friendship);
  } catch (error) {
    console.error(error);
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
      statusCode = error.message.includes('not found') ? 404 :
                   error.message.includes('already exists') ? 409 :
                   error.message.includes('yourself') ? 400 : 500;
    }
    return reply.code(statusCode).send({ error: errorMessage });
  }
}

export async function getFriendsHandler(
  request: FastifyRequest<{ Params: { userId: number } }>,
  reply: FastifyReply
) {
  try {
    const friends = await getFriends(request.params.userId);
    return reply.code(200).send(friends);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}

// export async function acceptFriendHandler(
//   request: FastifyRequest<{ Body: { userId: number; friendId: number } }>,
//   reply: FastifyReply
// ) {
//   try {
//     const { userId, friendId } = request.body as { userId: number; friendId: number };
//     const updatedFriendship = await updateFriendStatus(userId, friendId, 'accepted');
//     return reply.code(200).send(updatedFriendship);
//   } catch (error) {
//     console.error(error);
//     let statusCode = 400;
//     let errorMessage = "An error occurred";
//     if (error instanceof Error) {
//       statusCode = error.message.includes('No pending') ? 404 : 400;
//       errorMessage = error.message;
//     }
//     return reply.code(statusCode).send({ error: errorMessage });
//   }
// }

export async function acceptFriendHandler(
  request: FastifyRequest<{ Body: { userId: number, friendId: number } }>,
  reply: FastifyReply
) {
  try {
    const { userId, friendId } = request.body;
    const result = await updateFriendStatus(userId, friendId, 'accept');
    return reply.code(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return reply.code(400).send({ error: errorMessage });
  }
}




export async function refuseFriendHandler(
  request: FastifyRequest<{ Body: { userId: number, friendId: number } }>,
  reply: FastifyReply
) {
  try {
    const { userId, friendId } = request.body;
    const result = await updateFriendStatus(userId, friendId, 'refuse');
    return reply.code(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return reply.code(400).send({ error: errorMessage });
  }
}

export async function deleteFriendHandler(
  request: FastifyRequest<{ Body: { userId: number, friendId: number } }>,
  reply: FastifyReply
) {
  try {
    const { userId, friendId } = request.body;
    await deleteFriend(userId, friendId);
    return reply.code(200).send({ message: 'Friend successfully removed' });
  } catch (error) {
    console.error(error);
    let statusCode = 400;
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      statusCode = error.message.includes('No friendship') ? 404 : 400;
      errorMessage = error.message;
    }
    return reply.code(statusCode).send({ error: errorMessage });
  }
}

export async function getUserFriendsListHandler(
  request: FastifyRequest<{ Params: { userId: number } }>,
  reply: FastifyReply
) {
  try {
    const friends = await getUserFriendsList(request.params.userId);
    return reply.code(200).send(friends);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Params: { userId: number };
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) {
  try {
    // Verify the requesting user can only update their own profile
    if (request.user.id !== request.params.userId) {
      return reply.code(403).send({ error: 'You can only update your own profile' });
    }

    const updatedUser = await updateUser(request.params.userId, request.body);
    return reply.code(200).send(updatedUser);
  } catch (error) {
    console.error(error);
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    
    if (error instanceof Error) {
      if (error.message.includes('Current password') || 
          error.message.includes('Email already')) {
        statusCode = 400;
      } else if (error.message.includes('User not found')) {
        statusCode = 404;
      }
      errorMessage = error.message;
    }
    
    return reply.code(statusCode).send({ error: errorMessage });
  }
}