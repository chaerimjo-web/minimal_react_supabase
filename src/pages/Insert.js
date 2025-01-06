import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabase";


const Insert = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navigate = useNavigate(); //usenavigate 초기화 (실행)
  const [data, setData] = useState({
    title:'', 
    content:''
  });
  const [file, setFile] = useState(null);

  const handleChange = (e)=>{
    let {name, value} = e.target;
    setData({
      ...data, 
      [name]:value
    })
  }
  const handleFileChange = (e)=>{
    const attachFile = e.target.files[0];
    setFile(attachFile);
  }
  const handleSignOut = ()=>{
    supabase.auth.signOut();
    navigate('/');
  }

  // Upload file using standard upload
  async function uploadFile(file) {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `thumbnail/${fileName}`;
    const { data, error } = await supabase.storage.from('project').upload(filePath, file)
    if (error) {
      // Handle error
      alert('파일 업로드 실패');
      console.log(error);
    } else {
      // Handle success
      alert('파일 업로드 성공');
      console.log(data);
      return filePath;
    }
  }

  async function InsertData(e){
    e.preventDefault();
    let thumbnailPath = null;
    if(file){
      const uploadedFilePath = await uploadFile(file);
      if(uploadedFilePath){
        thumbnailPath = uploadedFilePath;
      }
    }

    const { error } = await supabase
    .from('projects')
    .insert({ title: data.title, content: data.content, thumbnail:thumbnailPath })

    
    if(error){
      alert('입력 실패');
      console.log(error);
    }else{
      alert('입력 성공');
      navigate('/');
    }
  }

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (
      <div>
        <Header />
        <main class="Content">
        <div class="container about_content shadow">
          <div class="form">
            <h3 class="heading6">Project 입력</h3>
            <div class="contact_form">
              <form action="" onSubmit={InsertData}>
                <p class="field">
                  <label for="title">Title:</label>
                  <input type="text" id="title" name="title" onChange={handleChange} placeholder="Title"/>
                </p>
                <p class="field">
                  <label for="content">content:</label>
                  <textarea name="content" id="content" placeholder="content" rows="10" cols="30" onChange={handleChange}></textarea>
                </p>
                <p class="field">
                  <label for="file">Project Description:</label>
                  <input type="file" name="thumbnail" onChange={handleFileChange}/>
                </p>
                <p class="submit">
                  <input type="submit" class="primary-btn" value="입력"/>
                </p>
                <button type="button" onClick={handleSignOut}>로그아웃</button>
              </form>
            </div>
          </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
};

export default Insert;
