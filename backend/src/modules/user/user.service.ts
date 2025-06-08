import { hashpassword, verifyPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

export async function createUser(input : CreateUserInput){
const { password, ...rest } = input;
const { hash, salt } = hashpassword(password);

const user = await prisma.user.create({
    data: {...rest, salt,password: hash},
 });
 return user;
}



export async function findUserByEmail(email: string) {

    return prisma.user.findUnique({
        where: {
             email,
        },
    });
}

export async function findUsers() {

    return prisma.user.findMany({
        select : {
            id: true,
            email: true,
            name: true,
        },
    });
        
}

// Add to user.service.ts
export async function addFriend(userId: number, friendId: number) {
  // Validate input
  if (userId === friendId) {
    throw new Error('Cannot add yourself as a friend');
  }

  // Check if users exist
  const [user, friend] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.user.findUnique({ where: { id: friendId } })
  ]);

  if (!user || !friend) {
    throw new Error('One or both users not found');
  }

  // Check for existing friendship in either direction
  const existingFriendship = await prisma.friend.findFirst({
    where: {
      OR: [
        { user_user_ind: userId, friend_user_ind: friendId },
        { user_user_ind: friendId, friend_user_ind: userId }
      ]
    }
  });

  if (existingFriendship) {
    // You could update the status here if you want
    throw new Error('Friendship already exists between these users');
  }

  // Create new friendship
  return prisma.friend.create({
    data: {
      user_user_ind: userId,
      friend_user_ind: friendId,
      status: 'pending'
    }
  });
}

export async function getFriends(userId: number) {
  return prisma.friend.findMany({
    where: {
      OR: [
        { 
          user_user_ind: userId, 
          status: 'accepted' 
        },
        { 
          friend_user_ind: userId, 
          status: 'accepted' 
        }
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

export async function updateFriendStatus(
  userId: number, 
  friendId: number, 
  action: 'accept' | 'refuse'
) {
  // Find the pending request
  const friendship = await prisma.friend.findFirst({
    where: {
      user_user_ind: friendId,
      friend_user_ind: userId,
      status: 'pending'
    }
  });

  if (!friendship) {
    throw new Error('No pending friend request found');
  }

  if (action === 'accept') {
    return prisma.friend.update({
      where: {
        user_user_ind_friend_user_ind: {
          user_user_ind: friendship.user_user_ind,
          friend_user_ind: friendship.friend_user_ind
        }
      },
      data: { status: 'accepted' },
      include: {
        user: true,
        friendUser: true
      }
    });
  } else {
    // For refuse action, delete the request
    await prisma.friend.delete({
      where: {
        user_user_ind_friend_user_ind: {
          user_user_ind: friendship.user_user_ind,
          friend_user_ind: friendship.friend_user_ind
        }
      }
    });
    return { message: 'Friend request refused' };
  }
}

// Add to user.service.ts
export async function deleteFriend(userId: number, friendId: number) {
  // Check if friendship exists in either direction
  const friendship = await prisma.friend.findFirst({
    where: {
      OR: [
        { user_user_ind: userId, friend_user_ind: friendId },
        { user_user_ind: friendId, friend_user_ind: userId }
      ],
      status: 'accepted'
    }
  });

  if (!friendship) {
    throw new Error('No friendship found between these users');
  }

  // Delete the friendship
  return prisma.friend.delete({
    where: {
      user_user_ind_friend_user_ind: {
        user_user_ind: friendship.user_user_ind,
        friend_user_ind: friendship.friend_user_ind
      }
    }
  });
}


export async function getUserFriendsList(userId: number) {
  const friendships = await prisma.friend.findMany({
    where: {
      OR: [
        { 
          user_user_ind: userId, 
          status: 'accepted' 
        },
        { 
          friend_user_ind: userId, 
          status: 'accepted' 
        }
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true
        }
      },
      friendUser: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true
        }
      }
    }
  });

  // Transform the friendships into a simple list of friends
  return friendships.map(friendship => {
    // Determine which user is the friend (not the current user)
    return friendship.user_user_ind === userId 
      ? friendship.friendUser 
      : friendship.user;
  });





}

  export async function updateUser(
  userId: number,
  input: UpdateUserInput
) {
  const { currentPassword, newPassword, ...rest } = input;
  const updateData: any = { ...rest };

  // If password is being changed
  if (newPassword) {
    if (!currentPassword) {
      throw new Error('Current password is required to change password');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const correctPassword = verifyPassword({
      condidatepassword: currentPassword,
      hash: user.password,
      salt: user.salt,
    });

    if (!correctPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const { hash, salt } = hashpassword(newPassword);
    updateData.password = hash;
    updateData.salt = salt;
  }

  // Check if email is being updated to one that already exists
  if (updateData.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: updateData.email,
        NOT: {
          id: userId
        }
      }
    });

    if (existingUser) {
      throw new Error('Email already in use by another account');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true
    }
  });

  return updatedUser;
}