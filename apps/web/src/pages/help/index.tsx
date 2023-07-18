import React from 'react'
import FAQ from '~/components/FAQ'


const questionNo = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
const Help = () => {
  return (
    <div>
      <div>
        <h1 className='my-10 mx-10 text-2xl font-bold'>FAQ's</h1>
        <div>
          {questionNo?.map((question)=>
            <FAQ que={question}/>
          )}
        </div>
      </div>
    </div>
  )
}

export default Help