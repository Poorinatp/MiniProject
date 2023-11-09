import "./Ordermanage.css"
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import NavBar from "../components/NavBar";

const Ordermanage = ({ apihost }) => {
  const username = JSON.parse(sessionStorage.getItem('userData'));
  const [myDesignList, setMyDesignList] = useState([]);
  const [activeTab, setActiveTab] = useState('myDesigns');
  const [currentDesignPage, setCurrentDesignPage] = useState(1);
  const [myOrders,setMyOrders] = useState([]);
  const [mySizeOrders,setMySizeOrders] = useState([]);
  const [myPaymentList, setMyPaymentList] = useState([]);
  const [itemNumber, setItemNumber] = useState({
    firstNumber:1,
    secondNumber:5
  });
  const [paymentStatus, setPaymentStatus] = useState("ชำระเสร็จสิ้น");

  const isMobile = window.innerWidth < 767;
  const itemsPerPage = isMobile ? 4 : 8;

  const displayedDesignItems = myDesignList.slice(
    (currentDesignPage - 1) * itemsPerPage,
    currentDesignPage * itemsPerPage
  );
  const displayedOrders= myOrders.slice(
    (currentDesignPage - 1) * itemsPerPage,
    currentDesignPage * itemsPerPage
  );
  const displayedPayment = myPaymentList.slice(
    (currentDesignPage - 1) * itemsPerPage,
    currentDesignPage * itemsPerPage
  );

  const navigate = useNavigate();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
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

  const renderDesignPageNumbers = renderPageNumbers(
    currentDesignPage,
    setCurrentDesignPage,
    Math.ceil(myDesignList.length / itemsPerPage)
  );

  const renderOrderPageNumbers = renderPageNumbers(
    currentDesignPage,
    setCurrentDesignPage,
    Math.ceil(myOrders.length / itemsPerPage)
  );

  const renderPaymentPageNumbers = renderPageNumbers(
    currentDesignPage,
    setCurrentDesignPage,
    Math.ceil(myPaymentList.length / itemsPerPage)
  );

  useEffect(() => {
    if (!sessionStorage.getItem('userData')) {
      navigate('/signin');
    }
    Axios.get(`${apihost}/user/product/` + username.user_id)
      .then((response) => {
        setMyDesignList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    Axios.post(`${apihost}/allorders`, {numberItem:itemNumber})
      .then((response) => {
        setMyOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    Axios.post(`${apihost}/user/order/admin`, { status: paymentStatus })
      .then((response) => {
        setMyPaymentList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    Axios.get(`${apihost}/allorderssize`)
      .then((response) => {
        setMySizeOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [apihost, navigate]);


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
  

  const handleChangeItemNumber = (e) => {
    const newNumberItem = {
      ...itemNumber,
      [e.target.name]:e.target.value
    }
    setItemNumber(newNumberItem)
    Axios.post(`${apihost}/allorders`, {numberItem:newNumberItem})
      .then((response) => {
        setMyOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

  const handleChangeStatus = (e) => {
    const newStatus = e.target.value
    setPaymentStatus(newStatus)
    Axios.post(`${apihost}/user/order/admin`, {  status:newStatus })
      .then((response) => {
        setMyPaymentList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

  return (
    <>
      <NavBar />
      <main>
        <section className='design-container'>
          <nav className="design-menu">
            <p
              className='design-menu-option'
              style={{
                color: activeTab === 'myDesigns' ? "rgb(56, 158, 136)" : "black",
                backgroundColor: activeTab === 'myDesigns' && "white"
              }}
              onClick={() => handleTabClick('myDesigns')}
            >
              Design
            </p>
            <p
              className='design-menu-option'
              style={{
                color: activeTab === 'myOrders' ? "rgb(56, 158, 136)" : "black",
                backgroundColor: activeTab === 'myOrders' && "white"
              }}
              onClick={() => handleTabClick('myOrders')}
          
            >
              Order
            </p>
            <p
              className='design-menu-option'
              style={{
                color: activeTab === 'myPayments' ? "rgb(56, 158, 136)" : "black",
                backgroundColor: activeTab === 'myPayments' && "white"
              }}
              onClick={() => handleTabClick('myPayments')}
          
            >
              Payment
            </p>
          </nav>
          <section className="contents">
            <div className="pagination">
              {
              activeTab === 'myDesigns' ? renderDesignPageNumbers : 
              activeTab === 'myOrders' ? renderOrderPageNumbers :
              activeTab === 'myPayments' && renderPaymentPageNumbers
              }
            </div>
            {activeTab === 'myDesigns' && (
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
            {activeTab === 'myOrders' && (
              <>
              <div className="table">
                <div 
                  className="table-header"
                  style={{
                    gridTemplateColumns:"repeat(2,1fr)"
                  }}>
                  <p>Size</p>
                  <p>Total_Item</p>
                </div>
                <div className="table-body">
                {mySizeOrders.map((order, key) => {
                  return (
                    <div 
                    className="table-row"
                    style={{
                      gridTemplateColumns:"repeat(2,1fr)"
                    }}
                    key={key}>
                      <p>{order.Size}</p>
                      <p>{order.COUNT_Size}</p>
                    </div>
                  );
                })}
                </div>
              </div>
              <div className="filter">
              <label>จำนวน item: </label>
              <input
                type="number"
                name="firstNumber"
                value={itemNumber.firstNumber}
                onChange={(e)=>handleChangeItemNumber(e)}
              />
              <label> ถึง </label>
              <input
                type="number"
                name="secondNumber"
                value={itemNumber.secondNumber}
                onChange={(e)=>handleChangeItemNumber(e)}
              />
              <label> จำนวน order: {myOrders.length}</label>
              </div>
              <div className="table">
                <div 
                  className="table-header"
                  style={{
                    gridTemplateColumns:"repeat(2,1fr)"
                  }}>
                  <p>Order_id</p>
                  <p>Total_Item</p>
                </div>
                <div className="table-body">
                {displayedOrders.map((order, key) => {
                  return (
                    <div 
                    className="table-row"
                    style={{
                      gridTemplateColumns:"repeat(2,1fr)"
                    }}
                    key={key}>
                      <p>{order.Order_id}</p>
                      <p>{order.Total_Item}</p>
                    </div>
                  );
                })}
                </div>
              </div>
              </>
            )}
            {activeTab === 'myPayments' && (
              <>
              <select value={paymentStatus} onChange={(e)=>handleChangeStatus(e)}>
                 <option value="ชำระเสร็จสิ้น">ชำระเสร็จสิ้น</option>
                 <option value="ยังไม่ชำระเงิน">ยังไม่ชำระเงิน</option>
              </select>
              <div className="table">
                <div 
                className="table-header"
                style={{
                  gridTemplateColumns:"repeat(4,1fr)"
                }}>
                  <p>User_id</p>
                  <p>Order_id</p>
                  <p>Amount</p>
                  <p>Status</p>
                </div>
                <div className="table-body">
                {displayedPayment.map((payment, key) => {
                  return (
                    <div 
                    className="table-row"
                    style={{
                      gridTemplateColumns:"repeat(4,1fr)"
                    }}
                    key={key}>
                      <p>{payment.User_id}</p>
                      <p>{payment.Order_id}</p>
                      <p>{payment.Amount}</p>
                      <p>{payment.status}</p>
                    </div>
                  );
                })}
                </div>
              </div>
              </>
            )}
          </section>
        </section>
      </main>
    </>
  );
}

export default Ordermanage;
