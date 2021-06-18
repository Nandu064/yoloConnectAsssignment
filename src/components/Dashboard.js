import axios from 'axios'
import {useState,useEffect} from 'react'
import {Table,Modal,Card} from 'react-bootstrap'
import React from 'react'
export default function Dashboard() {
   const [launches,setLaunches] = useState();
   const [show, setShow] = useState(false);
   const [selectedData, setSelectedData] = useState();
   //const {flight_number,details,mission_name,launch_date_utc,launch_success} = selectedData
   const handleClose = ()=> setShow(false)
    useEffect(() => {
        axios.get('https://api.spacexdata.com/v3/launches'
        ,{
            params: {
                limit:10
              }
        }
        )
        .then((res)=>{
            setLaunches(res.data);
            console.log(res.data);
        })
    },[])
    
    const success = "Succcess"
    const fail = "Failed"

    const handleChange=()=>{
        const select = document.getElementById("select");
        const selectedValue = select.options[select.selectedIndex].value;
        if(selectedValue==="failed"){
            axios.get('https://api.spacexdata.com/v3/launches'
                ,{
                    params: {
                        launch_success: false,
                        limit:10
                    }
                }
                )
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
        if(selectedValue==="success"){
            axios.get('https://api.spacexdata.com/v3/launches'
                ,{
                    params: {
                        launch_success: !false,
                        limit:10
                    }
                }
                )
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
        if(selectedValue==="upcoming"){
            axios.get('https://api.spacexdata.com/v3/launches/upcoming'
                ,{
                    params: {
                        limit:10
                    }
                }
                )
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
        if(selectedValue==="all"){
            axios.get('https://api.spacexdata.com/v3/launches'
                ,{
                    params: {
                        limit:10
                    }
                }
                )
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
    }
    return (
        <div>
            <div>
                <h1 style={{
                    backgroundColor:'lightgray',
                    color:'black',
                    fontSize:'24px',
                    fontWeight:'bold',
                    height:'40px'
                    }}>Space X</h1>
                <div 
                    style={{
                        display:'flex',
                        justifyContent:'flex-end',
                        paddingTop:'10px',
                        marginBottom:'10px',
                    }}
                >
                    <i className="fas fa-filter"
                        style={{
                            height:'20px',
                            width:'20px'
                        }}
                    ></i>
                    <select id="select" style={{width:'150px'}} onChange={handleChange}>
                        <option value="all">All Launches</option>
                        <option value="upcoming">Upcoming Launches</option>
                        <option value="success">Successfull Launches</option>
                        <option value="failed">Failed Launches</option>
                    </select>
                </div>
            </div>
           
            <Table responsive>
                <thead>
                    <tr style={{backgroundColor:'lightgray'}}>
                        <th>No</th>
                        <th>Launched (UTC)</th>
                        <th>Location</th>
                        <th>Mission</th>
                        <th>Orbit</th>
                        <th>Launch Status</th>
                        <th>Rocket</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        launches ? 
                        launches.map((launch,index)=>{
                            return(
                                <tr 
                                    key={index}
                                    onClick={()=>{
                                        setShow(true)
                                        setSelectedData(launch)
                                        }}
                                >
                                    <td>{index+1}</td>
                                    <td>{launch.launch_date_utc}</td>
                                    <td>{launch.launch_site.site_name}</td>
                                    <td>{launch.mission_name}</td>
                                    <td>{launch.rocket.second_stage.payloads[0].orbit}</td>
                                    <td>
                                        {
                                            launch.upcoming === true ?<p style={{backgroundColor:'orange',color:'red',width:'auto',borderRadius:'12px'}}> Upcoming </p>:
                                            launch.launch_success ? <p style={{backgroundColor:'lightgreen',color:'green',width:'auto',borderRadius:'12px'}}>{success}</p> : <p style={{backgroundColor:'orange',color:'red',width:'auto',borderRadius:'12px'}}>{fail}</p>
                                        }
                                    </td>
                                    <td>{launch.rocket.rocket_name}</td>
                                </tr>
                            )
                        }) : null
                    }                    
                </tbody>
            </Table>
            {
                selectedData ?
                <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Card style={{ width: '18rem',border:'0px' }}>
                            <Card.Body>
                                <Card.Title>
                                    <p style={{display:'flex',width:'200px',justifyContent:'space-between'}}>
                                        {selectedData.mission_name}
                                        {selectedData.launch_success ? <span style={{backgroundColor:'lightgreen',color:'green',width:'auto',borderRadius:'12px'}}>{success}</span> : <span style={{backgroundColor:'orange',color:'red',width:'auto',borderRadius:'12px'}}>{fail}</span>}
                                    </p>
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{selectedData.rocket.rocket_name}</Card.Subtitle>
                                
                            </Card.Body>
                        </Card>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <Card.Text>
                                    {selectedData.details}
                                </Card.Text>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >Flight Number</td>
                                <td style={{align:'right',width:'140px'}}>{selectedData.flight_number}</td>
                            </tr>                   
                            <tr>
                                <td>Mission Name</td>
                                <td style={{align:'right'}}>{selectedData.mission_name}</td>
                            </tr>                   
                            <tr>
                                <td>Rocket Type</td>
                                <td style={{align:'right'}}>{selectedData.rocket.rocket_type}</td>
                            </tr>                   
                            <tr>
                                <td>Rocket Name</td>
                                <td style={{align:'right'}}>{selectedData.rocket.rocket_name}</td>
                            </tr>                   
                            <tr>
                                <td>Manufacturer</td>
                                <td style={{align:'right'}}>SpaceX</td>
                            </tr>                   
                            <tr>
                                <td>Nationality</td>
                                <td style={{align:'right'}}>SpaceX</td>
                            </tr>                   
                            <tr>
                                <td>Launch Date</td>
                                <td style={{align:'right'}}>{selectedData.launch_date_utc}</td>
                            </tr>                   
                            <tr>
                                <td>Payload Type</td>
                                <td style={{align:'right'}}>{selectedData.rocket.rocket_type}</td>
                            </tr>                   
                            <tr>
                                <td>Orbit</td>
                                <td style={{align:'right'}}>{selectedData.rocket.second_stage.payloads[0].orbit}</td>
                            </tr>                   
                            <tr>
                                <td>Launch Site</td>
                                <td style={{align:'right'}}>{selectedData.launch_site.site_name}</td>
                            </tr>                   
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
            : null
            }
        </div>                
    )
}