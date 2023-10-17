import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Profile.css';
import NavBar from '../components/NavBar';

function Profile() {
  const [userList, setUserList] = useState([]);
  const [myDesignList, setmyDesignList] = useState([]);
  const [myHistory, setmyHistory] = useState([]);
  const username = ['Poomy5555@hotmail.com', 60010];
  const email = username[0];
  const userId = username[1];
  const [activeTab, setActiveTab] = useState('mydesign'); // Default active tab
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Make the Axios GET request
    Axios.get('http://localhost:8080/user')
      .then((response) => {
        const filteredUser = response.data.filter((user) => user.Email === email);
        setUserList(filteredUser);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    Axios.get('http://localhost:8080/user/orders')
      .then((response) => {
        const filteredOrders = response.data.filter((product) => product.User_id === userId);
        setmyHistory(filteredOrders);
        setmyDesignList(filteredOrders);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  
  return (
    <>
    <NavBar/> 
    <main className="author">
      <article className="author-card">
        {userList.map((userdata, key) => {
          return (
            <article className="card-body-name" key={key}>
              <p>ID: {userdata.User_id}</p>
              <p>Name: {userdata.Firstname} {userdata.Lastname}</p>
              <p>Email: {userdata.Email}</p>
            </article>
          );
        })}
        <button>Edit</button>
      </article>

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
            <p class="tab-pane-design" >
              {myDesignList.map((myDesign, key) => {
                return (
                  <article className="card-body" key={key}>
                    <img id="img-design" src={myDesign.product_image} alt="myDesign" />
                    <p id="data-his">Detail: {myDesign.Description}</p>
                  </article>
                );
              })}
            </p>
          )}

          {activeTab === 'myhistory' && (
                      <p class="tab-pane-history" >
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
