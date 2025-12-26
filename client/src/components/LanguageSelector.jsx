import React from 'react'

const LanguageSelector = ({languages=[],selectedLanguage,onselect})=>{




  return (

    <div className='font-tagline ms-4'>
        {languages.map((lang)=>(

        <button className={`px-4 py-2 rounded border me-2 ${
            selectedLanguage === lang
              ? "bg-amber-600 text-white"  
              : " text-white border-gray-300"
          }`} key={lang} onClick={()=>onselect(lang)}>
          {lang}
        </button>
    ) )}
    <button className=' p-3 ms-1 text-lg text-white fond-bold hover:text-red-500 ' onClick={()=>onselect("")}>
       clear
    </button>
    </div>
  )
}

export default LanguageSelector