import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    // publicProcedure,
} from "~/server/api/trpc";
import { useSession } from "next-auth/react";

const ELEMENTS_UNLOCKED_FROM_THE_BEGGINING = ['Fire', 'Earth', 'Water', 'Air'] as const

type Element = {
    id: string;
    name: string;
    img: string;
}

type ImageDOM = {
    alt: string;
    bottom: number,
    height: number,
    left: number,
    right: number,
    top: number,
    width: number,
    x: number,
    y: number,
}

const Image = z.object({
    src: z.string(),
    alt: z.string(),
    position: z.object({
        x: z.number(),
        y: z.number()
    })
})

const ImageElementSchema = z.object({
    alt: z.string(),
    bottom: z.number(),
    height: z.number(),
    left: z.number(),
    right: z.number(),
    top: z.number(),
    width: z.number(),
    x: z.number(),
    y: z.number(),
})
// .merge(z.object({})).passthrough();

type Combination = {
    [key: string]: string[]
}

const allCombinations: Combination = {
    "Dust": ["Earth + Air", "Air + Earth"]
    , "Energy": ["Air + Fire", "Fire + Air"]
    , "Lava": ["Earth + Fire", "Fire + Earth"]
    , "Mud": ["Earth + Water", "Water + Earth"]
    , "Pressure": ["Earth + Earth", "Air + Air"]
    , "Rain": ["Water + Air", "Air + Water"]
    , "Sea": ["Water + Water"]
    , "Steam": ["Water + Fire", "Fire + Water", "Energy + Water", "Water + Energy"]
    , "Atmosphere": ["Air + Pressure", "Pressure + Air", "Sky + Pressure", "Pressure + Sky"]
    , "Brick": ["Clay + Fire", "Fire + Clay", "Mud + Fire", "Fire + Mud", "Clay + Sun", "Sun + Clay", "Mud + Sun", "Sun + Mud"]
}

export const userRouter = createTRPCRouter({
    getAllElementsByUser: protectedProcedure
        .mutation(async ({ ctx }) => {
            const { data: sessionData } = useSession();

            const userId = sessionData?.user.id

            console.log(userId)
        }),

    unlockElement: protectedProcedure
        .input(z.object({
            imageElements: z.array(ImageElementSchema) || z.array(z.undefined()),
            images: z.array(Image),
            idUserLogged: z.string()
        }))
        .mutation(async ({ ctx, input: { imageElements, images, idUserLogged } }) => {
            // instead of unlocked them by element do it by user, remove the unlocked property and change the user schema to have a elements array with all the elements unlocked
            // LOOK FOR A WAY TO MAKE THIS FUNCTION FASTER

            // this way is for each user
            if (imageElements.length > 0) {
                const ElementsDb = await ctx.prisma.element.findMany({
                    select: {
                        id: true,
                        name: true,
                        img: true,
                    },
                });
                const areOverlapping = (rect1: ImageDOM, rect2: ImageDOM): boolean => {
                    return (
                        rect1.left < rect2.right &&
                        rect1.right > rect2.left &&
                        rect1.top < rect2.bottom &&
                        rect1.bottom > rect2.top
                    );
                };

                for (let i = 0; i < imageElements.length; i++) {
                    const rect1 = imageElements[i];
                    const image1 = images[i]

                    for (let j = i + 1; j < imageElements.length; j++) {
                        const rect2 = imageElements[j];
                        const image2 = images[j]

                        if (
                            (rect1 !== undefined && rect2 !== undefined)
                            && (image1 !== undefined && image2 !== undefined)
                            && (areOverlapping(rect1, rect2))
                        ) {
                            const combination = `${imageElements[i]?.alt ?? ""} + ${imageElements[j]?.alt ?? ""}`;

                            let foundKey: string | undefined;

                            if (combination !== "") {
                                Object.entries(allCombinations).forEach(([key, value]) => {
                                    if (Array.isArray(value) && value.includes(combination)) {
                                        foundKey = key;
                                    }
                                });
                            }

                            const lastPosition = image1.position

                            if (foundKey && ElementsDb) {
                                // const created: Element | undefined = ElementsDb.filter(current => current.name === foundKey)[0]
                                // const createdId = created ? created.id : ""

                                const createdUnlocked: Element | undefined = ElementsDb.filter(current => current.name === foundKey)[0]
                                // console.log(createdUnlocked)

                                const newArray = [...images]
                                newArray.splice(i, 1)
                                newArray.splice(j - 1, 1)


                                if ((createdUnlocked !== undefined) && (images[images.length - 1]?.alt !== foundKey)) {
                                    newArray.push({
                                        alt: createdUnlocked.name,
                                        src: createdUnlocked.img,
                                        position: lastPosition
                                    })

                                    const previousUnlockedElements = await ctx.prisma.user.findUnique({
                                        where: { id: idUserLogged },
                                        select: { unlockedElements: true }
                                    })

                                    if (previousUnlockedElements?.unlockedElements) {
                                        await ctx.prisma.user.update({
                                            where: {
                                                id: idUserLogged
                                            },
                                            data: {
                                                unlockedElements: [
                                                    ...previousUnlockedElements?.unlockedElements,
                                                    createdUnlocked.name
                                                ]
                                            }
                                        });
                                    }

                                    return newArray
                                }
                            }
                        }
                    }
                }

            }
            return images
        }),

    reset: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: id }) => {
            await ctx.prisma.user.updateMany({
                where: {
                    id: id
                },
                data: {
                    unlockedElements: [...ELEMENTS_UNLOCKED_FROM_THE_BEGGINING]
                }
            })

            /* await ctx.prisma.element.updateMany({
                where: {
                    name: {
                        in: [...ELEMENTS_UNLOCKED_FROM_THE_BEGGINING]
                    }
                },
                data: {
                    unlocked: true
                }
            }) */
        })
})