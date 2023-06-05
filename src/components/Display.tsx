import Draggable from 'react-draggable';

type DisplayProps = {
  images: Image[]
  deleteImage: (image: Image, indexSended: number) => void
  handleImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void
}

type Image = {
  src: string;
  alt: string;
  position: {
    x: number,
    y: number
  }
}

function Display({ images, deleteImage, handleImageLoad }: DisplayProps) {
  return (
    <div className='flex-1 border-r-4 border-white bg-base-200'>
      {images.map((image: Image, index: number) => (
        <Draggable key={`${image.src}-${index}`} defaultPosition={{ x: image.position.x, y: image.position.y}}>
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
              }}
              className='cursor-pointer h-auto w-24'
              src={image.src}
              alt={image.alt}
            />
            <p>{image.alt}</p>
          </div>
        </Draggable>
      ))}
    </div>
  )
}

export default Display