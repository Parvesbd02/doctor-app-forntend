import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import HomeBanner from '../components/HomeBanner'

const Home = () => {
  return (
    <div>
      <Header></Header>
      <SpecialityMenu></SpecialityMenu>
      <TopDoctors></TopDoctors>
     <HomeBanner></HomeBanner>
    </div>
  )
}

export default Home