
type Element = {
  id: string;
  name: string;
  img: string;
}

type ElementsLineProps = {
  handleClick: (elementSended: Element) => void
  allElementsDB: Element[]
}

// I SHOULD FIGURE A WAY OUT FOR HOW TO SAVE EACH ELEMENT LOCKED STATE FOR EACH USER ACCOUNT


function ElementsLine({ handleClick, allElementsDB }: ElementsLineProps) {
  const allElements = allElementsDB ? organizeAndSeparateArray(allElementsDB) : undefined

  function organizeAndSeparateArray(arr: Element[]): { [letter: string]: Element[] } {
    const sortedArray = arr.sort((a, b) => a.name.localeCompare(b.name)); // Sort the array by the 'name' property

    const separatedArrays: { [letter: string]: Element[] } = {};

    for (const obj of sortedArray) {
      const firstLetter = obj.name.charAt(0).toUpperCase(); // Get the first letter of the 'name' property and convert it to uppercase

      if (!separatedArrays[firstLetter]) {
        separatedArrays[firstLetter] = []; // Create a new array for the letter if it doesn't exist yet
      }
      separatedArrays[firstLetter]!.push(obj); // Push the object into the corresponding letter array
    }

    return separatedArrays;
  }

  return (
    <div className='z-10 shrink-0 border-white bg-base-300 w-[10rem] md:w-[15rem]'>
      {
        allElements &&
        <div className="overflow-x-auto h-full overflow-y-scroll">
          {
            Object.entries(allElements).map(([letter, objects]) => {
              return (
                <table className='table table-pin-rows' key={letter}>
                  <thead className='w-full'>
                    <tr>
                      <th>{letter}</th>
                    </tr>
                  </thead>
                  <tbody className='w-full'>
                    {objects.map((obj, index) => {
                        return (
                          <tr key={index}>
                            <td className='flex items-center gap-2 cursor-grab' onClick={() => handleClick(obj)}>
                              <img className='h-10' src={obj.img} alt={obj.name} loading='lazy' />
                              {obj.name}
                            </td>
                          </tr>
                        )
                    })}
                  </tbody>
                </table>
              )
            })
          }
        </div>}
    </div>
  )
}

export default ElementsLine