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
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });

    Axios.get(`${apihost}/user/product/`+ username.user_id)
    .then((response) => {
      setmyDesignList(response.data);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });

    Axios.get(`${apihost}/user/orders/`+ username.user_id)
    .then((response) => {
      setmyHistory(response.data);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }, [apihost,navigate,username.user_id]);

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
        setEditMode(false);
      })
      .catch(error => {
        console.log(error);
      });
  }


  return (
    <>
    <NavBar/> 
    <div className="profile">
        {userList &&(
            <div className='profile-container'>
              {editMode ? (
              <div className="profile-contents">
                <p className='profile-contents-name'>First Name:</p>
                <input className='profile-contents-value' type="text" name="Firstname" value={userList.Firstname} onChange={handleInputChange} />
                <p className='profile-contents-name'>Last Name:</p>
                <input className='profile-contents-value' type="text" name="Lastname" value={userList.Lastname} onChange={handleInputChange} />
                <p className='profile-contents-name'>Address:</p>
                <input className='profile-contents-value' type="text" name="Address" value={userList.Address} onChange={handleInputChange} />
                <p className='profile-contents-name'>Phone:</p>
                <input className='profile-contents-value' type="tel" name="Telephone" value={userList.Telephone} onChange={handleInputChange} />
                <p className='profile-contents-name'>Zipcode:</p>
                <input className='profile-contents-value' type="text" name="Zipcode" value={userList.Zipcode} onChange={handleInputChange} />
                <p className='profile-contents-name'>Country:</p>
                <input className='profile-contents-value' type="text" name="Country" value={userList.Country} onChange={handleInputChange} />
                <button onClick={handleCancelClick}>Cancel</button>
                <button onClick={handleSaveClick}>Save</button>
              </div>
              ) : 
              <div className='profile-contents'>
                  <p className='profile-contents-name'>ID:</p>
                  <p className='profile-contents-value'>{userList.User_id}</p>
                  <p className='profile-contents-name'>Name:</p>
                  <p className='profile-contents-value'>{userList.Firstname} {userList.Lastname}</p>
                  <p className='profile-contents-name'>Email:</p>
                  <p className='profile-contents-value'>{userList.Email}</p>
                  <button onClick={handleEditClick}>Edit</button>
              </div>
            } 
          </div>
        )}
      


      <div className='design-container'>
        <div className="design-menu">
          <p
            className='design-menu-option'
            style={{
              color:activeTab==='mydesign'?"rgb(56, 158, 136)":"black",
              backgroundColor:activeTab==='mydesign'&&"white"
            }}
            onClick={() => handleTabClick('mydesign')}
          >
          Design
          </p>
          <p
            style={{
              color:activeTab==='mydesign'?"black":"rgb(56, 158, 136)",
              backgroundColor:activeTab!=='mydesign'&&"white"
            }}
            className='design-menu-option'
            onClick={() => handleTabClick('myhistory')}
          >
          History
          </p>
        </div>

        <div className="contents">
          {activeTab === 'mydesign' && (
            <div className="card-contents" >
              {myDesignList.map((myDesignList, key) => {
                const createdDate = myDesignList.Created_at.split("T")[0]; 
                return (
                  <div className="card-body" key={key}>
                    <img src={myDesignList.product_image} alt="myDesign" />
                    <p>Created_at: {createdDate}</p>
                    <p>Product_id: {myDesignList.Product_id}</p>
                    <div className='btn-group'>
                      <FontAwesomeIcon
                        className='icon-btn'
                        icon={faPen}
                        onClick={() => handleEditProduct(myDesignList.Product_id)}
                      />
                      <FontAwesomeIcon
                      className='icon-btn'
                      icon={faTrash}
                      onClick={() => handleDelete(myDesignList.Product_id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'myhistory' && (
            <div className="card-contents" >
              {myHistory.map((myHistory, key) => {
                return (
                  <div className="card-body" key={key}>
                    <img src={myHistory.product_image} alt='img-his'/>
                    <p>Order_id: {myHistory.Order_id}</p>
                    <p>Detail: {myHistory.Description}</p>
                    <p>
                      Color: {myHistory.Color}
                      <br />
                      Size: {myHistory.Size}
                      <br />
                      Total: {myHistory.Total_Item}
                      <br />
                      Price: {myHistory.Amount} บาท
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}


export default Profile;
