import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Insert from "./pages/Insert";
import PortfolioList from "./pages/PortfolioList";
import PortfolioSingle from "./pages/PortfolioSingle";
// import data from "./data.json";
import { supabase } from "./supabase";

function App() {
  const [data, setData] = useState([]);
  
  useEffect(()=>{
    async function fetchProjects(){
      const { data:projects } = await supabase
      .from('projects')
      .select()
      .order('id', { ascending: false })
      .limit(3);

      console.log(projects);

      if(projects.length>0){
        setData(projects); // 
      }
    }

    fetchProjects(); //실행
  },[]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home data={data}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/insert" element={<Insert />} />

        <Route path="/portfolio" element={<PortfolioList data={data} />} />
        <Route path="/portfolio/:id" element={<PortfolioSingle data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;
