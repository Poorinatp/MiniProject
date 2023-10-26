import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Profile.css';
import NavBar from '../components/NavBar';

function Profile() {
  const [userList, setUserList] = useState([]);
  const [myDesignList, setmyDesignList] = useState([]);
  const [myHistory, setmyHistory] = useState([]);
  const username =  JSON.parse(sessionStorage.getItem('userData'));
  const [activeTab, setActiveTab] = useState('mydesign'); 
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Make the Axios GET request
    if (!sessionStorage.getItem('userData')){
      navigate('/signin');
    }
    Axios.get('http://localhost:8080/profile/'+ username.user_id)
      .then((response) => {
        setUserList(response.data[0]);
        console.log(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

      Axios.get('http://localhost:8080/user/orders/'+ username.user_id)
      .then((response) => {
        setmyHistory(response.data);
        setmyDesignList(response.data);

        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserList(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const handleEditClick = () => {
    setEditMode(true);
  }
  
  const handleSaveClick = () => {
    Axios.put('http://localhost:8080/user'+ userList.User_id, userList)
      .then(response => {
        console.log(response);
        setEditMode(false);
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <>
    <NavBar/> 
    <main className="author">
      
        {userList &&(
            <article>
              {editMode ? (
            <div>
              <label>First Name:</label>
              <input type="text" name="fname" value={userList.Firstname} onChange={handleInputChange} />
              <br />
              <label>Last Name:</label>
              <input type="text" name="lname" value={userList.Lastname} onChange={handleInputChange} />
              <br />
              <label>Address:</label>
              <input type="text" name="address" value={userList.Address} onChange={handleInputChange} />
              <br />
              <label>Phone:</label>
              <input type="text" name="phone" value={userList.Telephone} onChange={handleInputChange} />
              <br />
              <label>Zipcode:</label>
              <input type="text" name="zipcode" value={userList.Zipcode} onChange={handleInputChange} />
              <br />
              <input type="text" name="country" value={userList.Country} onChange={handleInputChange} />
              <br />
              <button className='CancelButton' onClick={handleCancelClick}>Cancel</button>
              <button onClick={handleSaveClick}>Save</button>
            </div>
          ) : 
          <article className="card-body-name" >
              <p >ID: {userList.User_id}</p>
              <p>Name: {userList.Firstname} {userList.Lastname}</p>
              <p>Email: {userList.Email}</p>
              <button onClick={handleEditClick}>Edit</button>
            </article>
            } 
            </article>
        )}
      


      <section>
        <ul className="menu">
          <li><a
            id="menu-P"
            className={activeTab === 'mydesign' ? 'active' : ''}
            onClick={() => handleTabClick('mydesign')}
          >
          Design
          </a></li>
          <li><a
            id="menu-P"
            className={activeTab === 'myhistory' ? 'active' : ''}
            onClick={() => handleTabClick('myhistory')}
          >
          History
          </a></li>
        </ul>

        <section className="Design-card" id="mydesign">
          {activeTab === 'mydesign' && (
            <p className="tab-pane-design" >
              {myDesignList.map((myDesign, key) => {
                return (
                  <article className="card-body" key={key}>
                    <img id="img-design" src={"/shirt-design/"+myDesign.product_image} alt="myDesign" />
                    <p id="data-his">Detail: {myDesign.Description}</p>
                  </article>
                );
              })}
            </p>
          )}

          {activeTab === 'myhistory' && (
                      <p className="tab-pane-history" >
                        {myHistory.map((myHistory, key) => {
                          return (
                            <article className="card-body" key={key}>
                              <img id="img-his" src={myHistory.product_image} alt="myDesign" />
                              <p id="data-his">Order_id: {myHistory.Order_id}</p>
                              <p id="data-his">Detail: {myHistory.Description}</p>
                              <p id="data-his">
                                Color: {myHistory.Color}
                                <br />
                                Size: {myHistory.Size}
                                <br />
                                Total: {myHistory.Total_Item}
                                <br />
                                Price: {myHistory.Amount} บาท
                              </p>
                            </article>
                          );
                        })}
                      </p>
                    )}
        </section>
      </section>
    </main>
    </>
  );
}


export default Profile;
