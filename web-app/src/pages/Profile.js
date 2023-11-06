import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Profile.css';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
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
      console.log(response.data)
    })
    .catch((error) => {
      console.error('Error fetching user product data:', error);
    });

    Axios.get(`${apihost}/user/orders/`+ username.user_id)
    .then((response) => {
      setmyHistory(response.data);
    })
    .catch((error) => {
      console.error('Error fetching user order data:', error);
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setmyDesignList((prevList) => prevList.filter((item) => item.Product_id !== product_id));
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
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
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        setEditMode(false);
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
      .catch(error => {
        console.log(error);
      });
  }


  return (
    <>
    <NavBar/> 
    <main className="profile">
        {userList &&(
            <section className='profile-container'>
              {editMode ? (
              <article className="profile-contents">
                <p className='profile-contents-name'>First Name:</p>
                <input className='profile-contents-value' type="text" name="firstname" value={userList.firstname} onChange={e=>handleInputChange(e)} />
                <p className='profile-contents-name'>Last Name:</p>
                <input className='profile-contents-value' type="text" name="lastname" value={userList.lastname} onChange={e=>handleInputChange(e)} />
                <p className='profile-contents-name'>Address:</p>
                <input className='profile-contents-value' type="text" name="address" value={userList.address} onChange={e=>handleInputChange(e)} />
                <p className='profile-contents-name'>Phone:</p>
                <input className='profile-contents-value' type="tel" name="telephone" value={userList.telephone} onChange={e=>handleInputChange(e)} />
                <p className='profile-contents-name'>Zipcode:</p>
                <input className='profile-contents-value' type="text" name="zipcode" value={userList.zipcode} onChange={e=>handleInputChange(e)} />
                <p className='profile-contents-name'>City:</p>
                <input className='profile-contents-value' type="text" name="city" value={userList.city} onChange={e=>handleInputChange(e)} />
                <p className='profile-contents-name'>Country:</p>
                <input className='profile-contents-value' type="text" name="Country" value={userList.Country} onChange={handleInputChange} />
                <section className='btn-group'>
                <button onClick={handleCancelClick}>Cancel</button>
                <button onClick={handleSaveClick}>Save</button>
                </section>
              </article>
              ) : 
              <article className='profile-contents'>
                  <p className='profile-contents-name'>ID:</p>
                  <p className='profile-contents-value'>{userList.user_id}</p>
                  <p className='profile-contents-name'>Name:</p>
                  <p className='profile-contents-value'>{userList.firstname} {userList.lastname}</p>
                  <p className='profile-contents-name'>Email:</p>
                  <p className='profile-contents-value'>{userList.email}</p>
                  <button onClick={handleEditClick}>Edit</button>
              </article>
            } 
          </section>
        )}
      


      <section className='design-container'>
        <nav className="design-menu">
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
        </nav>

        <section className="contents">
          {activeTab === 'mydesign' && (
            <article className="card-contents" >
              {myDesignList.map((myDesignList, key) => {
                const createdDate = myDesignList.created_at.split("T")[0]; 
                return (
                  <section className="card-body" key={key}>
                    <img src={`${apihost}/web-app/public/${myDesignList.product_image}`} alt="myDesign" />
                    <p>Created_at: {createdDate}</p>
                    <p>Product_id: {myDesignList.Product_id}</p>
                    <article className='btn-group'>
                      <FontAwesomeIcon
                        className='icon-btn'
                        size='2xs'
                        icon={faPen}
                        onClick={() => handleEditProduct(myDesignList.product_id)}
                      />
                      <FontAwesomeIcon
                      className='icon-btn'
                      size='2xs'
                      icon={faTrash}
                      onClick={() => handleDelete(myDesignList.product_id)}
                      />
                    </article>
                  </section>
                );
              })}
            </article>
          )}

          {activeTab === 'myhistory' && (
            <article className="card-contents" >
              {myHistory.map((myHistory, key) => {
                return (
                  <section className="card-body" key={key}>
                    <img src={`${apihost}/web-app/public/${myHistory.product_image}`} alt='img-his'/>
                    <p>Order_id: {myHistory.order_id}</p>
                    <p>Detail: {myHistory.description}</p>
                    <p>
                      Color: {myHistory.color}
                      <br />
                      Size: {myHistory.size}
                      <br />
                      Total: {myHistory.total_Item}
                      <br />
                      Price: {myHistory.amount} บาท
                    </p>
                  </section>
                );
              })}
            </article>
          )}
        </section>
      </section>
    </main>
    </>
  );
}


export default Profile;
