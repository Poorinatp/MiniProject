import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Profile.css';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

const Profile = ({ apihost }) => {
  const [userList, setUserList] = useState([]);
  const [myDesignList, setmyDesignList] = useState([]);
  const [myHistory, setmyHistory] = useState([]);
  const username = JSON.parse(sessionStorage.getItem('userData'));
  const [activeTab, setActiveTab] = useState('mydesign');
  const [editMode, setEditMode] = useState(false);
  const [currentDesignPage, setCurrentDesignPage] = useState(1);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);

  const isMobile = window.innerWidth < 767;
  const itemsPerPage = isMobile ? 4 : 8;

  const displayedDesignItems = myDesignList.slice(
    (currentDesignPage - 1) * itemsPerPage,
    currentDesignPage * itemsPerPage
  );

  const displayedHistoryItems = myHistory.slice(
    (currentHistoryPage - 1) * itemsPerPage,
    currentHistoryPage * itemsPerPage
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Make the Axios GET request
    if (!sessionStorage.getItem('userData')) {
      navigate('/signin');
    }
    Axios.get(`${apihost}/profile/` + username.user_id)
      .then((response) => {
        setUserList(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    Axios.get(`${apihost}/user/product/` + username.user_id)
      .then((response) => {
        setmyDesignList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    Axios.get(`${apihost}/user/orders/` + username.user_id)
      .then((response) => {
        setmyHistory(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [apihost, navigate, username.user_id]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserList((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleCancelClick = () => {
    setEditMode(false);
  };

  const renderDesignPageNumbers = renderPageNumbers(
    currentDesignPage,
    setCurrentDesignPage,
    Math.ceil(myDesignList.length / itemsPerPage)
  );

  const renderHistoryPageNumbers = renderPageNumbers(
    currentHistoryPage,
    setCurrentHistoryPage,
    Math.ceil(myHistory.length / itemsPerPage)
  );

  const handleDelete = (product_id) => {
    Axios.delete(`${apihost}/delete/${product_id}`);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setmyDesignList((prevList) =>
          prevList.filter((item) => item.Product_id !== product_id)
        );
        Swal.fire({
          position: 'bottom-end',
          title: 'Your file has been deleted.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleEditProduct = (product_id) => {
    navigate(`/design/${product_id}`);
  };

  function handleSaveClick() {
    Axios.put(`${apihost}/update/` + userList.User_id, userList);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        setEditMode(false);
        Swal.fire({
          position: 'bottom-end',
          title: 'Your edited has been saved.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  function renderPageNumbers(
    currentPage,
    setCurrentPage,
    totalPages
  ) {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return pageNumbers.map((number) => (
      <button
        key={number}
        className={currentPage === number ? 'active' : ''}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </button>
    ));
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
                <section className='btn-group'>
                <button onClick={handleCancelClick}>Cancel</button>
                <button onClick={handleSaveClick}>Save</button>
                </section>
              </article>
              ) : 
              <article className='profile-contents'>
                  <p className='profile-contents-name'>ID:</p>
                  <p className='profile-contents-value'>{userList.User_id}</p>
                  <p className='profile-contents-name'>Name:</p>
                  <p className='profile-contents-value'>{userList.Firstname} {userList.Lastname}</p>
                  <p className='profile-contents-name'>Email:</p>
                  <p className='profile-contents-value'>{userList.Email}</p>
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
                color: activeTab === 'mydesign' ? "rgb(56, 158, 136)" : "black",
                backgroundColor: activeTab === 'mydesign' && "white"
              }}
              onClick={() => handleTabClick('mydesign')}
            >
              Design
            </p>
            <p
              style={{
                color: activeTab === 'mydesign' ? "black" : "rgb(56, 158, 136)",
                backgroundColor: activeTab !== 'mydesign' && "white"
              }}
              className='design-menu-option'
              onClick={() => handleTabClick('myhistory')}
            >
              History
            </p>
          </nav>
          <section className="contents">
            {activeTab === 'mydesign' && (
              <article className="card-contents">
                {displayedDesignItems.map((design, key) => {
                  const createdDate = design.Created_at.split("T")[0];
                  return (
                    <section className="card-body" key={key}>
                      <img src={design.product_image} alt="myDesign" />
                      <p>Created_at: {createdDate}</p>
                      <p>Product_id: {design.Product_id}</p>
                      <article className='btn-group'>
                        <FontAwesomeIcon
                          className='icon-btn'
                          size='2xs'
                          icon={faPen}
                          onClick={() => handleEditProduct(design.Product_id)}
                        />
                        <FontAwesomeIcon
                          className='icon-btn'
                          size='2xs'
                          icon={faTrash}
                          onClick={() => handleDelete(design.Product_id)}
                        />
                      </article>
                    </section>
                  );
                })}
              </article>
            )}
            {activeTab === 'myhistory' && (
              <article className="card-contents">
                {displayedHistoryItems.map((history, key) => {
                  return (
                    <section className="card-body" key={key}>
                      <img src={history.product_image} alt='img-his' />
                      <p>Order_id: {history.Order_id}</p>
                      <p>Detail: {history.Description}</p>
                      <p>
                        Color: {history.Color}
                        <br />
                        Size: {history.Size}
                        <br />
                        Total: {history.Total_Item}
                        <br />
                        Price: {history.Amount} บาท
                      </p>
                    </section>
                  );
                })}
              </article>
            )}
          </section>
          <div className="pagination">
            {activeTab === 'mydesign' ? renderDesignPageNumbers : renderHistoryPageNumbers}
          </div>
        </section>


    </main>
    <Footer/>
    </>
  );
}
export default Profile;
