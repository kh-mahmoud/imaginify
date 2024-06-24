'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "../prismaClient"
import { CreateUserParams, UpdateUserParams } from "@/types"

// CREATE users

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await prisma.user.create({ data: user })
        return newUser
    } catch (error) {
        console.log(error)
    }


}

//get user By id

export const getUserById = async (userId: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { clerkId: userId } })

        if (!user) throw new Error('user not found')

        return user
    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


//update user

export const updateUser = async (userId: string, updateUser: UpdateUserParams) => {
    try {
        const user = await prisma.user.findFirst({ where: { clerkId: userId } })

        if (!user) throw new Error('user not found')

        const updatedUser = await prisma.user.update(
            {
                where: { clerkId: userId },
                data: updateUser
            })

        if (!updatedUser) throw new Error('user not found')

        return updatedUser

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}

//delete user

export const deleteUser = async (userId: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { clerkId: userId } })

        if (!user) throw new Error('user not found')

        const deletededUser = await prisma.user.delete({ where: { clerkId: userId } })

        if (!deletededUser) throw new Error('user not found')

        revalidatePath("/")

        return deletededUser

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
    try {
        const updatedUserCredits = await prisma.user.update({
            where: { id: userId },
            data: {
                 creditBalance:{increment:creditFee}
            }})

             if(!updatedUserCredits) throw new Error("User credits update failed");
             
             return updatedUserCredits


    } catch (error: any) {
        throw new Error(error)
    }
}