import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    // protectedProcedure,
} from "~/server/api/trpc";

const ELEMENTS_UNLOCKED_FROM_THE_BEGGINING = ['Fire', 'Earth', 'Water', 'Air'] as const

type Element = {
    id: string;
    name: string;
    img: string;
    unlocked: boolean
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

export const elementRouter = createTRPCRouter({
    getAllElements: publicProcedure
        .mutation(async ({ ctx }) => {
            return await ctx.prisma.element.findMany({
                where: {
                    unlocked: true
                },
                select: {
                    id: true,
                    name: true,
                    img: true,
                    unlocked: true
                },
            });
        }),

    unlockElement: publicProcedure
        .input(z.object({
            imageElements: z.array(ImageElementSchema) || z.array(z.undefined()),
            images: z.array(Image)
        }))
        .mutation(async ({ ctx, input: { imageElements, images } }) => {
            // LOOK FOR A WAY TO MAKE THIS FUNCTION FASTER

            if (imageElements.length > 0) {
                const ElementsDb = await ctx.prisma.element.findMany({
                    select: {
                        id: true,
                        name: true,
                        img: true,
                        unlocked: true
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

                const checkForOverlaps = async () => {
                    for (let i = 0; i < imageElements.length; i++) {
                        const rect1 = imageElements[i];
                        const image1 = images[i]

                        for (let j = i + 1; j < imageElements.length; j++) {
                            const rect2 = imageElements[j];
                            const image2 = images[j]

                            if ((rect1 !== undefined && rect2 !== undefined) && (image1 !== undefined && image2 !== undefined) && (areOverlapping(rect1, rect2))) {
                                const combination = `${imageElements[i]?.alt} + ${imageElements[j]?.alt}`

                                let foundKey: string | undefined;

                                Object.entries(allCombinations).forEach(([key, value]) => {
                                    if (Array.isArray(value) && value.includes(combination)) {
                                        foundKey = key;
                                    }
                                });

                                const lastPosition = image1.position

                                if (foundKey && ElementsDb) {
                                    const created: Element | undefined = ElementsDb.filter(current => current.name === foundKey)[0]

                                    const createdId = created ? created.id : ""

                                    const createdUnlocked: Element | undefined = ElementsDb.filter(current => current.name === foundKey)[0]

                                    const newArray = [...images]
                                    newArray.splice(i, 1)
                                    newArray.splice(j - 1, 1)

                                    console.log(createdUnlocked)

                                    if ((createdUnlocked !== undefined) && (images[images.length - 1]?.alt !== foundKey)) {
                                        newArray.push({
                                            alt: createdUnlocked.name,
                                            src: createdUnlocked.img,
                                            position: lastPosition
                                        })

                                        await ctx.prisma.element.update({
                                            where: {
                                                id: createdId
                                            },
                                            data: {
                                                unlocked: true
                                            }
                                        });

                                        return newArray
                                    }
                                }
                            }
                        }
                    }
                };
                return checkForOverlaps()
            }

            return images
        }),

    reset: publicProcedure
        .mutation(async ({ ctx }) => {
            await ctx.prisma.element.updateMany({
                where: {
                    name: {
                        not: "ALL"
                    }
                },
                data: {
                    unlocked: false
                }
            });

            ELEMENTS_UNLOCKED_FROM_THE_BEGGINING.forEach(async (currentElement) => {
                await ctx.prisma.element.updateMany({
                    where: {
                        name: {
                            in: [...ELEMENTS_UNLOCKED_FROM_THE_BEGGINING]
                        }
                    },
                    data: {
                        unlocked: true
                    }
                });
            })
        })
});
