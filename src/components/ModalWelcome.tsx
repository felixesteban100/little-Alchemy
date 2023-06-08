import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

type Element = {
    id: string;
    name: string;
    img: string;
}

type Image = {
    src: string;
    alt: string;
    position: {
        x: number,
        y: number
    }
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


type ModalWelcomeProps = {
    allElementsDB: Element[];
    setAllElementsDB: React.Dispatch<React.SetStateAction<Element[]>>;
    setImages: React.Dispatch<React.SetStateAction<Image[]>>;
    setImagesDOM: React.Dispatch<React.SetStateAction<ImageDOM[]>>;
}

function ModalWelcome({ allElementsDB, setAllElementsDB, setImages, setImagesDOM }: ModalWelcomeProps) {
    const { data: sessionData } = useSession();

    const getAllElementsDB = api.element.getAllElements.useMutation({
        onSuccess: (allElementsUnlocked) => {
            if (allElementsUnlocked) {
                setAllElementsDB(allElementsUnlocked)
            }
        }
    })

    const resetAllElementsCreated = api.user.reset.useMutation({
        onSuccess: () => {
            setImages([])
            setImagesDOM([])
        }
    })

    return (
        <div>
            {/* i don't need this button to open */}
            {/* <label htmlFor="modal-welcome" className="btn">open modal</label> */}

            {/* Put this part before </body> tag */}
            <input defaultChecked type="checkbox" id="modal-welcome" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold text-center">Welcome!</h3>
                    <div className="w-[70%] mx-auto">
                        <img className="h-32" src="/logoApp.png" alt="logo" />
                    </div>
                    <p className="py-4 text-center">Click start or outside of the box to begin</p>
                    <div className="modal-action">
                        <label
                            onClick={() => {
                                if (sessionData?.user.id) {
                                    getAllElementsDB.mutate(sessionData?.user.id)

                                    // to avoid this I should find how to add the unlockedElements when the user is created in the database
                                    //some files to achieve that:
                                    //node_modules\next-auth\src\core\lib\email\getUserFromEmail.ts
                                    //node_modules\next-auth\adapters.d.ts
                                    //node_modules\next-auth\src\adapters.ts
                                    //node_modules\next-auth\src\core\types.ts
                                    //node_modules\@next-auth\prisma-adapter\dist\index.d.ts

                                    if (allElementsDB.length < 4) {
                                        resetAllElementsCreated.mutate(sessionData?.user.id)
                                    }
                                    // to avoid this I should find how to add the unlockedElements when the user is created in the database

                                }
                            }}
                            htmlFor="modal-welcome"
                            className="btn mx-auto"
                        >
                            Start!
                        </label>
                    </div>
                </div>
                <label onClick={() => {
                    if (sessionData?.user.id) {
                        getAllElementsDB.mutate(sessionData?.user.id)

                        // to avoid this I should find how to add the unlockedElements when the user is created in the database
                        //some files to achieve that:
                        //node_modules\next-auth\src\core\lib\email\getUserFromEmail.ts
                        //node_modules\next-auth\adapters.d.ts
                        //node_modules\next-auth\src\adapters.ts
                        //node_modules\next-auth\src\core\types.ts
                        //node_modules\@next-auth\prisma-adapter\dist\index.d.ts

                        if (allElementsDB.length < 4) {
                            resetAllElementsCreated.mutate(sessionData?.user.id)
                        }
                        // to avoid this I should find how to add the unlockedElements when the user is created in the database

                    }
                }}
                    className="modal-backdrop"
                    htmlFor="modal-welcome"
                >
                    Close
                </label>
            </div>
        </div>
    )
}

export default ModalWelcome