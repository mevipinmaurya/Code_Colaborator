import React, { useEffect, useRef, useState } from 'react'
import Client from './Client.js'
import Editor from './Editor.js'
import { initsocket } from '../socket.js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Dropdown from 'react-bootstrap/Dropdown';
import { MdOutlineContentCopy } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { AiFillAudio } from "react-icons/ai";


function Editorpage() {
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, SetClients] = useState([]);


  // Toggle mic
  const [isOn, setIsOn] = useState(false);

  // Function to toggle the state
  const handleToggle = () => {
    setIsOn(prevState => !prevState);
  };


  const handleError = (e) => {
    console.log('socket error', e);
    toast.error('Socket connection failed', { duration: 2000 });
    navigate('/');
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initsocket();
      socketRef.current.on('connect_error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));

      socketRef.current.emit("join-room", { roomId, username: location.state?.username });
      // console.log(location.state.username)

      socketRef.current.on('joined-room', ({ clients, username, socketId }) => {
        // console.log('joined-room event fired:', { clients, username, socketId });
        if (username !== location.state?.username) {
          toast.success(`${username} has joined the room`, { duration: 2000 });
        }
        SetClients(clients);
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
        });
      });

      // for dissconnecton yaha hum listen karenge
      socketRef.current.on('disconnected', (
        { socketId, username, }) => {
        toast.success(`${username} leave`);
        SetClients((prev) => {
          return prev.filter(
            (clients) => clients.socketId != socketId
          )
        })
      }
      )
    }
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    };

  }, []);



  if (!location.state) {
    navigate('/');
    return null;
  };


  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("RoomId copied successfully", { duration: 2000 });
    } catch (error) {
      toast.error("Unable to copy room id", { duration: 2000 });
    }
  }

  const leaveRoom = async () => {
    navigate('/');
  }


  return (
    <div className='container-fluid vh-100'>
      <div className='row h-100 '>
        {/* left section of editor page */}
        <div className='col-md-2 bg-dark text-light d-flex flex-column h-100 ' style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}>
          <img className='img-fluid mx-auto d-block mb-3 mt-3' src="/images/logo.png" style={{ maxWidth: '150px', marginTop: "0px" }} />
          <hr style={{ marginTop: "-0rem" }} />
          {/* client list container */}
          <div className='d-flex flex-column  overflow-auto'>
            {/* client add krna hai */}
            {clients.map((client) => (
              <Client key={client.socketid} username={client.username} />
            ))}
          </div>

          <div className='mt-auto'>
            <hr style={{}} />
            {/* <button onClick={copyRoomId} className='btn btn-success btn-block'>Copy RoomId</button>
            <button onClick={leaveRoom} className='btn btn-danger mt-2 mb-2 px-3 btn-block'>Leave Room</button> */}

            <p className='text-center text-secondary'>All rights are reserved to CodeTogether.</p>
          </div>
        </div>

        {/* right section of editor page */}
        <div className='col-md-10  text-light d-flex flex-column ' >

          <div className='w-full py-2 px-2 bg-dark d-flex justify-content-between'>
            {/* <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Java
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">Java</Dropdown.Item>
                <Dropdown.Item href="#">C++</Dropdown.Item>
                <Dropdown.Item href="#">JavaScript</Dropdown.Item>
                <Dropdown.Item href="#">Python</Dropdown.Item>
                <Dropdown.Item href="#">Rust</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

            <div className='w-1/3'>
              <select class="form-select" aria-label="Default select example">
                <option selected>Java</option>
                <option value="1">C++ / C</option>
                <option value="2">JavaScript</option>
                <option value="3">Python</option>
              </select>
            </div>

            <div className='cursor-pointer d-flex mx-3'>

              <div className='mx-3 text-danger my-auto' style={{ cursor: "pointer" }}>
                <div onClick={handleToggle} data-toggle="tooltip" data-placement="top" title={`${isOn ? "Mic Off" : "Mic On"}`}>
                  {isOn ?
                    <AiFillAudio size={"30px"} />
                    :
                    <AiOutlineAudioMuted style={{color:"green"}} size={"30px"} />
                  }
                </div>
              </div>

              <div className='mx-3 text-success' style={{ cursor: "pointer" }}>
                <button type="button" className='btn btn-primary' data-toggle="tooltip" data-placement="top" title="Run Code">
                  <IoSend size={"25px"} />
                </button>
              </div>
              <div className='mx-3 text-success' style={{ cursor: "pointer" }}>
                <button type="button" className='btn btn-success' data-toggle="tooltip" data-placement="top" title="Copy RoomId" onClick={copyRoomId}>
                  <MdOutlineContentCopy size={"25px"} />
                </button>
              </div>
              <div className='mx-3 text-danger' style={{ cursor: "pointer" }}>
                <button type="button" className='btn btn-danger' data-toggle="tooltip" data-placement="top" title="Leave Room" onClick={leaveRoom}>
                  <RiLogoutCircleLine size={"25px"} />
                </button>
              </div>
            </div>
          </div>

          < Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
        </div>
      </div>
    </div>
  )
}

export default Editorpage