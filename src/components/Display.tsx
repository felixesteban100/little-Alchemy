import Draggable from 'react-draggable';

type DisplayProps = {
  images: Image[]
  deleteImage: (image: Image, indexSended: number) => void
  handleImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void
  handleDrag: () => void
  handleReset: () => void

  changeTheme: () => void
  theme: boolean
}

type Image = {
  src: string;
  alt: string;
  position: {
    x: number,
    y: number
  }
}


// search for a way how to play a pop sound /public/pop.mp3


function Display({ images, deleteImage, handleImageLoad, handleDrag, handleReset, theme, changeTheme }: DisplayProps) {
  return (
    <div className='flex-1 border-r-4 border-white bg-base-200'>
      {images.map((image: Image, index: number) => (
        <Draggable key={`${image.src}-${index}`} defaultPosition={{ x: image.position.x, y: image.position.y }}>
          <div className={`z-${"10"} mx-auto absolute flex flex-col justify-center items-center`}>
            <img
              onAuxClick={(e) => {
                e.preventDefault()
                deleteImage(image, index)
              }}
              onDragStartCapture={e => {
                e.dataTransfer.dropEffect = "move";
                e.preventDefault()
                handleImageLoad(e)
                handleDrag()
              }}
              className='cursor-pointer h-auto w-24 img-display'
              src={image.src}
              alt={image.alt}
            />
            <p>{image.alt}</p>
          </div>
        </Draggable>
      ))}
      <div className='flex gap-5'>
        <button onClick={handleReset} className='btn btn-circle'>
          Reset
        </button>
        <button onClick={changeTheme} className='btn btn-square'>
          {theme ? "🌑" : "💡"}
        </button>
      </div>
    </div>
  )
}

export default Display