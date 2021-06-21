import axios from 'axios'
import {useState,useEffect} from 'react'
import {Table,Modal,Card} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import styles from './Dashboard.module.css'
import React from 'react'
export default function Dashboard() {
   const [launches,setLaunches] = useState();
   const [show, setShow] = useState(false);
   const [selectedData, setSelectedData] = useState();
   const launchData = launches ? launches.map(launch=>{
       
       if(launch.launch_success === true){
            return launch.launch_success = "Success"
            
       }else if(launch.launch_success === false){
            return launch.launch_success = "Failed"
       }
       else if(launch.launch_success === null){
            return launch.launch_success = "Upcoming"
       }
       const x = new Date(launch.launch_date_utc)
       launch.launch_date_utc = x.toUTCString()
       
   }): null;
   
   const paginateData = launches
   
   const paginateColumns = [
    { dataField: 'flight_number', text: 'No',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
    { dataField: 'launch_date_utc', text: 'Launched (UTC)',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
    { dataField: 'launch_site.site_name', text: 'Location',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
    { dataField: 'mission_name', text: 'Mission',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
    { dataField: 'rocket.second_stage.payloads[0].orbit', text: 'Orbit',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
    { 
        dataField: 'launch_success',
        style:(cell,row,rowIndex,colIndex)=>{
            if(row.launch_success === "Success"){
                return {
                    backgroundColor: 'lightgreen',
                    color:'green'
                }
            }else if(row.launch_success === "Failed"){
                return {
                    backgroundColor:'orange',
                    color:'red'
                }
            }else if(row.launch_success === "Upcoming"){
                return {
                    backgroundColor:'orange',
                    color:'red'
                }
            }
        },
        text: 'Launch Status',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
    { dataField: 'rocket.rocket_name', text: 'Rocket',headerStyle: { backgroundColor: '#215E95', color: 'white'} },
  ];
  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: 'Next',
    prePageText: 'Prev',
    alwaysShowAllBtns: true,
    hideSizePerPage: true,
  });
  const rowEvent={
    onClick: (e, row, rowIndex) => {
        setShow(true);
        setSelectedData(launches[rowIndex]);
      }
  }
   const handleClose = ()=> setShow(false)
    useEffect(() => {
        axios.get('https://api.spacexdata.com/v3/launches')
        .then((res)=>{
            setLaunches(res.data);
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
                    }
                }
                )
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
        if(selectedValue==="upcoming"){
            axios.get('https://api.spacexdata.com/v3/launches/upcoming')
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
        if(selectedValue==="all"){
            axios.get('https://api.spacexdata.com/v3/launches')
                .then((res)=>{
                    setLaunches(res.data);
                })
        }
    }
    return (
        <div>
            <div style={{
                display:'flex',
                justifyContent:'space-between',
                height:'45px',
                marginBottom:'30px',
            }}>
                <h1 style={{
                    backgroundColor:'#215E95',
                    color:'white',
                    fontSize:'24px',
                    fontWeight:'bold',
                    height:'100%',
                    width:'70%'
                    }}>Space X</h1>
                <div 
                    style={{
                        display:'flex',
                        justifyContent:'flex-end',
                        height:'100%',
                        paddingTop:'10px',
                        marginBottom:'10px',
                        width:'30%'
                    }}
                >
                    <i className="fas fa-filter"
                        style={{
                            color:'#215E95',
                            height:'25px',
                            width:'25px'
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
          { launches ?
            <BootstrapTable  rowEvents={rowEvent} keyField='flight_number' data={paginateData} columns={paginateColumns} pagination={pagination}/>: null}
            {
                selectedData ?
                <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{width:'90%'}}>
                        <div className={styles.container}>
                            <div className="image">
                                <img src={selectedData.links.mission_patch_small} style={{width:'100px',height:'100%'}}></img>
                            </div>
                            <div className="titleContainer">
                                <div className="title">
                                    <h4>{selectedData.mission_name}</h4>
                                    <h6>{selectedData.rocket.rocket_name}</h6>
                                </div>
                                <div className={styles.linkDetails}>
                                    <a href={selectedData.links.article_link}><i className="fas fa-blog" style={{color:'black',}}></i></a>
                                    <a href={selectedData.links.wikipedia}><i className="fab fa-wikipedia-w" style={{color:'black',}}></i></a>
                                    <a href={selectedData.links.video_link}><i className="fab fa-youtube" style={{color:'black',}}></i></a>
                                </div>
                            </div>
                            <div className={styles.status}>
                                {
                                    (selectedData.launch_success === "Success") ?<span style={{fontSize:'14px',borderRadius:'12px',backgroundColor:'lightgreen',color:'green',position:'absolute',top:'0',left:'0'}}>{success}</span> : ((selectedData.launch_success === "Failed" ) ? <span style={{fontSize:'14px',borderRadius:'12px',backgroundColor:'orange',color:'red',position:'absolute',top:'0',left:'0'}}>{fail}</span> :<span style={{fontSize:'14px',borderRadius:'12px',backgroundColor:'orange',color:'red',position:'absolute',top:'0',left:'0'}}>Upcoming</span>) 
                                }
                            </div>
                        </div>
                        
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class={styles.details}>
                        {selectedData.details} 
                        <a href={selectedData.links.wikipedia}> Wikipedia</a>
                    </div>
                    <Table responsive>
                        <tbody>
                            <tr>
                                <td >Flight Number</td>
                                <td style={{align:'left',width:'55%'}}>{selectedData.flight_number}</td>
                            </tr>                   
                            <tr>
                                <td>Mission Name</td>
                                <td style={{align:'left'}}>{selectedData.mission_name}</td>
                            </tr>                   
                            <tr>
                                <td>Rocket Type</td>
                                <td style={{align:'left'}}>{selectedData.rocket.rocket_type}</td>
                            </tr>                   
                            <tr>
                                <td>Rocket Name</td>
                                <td style={{align:'left'}}>{selectedData.rocket.rocket_name}</td>
                            </tr>                   
                            <tr>
                                <td>Manufacturer</td>
                                <td style={{align:'left'}}>{selectedData.rocket.second_stage.payloads[0].manufacturer}</td>
                            </tr>                   
                            <tr>
                                <td>Nationality</td>
                                <td style={{align:'left'}}>{selectedData.rocket.second_stage.payloads[0].nationality}</td>
                            </tr>                   
                            <tr>
                                <td>Launch Date</td>
                                <td style={{align:'left'}}>{selectedData.launch_date_utc}</td>
                            </tr>                   
                            <tr>
                                <td>Payload Type</td>
                                <td style={{align:'left'}}>{selectedData.rocket.rocket_type}</td>
                            </tr>                   
                            <tr>
                                <td>Orbit</td>
                                <td style={{align:'left'}}>{selectedData.rocket.second_stage.payloads[0].orbit}</td>
                            </tr>                   
                            <tr>
                                <td>Launch Site</td>
                                <td style={{align:'left'}}>{selectedData.launch_site.site_name}</td>
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