import React, { useEffect, useState } from "react";
import NavBarAdmin from "../components/NavbarAdmin";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Ordermange = ({ apihost }) => {
  const username = JSON.parse(sessionStorage.getItem('userData'));
  const [myDesignList, setMyDesignList] = useState([]);
  const [activeTab, setActiveTab] = useState('mydesign');
  const [currentDesignPage, setCurrentDesignPage] = useState(1);

  const isMobile = window.innerWidth < 767;
  const itemsPerPage = isMobile ? 4 : 8;

  const displayedDesignItems = myDesignList.slice(
    (currentDesignPage - 1) * itemsPerPage,
    currentDesignPage * itemsPerPage
  );
  const navigate = useNavigate();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const renderDesignPageNumbers = renderPageNumbers(
    currentDesignPage,
    setCurrentDesignPage,
    Math.ceil(myDesignList.length / itemsPerPage)
  );

  useEffect(() => {
    if (!sessionStorage.getItem('userData')) {
      navigate('/signin');
    } 
    console.log(username)
    Axios.get(`${apihost}/user/product/` + username.user_id)
        .then((response) => {
          setMyDesignList(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
  }, [apihost, username.user_id, navigate]);

  const handleEditProduct = (product_id) => {
    navigate(`/design/${product_id}`);
  };

  const handleDelete = (product_id) => {
    Axios.delete(`${apihost}/delete/${product_id}`)
      .then(() => {
        setMyDesignList((prevList) =>
          prevList.filter((item) => item.Product_id !== product_id)
        );
        Swal.fire({
          position: 'bottom-end',
          title: 'Your file has been deleted.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        Swal.fire('An error occurred while deleting the product.', '', 'error');
      });
  };
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
      <NavBarAdmin />
      <main>
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
              Order
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
                          size='2x'
                          icon={faPen}
                          onClick={() => handleEditProduct(design.Product_id)}
                        />
                        <FontAwesomeIcon
                          className='icon-btn'
                          size='2x'
                          icon={faTrash}
                          onClick={() => handleDelete(design.Product_id)}
                        />
                      </article>
                    </section>
                  );
                })}
              </article>
            )}
          </section>
          <div className="pagination">
            {activeTab === 'mydesign' ? renderDesignPageNumbers : ''}
          </div>
        </section>
      </main>
    </>
  );
}

export default Ordermange;
