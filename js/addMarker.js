AFRAME.registerComponent("create-markers", {
  
    init: async function() {
      var mainScene = document.querySelector("#main-scene");
      var toys = await this.getToys();    
      toys.map(toy => {       
        var marker = document.createElement("a-marker");   
        marker.setAttribute("id", toy.id);
        marker.setAttribute("type", "pattern");
        marker.setAttribute("url", toy.marker_pattern_url);
        marker.setAttribute("cursor", {
          rayOrigin: "mouse"
        });
  
        marker.setAttribute("markerhandler", {});
        mainScene.appendChild(marker);
  
        var model = document.createElement("a-entity");    
        model.setAttribute("id", `model-${toy.id}`);
        model.setAttribute("position", toy.model_geometry.position);
        model.setAttribute("rotation", toy.model_geometry.rotation);
        model.setAttribute("scale", toy.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${toy.model_url})`);
        model.setAttribute("gesture-handler", {});
        marker.appendChild(model);
  
        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${toy.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 1.7);
        mainPlane.setAttribute("height", 1.5);
        marker.appendChild(mainPlane);
  
        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${toy.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 1.69);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("material", { color: "#F0C30F" });
        mainPlane.appendChild(titlePlane);
  
        var toyTitle = document.createElement("a-entity");
        toyTitle.setAttribute("id", `toy-title-${toy.id}`);
        toyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        toyTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: toy.toy_name.toUpperCase()
        });
        titlePlane.appendChild(dishTitle);
  
    
        var description = document.createElement("a-entity");
        description.setAttribute("id", `description-${dish.id}`);
        description.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
        description.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        description.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          align: "left",
          value: `${toy.description.join("\n\n")}`
        });
        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${dish.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          color: "white",
          width: 4,
          align: "center",
          value: `Only\n $${toys.price}`
        });

        mainPlane.appendChild(description);
      });
    },
  
    getToys: async function() {
      return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
          return snap.docs.map(doc => {
            doc.data()
           
          });
         
        });
    },
    getToysSummary: async function (tNumber) {
      return await firebase
      .firestore()
      .collection("toys")
      .doc(tNumber)
      .get()
      .then(doc => doc.data());     
    },
    handleOrderSummary: async function () {
      var toyNumber;
      toyNumber <= 9 ? (toyNumber = `T0${toyNumber}`) : (toyNumber = `T${toyNumber}`);
      var toySummary = await this.getOrderSummary(toyNumber);
      var modalDiv = document.getElementById("modal-div");
      modalDiv.style.display = "flex";
      var toyBodyTag = document.getElementById("bill-toy-body");
      toyBodyTag.innerHTML = "";
  
  
  
      var currentOrders = Object.keys(toySummary.current_orders);
      currentOrders.map(i =>{
         var tr = document.createElement("tr")
         var item = document.createElement("td")
         var price = document.createElement("td")
         var quantity = document.createElement("td")
         var subtotal = document.createElement("td")
         
        
        item.innerHTML = orderSummary.current_orders[i].item;
        price.innerHTML = "$" + orderSummary.current_orders[i].price;
        price.setAttribute("class", "text-center");
        quantity.innerHTML = orderSummary.current_orders[i].quantity;
        quantity.setAttribute("class", "text-center");
        subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
        subtotal.setAttribute("class", "text-center");
        
        tr.appendChild(item);
        tr.appendChild(price);
        tr.appendChild(quantity);
        tr.appendChild(subtotal);
    
        tableBodyTag.appendChild(tr);
  
       var totalTr =document.createElement("tr") 
      var td1 = document.createElement("td")
      td1.setAttribute("class", "no-line");
      var td2 = document.createElement("td")
      td2.setAttribute("class", "no-line");
      var td3 = document.createElement("td")
      td3.setAttribute("class", "no-line text-center");
      
      var strongTag = document.createElement("strong");
      strongTag.innerHTML = "Total";
      td3.appendChild(strongTag);
      
      var td4 = document.createElement("td")
      td4.setAttribute("class", "no-line text-center");
      td4.innerHTML="$"+ orderSummary.total_bill
  
      totalTr.appendChild(td1);
      totalTr.appendChild(td2);
      totalTr.appendChild(td3);
      totalTr.appendChild(td4);
  
        tableBodyTag.appendChild(totalTr);
        
      })
      
    },
    
    handlePayment: function () {   
      document.getElementById("modal-div").style.display = "none";
       var toyNumber;
       toyNumber <= 9 ? (toyNumber = `T0${toyNumber}`) : (tNumber = `T${toyNumber}`);
       firebase
       .firestore()
       .collection("tables")
       .doc(toyNumber)
       .update({
        current_orders :{},
        total_bill:0,
       })
       .then(() => {
        swal({
          icon: "success",
          title:"Thanks for Paying",
          text:"come again",
          timer:2500,
          buttons:false
          
        })
        
       })
      }
  });
  