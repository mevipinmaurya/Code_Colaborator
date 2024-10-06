import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {v4 as uuid} from 'uuid';
import { useNavigate } from 'react-router-dom';
// yaha home page hai
function Home() {
  const [roomId , setRoomId] = useState("");
  const [username , setUserName] = useState("");
  const navigate = useNavigate();
 const genrateRoomId = (e)=>{
   e.preventDefault();
   const id = uuid();
   setRoomId(id);
   toast.success('Room Id Genrated',{duration:2000});
 } 

 const  joinRoom =()=>{
    if(!roomId || !username ){
      toast.error('Please Enter both Room Id and UserName',{duration:2000});
      return;
    }
    // window.location.href=`/editor/${roomId}?userName=${userName}`;
    navigate(`/editor/${roomId}`,{
      state:{username},
    });
    toast.success('Joining Room',{duration:2000});
 }
  return (
      <div className='container-fluid'>
          <div className='row justify-content-center align-items-center min-vh-100'>
            <div className='col-12 col-md-6'>
            <div className='card shadow-sm p-2 mb-6 bg-secondary rounded'>
              <div className='card-body text-center bg-dark'>
                  <img className='img-fluid mx-auto d-block mb-3' src="/images/SHARE (2).png" style={{maxWidth:'150px'}}/>
                  
              <h4 className='text-light text-center mb-3'>Enter The Room Id</h4>
              
              <div className='form-group mb-3'>
                <input type='text' className='form-control' placeholder='Room ID' value={roomId} onChange={(e)=> setRoomId(e.target.value)}/>
                </div>
                <div className='form-group mb-3'>
                <input type='text' className='form-control' placeholder='UserName' value={username} onChange={(e)=>setUserName(e.target.value)}/>
              </div>
              <button className='btn btn-success btn-lg btn-block' onClick={joinRoom}>Join</button>
              <p className='mt-3 text-light'>Dont have a room id? <span className='text-success p-2' style={{cursor:'pointer'}} onClick={genrateRoomId}>New Room</span></p>
            </div>
            </div>
            </div>
          </div>
      </div>
  )
}

export default Home