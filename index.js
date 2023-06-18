import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  cartItems: [],
  totalQuantity: 0,
};
const cartSlice = createSlice({
  name: "store",
  initialState: initialCartState,
  reducers: {
    replaceCart(state, action) {
      state.cartItems = action.payload.items;
      state.totalQuantity = action.payload.updatedQuantity;
    },
    addItemToCart(state, action) {
      const existingCartItemIndex = state.cartItems.findIndex(
        (product) => product.title === action.payload.item.title
      );

      const existingItem = state.cartItems[existingCartItemIndex];

      let updatedItems;
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };

        updatedItems = [...state.cartItems];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.cartItems.concat({ ...action.payload.item });
      }
      state.cartItems = updatedItems;
      state.totalQuantity += 1;
    },

    removeItemFromCart(state, action) {
      const existingCartItemIndex = state.cartItems.findIndex(
        (product) => product.id === action.payload.id
      );

      const existingItem = state.cartItems[existingCartItemIndex];

      let updatedItems;
      if (existingItem.quantity > 1) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity - 1,
        };

        updatedItems = [...state.cartItems];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
      }

      state.cartItems = updatedItems;
      state.totalQuantity -= 1;
    },
  },
});

const initialUiState = {
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    showNotification(state, action) {
        state.notification = {
            status: action.payload.status,
            title: action.payload.title,
            message: action.payload.message,
          };
    },
  },
});

const store = configureStore({
  reducer: { cart: cartSlice.reducer, ui: uiSlice.reducer },
});

export const cartActions = cartSlice.actions;
export const uiActions = uiSlice.actions;

export default store;
