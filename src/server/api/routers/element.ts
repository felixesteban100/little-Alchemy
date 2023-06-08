import { z } from "zod";
import {
    createTRPCRouter,
    // publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";



export const elementRouter = createTRPCRouter({
    getAllElements: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: idUserLogged }) => {
            const elementsUnlockedByUser = await ctx.prisma.user.findUnique({
                where: {
                    id: idUserLogged
                },
                select: {
                    unlockedElements: true
                }
            });

            if (elementsUnlockedByUser?.unlockedElements) {
                return await ctx.prisma.element.findMany({
                    where: {
                        name: {
                            in: elementsUnlockedByUser?.unlockedElements
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        img: true,
                    },
                });
            }

            return undefined
        }),
});





/* if (imageElements.length > 0) {
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
                }
                return checkForOverlaps()
            }
            return images */

            // the above way is for element unlocked inside each one
