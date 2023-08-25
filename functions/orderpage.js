let cartItems = []; // Array to store the cart items
let cartTotal = 0; // Variable to store the cart total

// Function to display the cart items
const displayCartItems = () => {
    const cartList = $('#cartList');
    cartList.empty(); // Clear previous cart items
  
    cartItems.forEach((item) => {
      const totalPrice = item.product.price * item.count; // Calculate the total price for each item
  
      cartList.append(`
        <li>
          <span>${item.product.title.toUpperCase()} - [${item.count}]</span>
          <span>${totalPrice.toFixed(2)}</span>
        </li>
      `);
    });
  
    calculateCartTotal(); // Calculate the cart total
  };
  
  
// Function to calculate the cart total
const calculateCartTotal = () => {
  const cartTotalElement = $('#cartTotal');
  cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.count, 0); // Calculate the cart total
  cartTotalElement.text(`Cart Total: $${cartTotal.toFixed(2)}`);
};

// Function to apply a coupon
const applyCoupon = () => {
    const coupon = $('#couponCode').val();
    const token = JSON.parse(localStorage.getItem('user'))?.token;
  
  
    if (coupon) {
      $.ajax({
        url: 'http://localhost:5008/api/user/cart/applycoupon',
        method: 'POST',
        data: { coupon },
        headers: {
          Authorization: `Bearer ${token}`
        },
        success: function(response) {
          console.log('Coupon applied:', response);
          if (response) {
            cartTotal = parseFloat(response); // Update the cart total value
            $('#cartTotal').text(cartTotal.toFixed(2)); // Update the cart total display
            $('#couponCode').val(''); // Clear the coupon code input
            displayFloatingMessage('Coupon applied successfully!', 'success'); // Display success message
          }
        },
        error: function(error) {
          console.error('Error applying coupon:', error.responseText);
          displayFloatingMessage('Failed to apply coupon!', 'error'); // Display error message
        }
      });
    }
  };
  

  
  // Event listener for applying a coupon
  $(document).on('click', '#applyCouponBtn', applyCoupon);
  

// Function to fetch available coupons
const fetchCoupons = () => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  $.ajax({
    url: 'http://localhost:5008/api/coupon',
    type: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(response) {
      console.log('Available Coupons:', response);
      displayCoupons(response); // Pass the coupons to the displayCoupons function
    },
    error: function(error) {
      console.error('Error fetching coupons:', error.responseText);
      // Handle error case
    }
  });
};

// Function to display available coupons
const displayCoupons = (coupons) => {
  const couponList = $('#couponList');
  couponList.empty(); // Clear previous coupon list

  if (coupons && coupons.length > 0) {
    coupons.forEach(coupon => {
      couponList.append(`
        <li>${coupon.name} - ${coupon.discount}% off</li>
      `);
    });
  } else {
    couponList.append(`<li>No coupons available</li>`);
  }
};

// Function to fetch user information
const fetchUserInfo = () => {
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const userEmail = JSON.parse(localStorage.getItem('user')).email;
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  $.ajax({
    url: `http://localhost:5008/api/user/${userId}`,
    type: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(response) {
      console.log('User Info:', response);
      displayUserInfo(response.getaUser, userEmail);
    },
    error: function(error) {
      console.error('Error fetching user information:', error.responseText);
      // Handle error case
    }
  });
};


// Function to display user information
const displayUserInfo = (userInfo, userEmail) => {
  const userInfoElement = $('#userInfo');
  userInfoElement.empty();

  userInfoElement.append(`
    <p>Email: ${userEmail}</p>
    <p>Mobile: ${userInfo.mobile}</p>
    <p>Address: ${userInfo.address}</p>
  `);
};

// Fetch user cart on page load
const token = JSON.parse(localStorage.getItem('user'))?.token;
$.ajax({
  url: 'http://localhost:5008/api/user/cart',
  type: 'GET',
  dataType: 'json',
  headers: {
    Authorization: `Bearer ${token}`
  },
  success: function(response) {
    if (response && response.products && response.products.length > 0) {
      cartItems = response.products;
      displayCartItems();
    }
  },
  error: function(error) {
    console.error(error);
  }
});
// Event listener for edit address button
$('#editAddressBtn').click(function() {
  $('#editAddressBox').show(); // Show the edit address box
});

// Function to update the address
const updateAddress = () => {
  const address = $('#addressInput').val();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  $.ajax({
    url: 'http://localhost:5008/api/user/save-address',
    type: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: JSON.stringify({
      address: address
    }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Address updated:', response);
      displaySuccessMessage('Address updated successfully!');
      hideUpdateAddressSection(); // Hide the update address section
      fetchUserInfo(); // Fetch and display updated user information
    },
    error: function(error) {
      console.error('Error updating address:', error.responseText);
      displayErrorMessage('Failed to update address!');
    }
  });
};

// Function to hide the update address section
const hideUpdateAddressSection = () => {
  const updateAddressSection = $('.update-address-section');
  updateAddressSection.hide();
};

// Function to display the success message
const displaySuccessMessage = (message) => {
  const floatingMessage = $('#floatingMessage');
  floatingMessage.removeClass('error').addClass('success').text(message);
  floatingMessage.show();

  // Hide the message after 3 seconds
  setTimeout(() => {
    floatingMessage.hide();
  }, 3000);
};

// Event listener for update address button
$('#updateAddressBtn').click(updateAddress);
// Function to show the update address section
const showUpdateAddressSection = () => {
  $('.update-address-section').show();
};

// Event listener for edit address button
$('#editAddressBtn').click(showUpdateAddressSection);


// Fetch available coupons on page load
fetchCoupons();

// Function to redirect user to the user cart
const redirectToUserCart = () => {
  window.location.href = 'cart.html';
};


// Function to empty the cart
const emptyCart = () => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  $.ajax({
    url: 'http://localhost:5008/api/user/empty-cart',
    type: 'DELETE',
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(response) {
      console.log('Cart emptied:', response);
      cartItems = []; // Clear the cart items array
      displayCartItems(); // Display the updated cart items (empty)
    },
    error: function(error) {
      console.error('Error emptying cart:', error.responseText);
      // Handle error case
    }
  });
};

// Event listener for edit cart button
$('#editCartBtn').click(redirectToUserCart);

// Event listener for continue shopping button
$('#continueShoppingBtn').click(() => {
  window.location.href = '../index.html';
});

$(document).ready(function() {
// Event listener for edit cart button
$('#editCartBtn').on('click', redirectToUserCart);


// Function to display the order placed message
const displayOrderPlacedMessage = () => {
    const floatingMessage = $('#floatingMessage');
    floatingMessage.text(' ORDER PLACED  , ');
    floatingMessage.addClass('show');
  

    const continueShoppingBtn = $('<button>').addClass('btn btn-success continue-shopping-btn').text('CONTINUE SHOPPING');
    continueShoppingBtn.on('click', () => {
      window.location.href = '../index.html';
    });
  
    floatingMessage.append(continueShoppingBtn);
  };
  
  // Event listener for checkout button
  $('#checkoutBtn').on('click', function() {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
  
    $.ajax({
      url: 'http://localhost:5008/api/user/cart/cash-order',
      type: 'POST',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        COD: true,
        couponApplied: false
      },
      success: function(response) {
        console.log('Order placed:', response);
        displayOrderPlacedMessage(); // Display the order placed message
        emptyCart(); // Empty the cart
      },
      error: function(error) {
        console.error('Error placing order:', error.responseText);
        // Handle error case
      }
    });
  });
  
});


// Fetch user information on page load
fetchUserInfo();
