import React, { useEffect, useState } from "react";
import Cart from "./components/cart/cart";
import Layout from "./components/layout/layout";
import Products from "./components/shop/products";
import Notification from "./components/ui/notification";
import { useDispatch, useSelector } from "react-redux";
import { cartActions, uiActions } from "./components/store";


let isInitial = true;

function App() {
  const [cart, setCart] = useState(false);
  const showCart = () => {
    setCart((prev) => !prev);
  };

  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  const newCart = useSelector((state) => state.cart);

  useEffect(() => {
    const sendingData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data",
        })
      );
      let response = await fetch(
        "https://e-commerce-website-60ee5-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(newCart),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("sending cart data failed!");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Succes",
          message: "Sent cart data successfully",
        })
      );
    };

    if(isInitial){
      isInitial = false;
      return;
    }

    sendingData().catch((err) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Sending cart data failed",
        })
      );
    });
  }, [newCart, dispatch]);


  window.onload=async()=>{
    try{
    let response = await fetch("https://e-commerce-website-60ee5-default-rtdb.firebaseio.com/cart.json", {
      method : 'GET',
    })

    if(!response.ok){
      throw new Error('retriving data from backend failed')
    }
    let responseData = await response.json();
    console.log(responseData);

    dispatch(cartActions.replaceCart({items : responseData.cartItems, updatedQuantity : responseData.totalQuantity}));

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: "Succes",
        message: "Sent cart data successfully",
      })
    );
    }
  catch(err){
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Sending cart data failed",
        })
      );
    }
  }


  return (
    <React.Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout showCart={showCart}>
        {cart && <Cart />}
        <Products />
      </Layout>
    </React.Fragment>
  );
}

export default App;
