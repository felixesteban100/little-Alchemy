import React from 'react'
// import { useSession } from "next-auth/react";
// import { api } from "~/utils/api";
import Elements from '../server/elements.json'

type ElementsLineProps = {
  handleClick: (elementSended: Element) => void
}

type Element = {
  name: string;
  img: string;
  unlocked: boolean
}



function ElementsLine({handleClick}: ElementsLineProps) {
  // const { data: sessionData } = useSession()

  const allElements = organizeAndSeparateArray(Elements)

  // console.log("element", api.element.getAllElements.useQuery())
  // console.log("example", api.example.getAll.useQuery().data)

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
    <div className='z-10 shrink-0 border-white  bg-orange-100 w-[10rem] md:w-[15rem]'>
      <div className="overflow-x-auto h-full overflow-y-scroll">
        {/* <table className='table table-pin-rows'> */}
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
                      if (obj.unlocked === true) {
                        return(
                          <tr key={index}>
                              <td className='flex items-center gap-2 cursor-grab' onClick={() => handleClick(obj)}>
                                <img className='h-10' src={obj.img} alt={obj.name} loading='lazy' />
                                {obj.name}
                              </td>
                          </tr>
                        )
                      }
                    })}
                  </tbody>
                </table>
              )
            })
          }
        {/* </table> */}
      </div>
    </div>
  )
}

export default ElementsLine