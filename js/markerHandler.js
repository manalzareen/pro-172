var tableNumber = null;

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    
    if (orderNumber === null) {
      this.askUserId();
    }
    var toys = await this.getToys();

    this.el.addEventListener("markerFound", () => {
      if (orderNumber !== null) {
        var markerId = this.el.id;
        this.handleMarkerFound(toys, markerId);
      }
    });
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },
  askUserId: function () {
    swal({
      title: "Welcome to the Toys World!!",
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your order number",
          type: "number",
          min: 1
        }
      },
      closeOnClickOutside: false,
    }).then(inputValue => {
      orderNumber = inputValue;
    });
  },

  handleMarkerFound: function (toys, markerId) {
   
    var toy = toys.filter(toy => toy.id === markerId)[0];
    if (toy.is_out_of_stock) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is out of stock",
        timer: 2500,
        buttons: false
      });
    } 
    
    else {
     
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

  
      model.setAttribute("visible", true);

      var ingredientsContainer = document.querySelector(`#main-plane-${toy.id}`);
      ingredientsContainer.setAttribute("visible", true);

      var priceplane = document.querySelector(`#price-plane-${toy.id}`);
      priceplane.setAttribute("visible", true)

      //Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");

      if (orderNumber != null) {
        //Handling Click Events
        ratingButton.addEventListener("click", function () {
          swal({
            icon: "warning",
            title: "Rate Dish",
            text: "Work In Progress"
          });
        });

        // c171 code 
        orderButtton.addEventListener("click", () => {
          var tNumber;
          tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : ( tNumber = `T${tableNumber}` ) ;
          this.handleOrder(uid,toy);

          swal({
            icon: "https://i.imgur.com/4NZ6uLY.jpg",
            title: "Thanks For Order !",
            text: "Your order will be soon delviered!",
            timer: 2000,
            buttons: false
          });
        });
      }
    }
  },
  handleOrder: function (uid,toy) {  
    firebase
      .firestore()
      .collection("toys")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data();
     
        if (details["current_orders"][toy.id]) {
          
          details["current_orders"][toy.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_orders"][dish.id]["quantity"];

          details["current_orders"][toy.id]["subtotal"] =
            currentQuantity * toy.price;
        } 
        else {
          details["current_orders"][toy.id] = {
            item: toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toy.price * 1
          };
        }

        details.total_bill += toy.price;
        firebase
          .firestore()
          .collection("toys")
          .doc(doc.id)
          .update(details);
      });
  },
  //Function to get the dishes collection from db
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },
  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }
});