import logo from './logo.svg';
import './App.css';
import io from "socket.io-client"
import {useEffect, useState} from "react"

function App() {

  const [socket, setSocket] = useState(null)
  const [room, setRoom] = useState({prevRoom: "", currentRoom: ""})
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState({})
  const [messages, setMessages] = useState([])
  const [countOnlineInRoom, setCountOnlineInRoom] = useState(0)
  const [countOnlineInApp, setCountOnlineInApp] = useState(0)

  useEffect(()=>{
    const newSocket = io.connect('http://localhost:8080/chat')

    newSocket.on("connect", ()=>{
      console.log("socket connected !!!")
    })

    setSocket(newSocket)
  },[])

  const handleSendMessage = ()=>{
    const payload = {...message, room: room.currentRoom}
    socket.emit("SEND_MESSAGE", payload)
  }

  const handleRoom = ()=>{
    socket.emit("JOIN_ROOM",room)

    setRoom((prev)=>({...prev, prevRoom: room.currentRoom}))
  }

  useEffect(()=>{
    if(socket){
      socket.on("RECIEVE_MESSAGE", (data)=>{
        setMessages((prev)=> [...prev, data])
      })  
    socket.on("RECIEVE_TYPING", (isTyping)=>{
      setIsTyping(isTyping)
    }) 
    socket.on("RECIEVE_USERS_ONLINE_IN_ROOM", (data)=>{
      setCountOnlineInRoom(data)
    })   
    socket.on("RECIEVE_USERS_LEFT_IN_ROOM", (data)=>{
      setCountOnlineInRoom(data)
    })  
    }
  },[socket])

  useEffect(()=>{
    if(message.message){
      socket.emit("IS_TYPING", {isTyping: true, room: room.currentRoom})
    }
    else if(socket){
      socket.emit("IS_TYPING", {isTyping: false, room: room.currentRoom})
    }
  },[message])

  return (
    <div>
      <ul class="nav flex-column navbar navbar-expand-lg navbar-light bg-light">
        <li class="nav-item">
          <p><sup>{countOnlineInRoom}</sup> <strong>Users Online In Current Room</strong></p>
        </li>
        <li class="nav-item">
          <p><sup>{countOnlineInApp}</sup> <strong>Users Online In App</strong></p>
        </li>
      </ul>
        <div className="row" style={{marginTop : "20px", marginLeft: "20px", marginRight: "20px"}}>
          <div className="col-md-6">
                <div className="card mb-3 border-primary">
                    <div className="card-header bg-primary text-center">
                      Room Card
                    </div>
                    <div className="card-body">
                        <div className="row g-3 justify-content-center">
                              <div className="col-10">
                                <input className='form-control' placeholder='Room...' onChange={(e)=>{ setRoom((prev)=>({...prev, currentRoom: e.target.value}))}} type="text" id="fname" name="fname"/>
                              </div>
                              <div className="col  text-center">
                                <button className='btn btn-primary' onClick={handleRoom} type="submit" >Join</button>
                              </div> 
                        </div>  
                  </div>
                </div>              
              </div> 
              <div className="col-md-6">
              <div className="card mb-3 border-success">
                  <div className="card-header bg-success text-center">
                    Message Card
                  </div>
                  <div className="card-body overflow-auto" style={{height: "300px"}}>
                      {
                        messages.map((data, index)=>{
                          return(                          
                          <div key={index}>
                            <div className="alert alert-success">
                            <p style={{textAlign:"right"}} className="alert-link">@{data.username}</p>
                            <p>{data.message}</p>
                            </div>
                          </div>
                          )
                          
                        })
                      }
                      {isTyping ? <p>Sedang Typing...</p>:false}
                </div>
                <div className="card-body">
                      <div className="row g-3 justify-content-center">
                            <div className="col-5">
                              <input className='form-control' placeholder='Username...' onChange={(e) => { 
                                                                                          setMessage((prev)=>({...prev, username : e.target.value}))                                                                                 
                                                                                        }} type="text" id="fname" name="fname"/>
                            </div>
                            <div className="col-5">
                              <input className='form-control' placeholder='Message...' onChange={(e) => {
                                                                                            setMessage((prev)=>({...prev, message : e.target.value}))
                                                                                            }} type="text" id="lname" name="lname"/>                        
                            </div>
                              <div className="col text-center">
                                <button className='btn btn-success' onClick={handleSendMessage} type="submit" >Send</button>
                              </div> 
                        </div>   
                  </div>
              </div>              
            </div>
        </div>
    </div>
  );
}

export default App;
