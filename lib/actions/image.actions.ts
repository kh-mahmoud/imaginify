'use server'


import { AddImageParams, UpdateImageParams } from "@/types"
import { prisma } from "../prismaClient"
import { revalidatePath } from "next/cache"
import { v2 as cloudinary } from 'cloudinary'




export const addImage = async ({ image, userId, path }: AddImageParams) => {
    try {

        const author = await prisma.user.findFirst({ where: { id: userId } })

        if (!author) throw new Error('user not found')

        const newImage = await prisma.image.create({
            data: {
                ...image,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        })


        revalidatePath(path)

        return newImage

    } catch (error: any) {

        throw new Error(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


export const updateImage = async ({ image, userId, path, }: UpdateImageParams) => {
    try {


        const ImageToupdated = await prisma.image.findFirst({ where: { id: image?.id }, include: { author: { select: { id: true } } } })


        if (!ImageToupdated || ImageToupdated?.author?.id !== userId) {
            throw new Error("Unauthorized or image not found");
        }

        const { id, ...newImage } = image

        const updatedImage = await prisma.image.update({
            where: { id: image.id },
            data: newImage
        })




        revalidatePath(path)

        return updatedImage
    } catch (error: any) {

        throw new Error(error)
    }
    finally {
        await prisma.$disconnect();

    }
}




export const deleteImage = async (imageId: string, pubId: string) => {
    try {

        const deletedImage = await prisma.image.delete({ where: { id: imageId } })

        if (deletedImage) {
            await cloudinary.uploader.destroy(pubId, { resource_type: 'image' });
        }

        revalidatePath('/')

        return deletedImage

    } catch (error: any) {

        throw new Error(error)
    }
    finally {
        await prisma.$disconnect();

    }
}



export const getImageById = async (imageId: string) => {
    try {
        const image = await prisma.image.findFirst({ where: { id: imageId }, include: { author: { select: { id: true, clerkId: true } } } })

        if (!image) throw new Error("image not douns ")

        return image

    } catch (error: any) {
        throw new Error(error)
    }
    finally {
        await prisma.$disconnect();
    }
}



// GET IMAGES
export async function getAllImages({ limit = 6, page = 1, searchQuery = '' }: {
    limit?: number;
    page: number;
    searchQuery?: string;
}) {
    try {

        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        })

        let expression = 'folder=imaginify';

        if (searchQuery) {
            expression += ` AND ${searchQuery}`
        }

        const { resources } = await cloudinary.search
            .expression(expression)
            .execute();

        const resourceIds = resources.map((resource: any) => resource.public_id);

        const skipAmount = (Number(page) - 1) * limit;

        const images = await prisma.image.findMany({
            where: { publicId: { in: resourceIds } },
            take: limit,
            skip: skipAmount,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                author: { select: { id: true, clerkId: true } }
            }
        })




        const totalImages = await prisma.image.count({ where: { publicId: { in: resourceIds } } });
        const savedImages = await prisma.image.count({});


        return {
            data: images,
            totalPage: Math.ceil(totalImages / limit),
            savedImages,
        }



    } catch (error: any) {
        throw new Error(error)
    }
}


export async function getUserImages({ limit = 9, page = 1, userId }: {
    limit?: number;
    page: number;
    userId: string;
}) {
    try {

        const skipAmount = (Number(page) - 1) * limit;


        const images = await prisma.image.findMany({ where: { userId }, take: limit, skip: skipAmount, orderBy: { updatedAt: 'desc' } })

        const totalImages = await prisma.image.count({where:{userId}})

        return {
            data: JSON.parse(JSON.stringify(images)),
            totalPages: Math.ceil(totalImages / limit),
        };
    } catch (error) {
        console.log(error);
    }
}






