import { useEffect, useState } from 'react'
import Display from '~/components/Display'
import ElementsLine from '~/components/ElementsLine'
import Head from "next/head";
import { api } from '~/utils/api';
// import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import AuthShowCase from '~/components/AuthShowCase';
import ModalWelcome from '~/components/ModalWelcome';
// import Elements from '../server/elements.json'

//https://littlealchemy.com
//http://localhost:3000/main
//https://cloud.mongodb.com/v2/647b96642faffe4cba6843ba#/clusters/connect?clusterId=littleAlchemi
//https://www.pinterest.com/pin/769763761333151110/
//https://create.t3.gg/en/usage/first-steps
//https://github.com/helmturner/t3-mongo-template/blob/main/src/server/db.ts

//https://little-alchemy.fandom.com/wiki/Elements_(Little_Alchemy_1)

//https://www.npmjs.com/package/react-draggable


//https://www.prisma.io/dataguide/mongodb/managing-documents 
//https://www.prisma.io/docs/guides/database/mongodb


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

const Main: React.FC = () => {
  const { data: sessionData } = useSession();

  const [images, setImages] = useState<Image[]>([]);
  const [imagesDOM, setImagesDOM] = useState<ImageDOM[]>([])
  const [allElementsDB, setAllElementsDB] = useState<Element[]>([])

  const [theme, setTheme] = useState("light")

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ]

  useEffect(() => {
    const imageElements: NodeListOf<HTMLImageElement> = document.querySelectorAll('.img-display');
    const imageElementsArray: HTMLImageElement[] = Array.from(imageElements);

    const imagesDOM = imageElementsArray.map((current: HTMLImageElement) => {
      return {
        alt: current.alt,
        bottom: current.getBoundingClientRect().bottom,
        height: current.getBoundingClientRect().height,
        left: current.getBoundingClientRect().left,
        right: current.getBoundingClientRect().right,
        top: current.getBoundingClientRect().top,
        width: current.getBoundingClientRect().width,
        x: current.getBoundingClientRect().x,
        y: current.getBoundingClientRect().y,
      }
    })
    setImagesDOM(imagesDOM)
  }, [images])

  const getAllElementsDB = api.element.getAllElements.useMutation({
    onSuccess: (allElementsUnlocked) => {
      if (allElementsUnlocked) {
        setAllElementsDB(allElementsUnlocked)
      }
    }/* ,
    onError(error, variables, context) {
      console.log("error", error)
      console.log("variables", variables)
      console.log("context", context)
    }, */
  })

  const changeVisibilityElement = api.user.unlockElement.useMutation({
    onSuccess: (newArrayElements: Image[] | void) => {
      if (newArrayElements !== undefined) {
        console.log(newArrayElements)
        setImages(newArrayElements)
      }
    }
  })

  const resetAllElementsCreated = api.user.reset.useMutation({
    onSuccess: () => {
      setImages([])
      setImagesDOM([])
    }
  })

  function changeTheme(themeSended: string) {
    setTheme(themeSended)
  }

  function handleReset() {
    if (sessionData?.user.id) {
      resetAllElementsCreated.mutate(sessionData?.user.id)
      window.location.reload()
    }
  }

  function handleDrag() {
    if (sessionData?.user.id) {
      changeVisibilityElement.mutate({ imageElements: imagesDOM, images, idUserLogged: sessionData?.user.id })
      getAllElementsDB.mutate(sessionData?.user.id)
    }
  }

  const handleClick = (elementSended: Element) => {
    const newImage: Image = {
      src: elementSended.img,
      alt: elementSended.name,
      position: { x: 0, y: 0 }
    };
    setImages([...images, newImage]);
  };

  const deleteImage = (imageSended: Image, indexSended: number) => {
    setImages(prevImages => prevImages.filter((image, index) =>
      (image !== imageSended) && (index !== indexSended)
    ));
    // setImages(prevImages => prevImages.splice(indexSended, 0));
  }

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const imageElement = event.target as HTMLImageElement;
    const { x, y } = imageElement.getBoundingClientRect();

    setImages(prevImages => prevImages.map(currentImage => {
      return {
        ...currentImage,
        position: { x, y }
      }
    }));

    if (sessionData?.user.id) {
      getAllElementsDB.mutate(sessionData?.user.id)
    }
  };

  return (
    <>
      <Head>
        <title>Little Alchemy - Clone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="https://littlealchemy.com/img/little-alchemy-1024-logo.png" />
      </Head>
      <div data-theme={theme} className='min-h-screen'>

        <div className="collapse collapse-arrow border border-base-300 bg-base-100 min-h-[5vh]">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Little Alchemy
          </div>
          <div className="collapse-content flex flex-col md:flex-row lg:flex-row gap-5 w-full justify-center items-center ">
            <AuthShowCase />
            <div className='flex gap-5 justify-center md:justify-end items-center'>
              <button onClick={handleReset} className='btn btn-primary text-base-100'>
                Reset Progress
              </button>

              <div className="form-control w-full max-w-xs">
                {/* <label className="label">
                  <span className="label-text">Pick the theme</span>
                </label> */}
                <select onChange={(e) => changeTheme(e.target.value)} className="select select-primary w-full max-w-xs">
                  {
                    themes.map((currentTheme) => {
                      return (
                        <option value={currentTheme} data-theme={theme} key={currentTheme}>
                          <p>{currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</p>
                        </option>
                      )
                    })
                  }
                </select>
              </div>

            </div>
          </div>
        </div>

        <ModalWelcome
          allElementsDB={allElementsDB}
          setAllElementsDB={setAllElementsDB}
          setImages={setImages}
          setImagesDOM={setImagesDOM}
        />
        {
          (allElementsDB.length > 0 && sessionData?.user) ?
            <div className='flex flex-row h-screen max-h-[93.2vh] overflow-hidden'>
              <Display
                images={images}
                deleteImage={deleteImage}
                handleImageLoad={handleImageLoad}
                handleDrag={handleDrag}

              />
              <ElementsLine
                handleClick={handleClick}
                allElementsDB={allElementsDB}
              />
            </div>
            :
            null
        }
      </div>
    </>
  )
}

export default Main