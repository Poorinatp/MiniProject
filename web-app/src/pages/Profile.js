import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Profile.css';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faPen } from '@fortawesome/free-solid-svg-icons';

const Profile = ({apihost}) => {
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
    Axios.get(`${apihost}/profile/`+ username.user_id)
      .then((response) => {
        setUserList(response.data[0]);
        console.log(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

      Axios.get(`${apihost}/user/product/`+ username.user_id)
      .then((response) => {
        setmyHistory(response.data);
        setmyDesignList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

      Axios.get(`${apihost}/user/orders/`+ username.user_id)
      .then((response) => {
        setmyHistory(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  
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
  const handleCancelClick = () => {
    setEditMode(false);
  }
  const handleDelete = (product_id) => {
    Axios.delete(`${apihost}/delete/${product_id}`)
      .then(() => {
        // Filter out the deleted product from myDesignList
        setmyDesignList((prevList) => prevList.filter((item) => item.Product_id !== product_id));
        alert('Product Deleted!');
      })
      .catch((error) => {
        console.error('Error deleting product_detail:', error);
      });
  };
  
  const handleEditProduct = (product_id) => {
    navigate(`/design/${product_id}`)
  };
    
  function handleSaveClick() {
    Axios.put(`${apihost}/update/` + userList.User_id, userList)
      .then(response => {
        console.log(response.data.messege);
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
              <input type="text" name="Firstname" value={userList.Firstname} onChange={handleInputChange} />
              <br />
              <label>Last Name:</label>
              <input type="text" name="Lastname" value={userList.Lastname} onChange={handleInputChange} />
              <br />
              <label>Address:</label>
              <input type="text" name="Address" value={userList.Address} onChange={handleInputChange} />
              <br />
              <label>Phone:</label>
              <input type="tel" name="Telephone" value={userList.Telephone} onChange={handleInputChange} />
              <br />
              <label>Zipcode:</label>
              <input type="text" name="Zipcode" value={userList.Zipcode} onChange={handleInputChange} />
              <br />
              <label>Country:</label>
              <input type="text" name="Country" value={userList.Country} onChange={handleInputChange} />
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
              {myDesignList.map((myDesignList, key) => {
                const createdDate = myDesignList.Created_at.split("T")[0]; 
                return (
                  <article className="card-body" key={key}>
                    <img id="img-design" src={myDesignList.product_image} alt="myDesign" />
                    <p id="data-his">Created_at: {createdDate}</p>
                    <p id="data-his">Product_id: {myDesignList.Product_id}</p>
                    <button  className='editbtn' onClick={handleEditProduct}>
                      <FontAwesomeIcon icon={faPen} size='2xs' style={{color: "#254683",}} />
                    </button>
                    <button className='deletebtn' onClick={() => handleDelete(myDesignList.Product_id)}>
                      <FontAwesomeIcon icon={faTrash} size='2xs' style={{ color: '#254683 ' }} />
                    </button>

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
                              <img id="img-his" src={myHistory.product_image}/>
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
