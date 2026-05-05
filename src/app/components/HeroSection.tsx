import React from 'react'

type Props = {}

function HeroSection({}: Props) {
  return (
    <section className='w-full'>
      <div className=''>
        <h1 className='text-6xl font-extrabold'>Heon H.</h1>
        <ul className='w-full'>
          <li>Computer Engineering, University of Florida (Class of 2028)</li>
          <li>Software Engineering Intern, Tern</li>
          <li>IPPD Program w/ Arthrex</li>
          <li>Florida Department of Transportation</li>
          <li>Intelligent Ontology Lab</li>
          <li>Florida Museum of Natural History</li>
        </ul>
      </div>
    </section>
  )
}

export default HeroSection