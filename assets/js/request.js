let row = document.getElementById("row");
let bascetCountQuantity = document.querySelector(".count");

let basketArr = getLocalStorage("basket") || [];

let totalCost = 0;


function setLocalStorage(key,data) {
    localStorage.setItem(key,JSON.stringify(data))
}

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || []
}



function CreateCard(productId,productDataCategory,img_url,img_url2,productName,productPrice) {
    let col = document.createElement("div")
    col.classList.add("col-12", "col-md-6", "col-lg-3", "cardData")
    col.setAttribute("data-category",productDataCategory)

    col.innerHTML = `
    <div class="card">
        <div class="product-item">
            <div class="product-img">
                <a href="shop.html">
                    <img class="primary-img" src="${img_url}" alt="Product Images">
                    <img class="secondary-img" src="${img_url2}" alt="Product Images">
                </a>
                <div class="product-add-action">
                    <ul class="d-flex gap-2">
                        <li><a href="#"><i class="fa-regular fa-heart"></i></a></li>
                        <li class="quuickview-btn"><a href="#"><i class="fa-regular fa-eye"></i></a></li>
                        <li class="addToBasket" ><a href=""><i class="fa-solid fa-cart-shopping"></i></a></li>
                    </ul>
                </div>
            </div>
            <div class="product-content">
                <a class="product-name" href="shop.html">${productName}</a>
                <div class="price-box pb-1">
                    <span class="new-price">$${productPrice}</span>
                </div>
                <div class="rating-box">
                    <ul class="d-flex">
                        <li><i class="fa fa-star"></i></li>
                        <li><i class="fa fa-star"></i></li>
                        <li><i class="fa fa-star"></i></li>
                        <li><i class="fa fa-star"></i></li>
                        <li><i class="fa fa-star"></i></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;

let addToBasket = col.querySelector(".addToBasket")
console.log(addToBasket);
addToBasket.onclick = function (e) {
    e.preventDefault();
    if (basketArr.find((x) => x.productId === productId)) {
        return;
      }
      let product = {
        productId,
        productDataCategory,
        img_url,
        img_url2,
        productName,
        productPrice,
        Productcount: 1,
      };
      basketArr.push(product);
    console.log(basketArr);
    setLocalStorage("basket",basketArr)
    generateBasketCards()
    let localLength = getLocalStorage("basket").length;
    bascetCountQuantity.textContent = basketArr.length;

    totalCost += productPrice; 
    updateTotalCostDisplay();
}

row.appendChild(col)

}

async function getProducts() {
    try {
        const res = await axios.get("http://localhost:3000/products")
        console.log(res.data);
        res.data.forEach(element => {
            CreateCard(
                element.id,
                element.dataCategory,
                element.image,
                element.image2,
                element.name,
                element.price
            )
        });
    } catch (error) {
        console.log(error);
    }
}

let localLength = getLocalStorage("basket").length;
bascetCountQuantity.textContent = basketArr.length;

function generateBasketCards() {
    const offcanvasContentMain = document.getElementById("offcanvasContentMain");
    offcanvasContentMain.innerHTML = "";
    basketArr.forEach((product) =>{
        const productDiv = document.createElement("div")
        productDiv.innerHTML = `
        <div class="miniCard d-flex">
            <div class="card-img">
                <img src="${product.img_url}" alt="">
            </div>
            <div class="cardInfo d-flex flex-column">
            <div class="cardName"><h5>${product.productName}</h5></div>
            <div class="cardCount">
            <span>${product.productPrice} x</span>
            
            <button onclick="decreaseCount(${product.productId})">-</button><span>${product.Productcount}</span> <button onclick="increaseCount(${product.productId})">+</button>
            </div>
            
        </div>
            <div class="delete">
                <button class="deleteBtn" data-id="${product.productId}">X</button>
            </div>
        </div>
        `;
        offcanvasContentMain.appendChild(productDiv)
        const deleteBtn = productDiv.querySelector(".deleteBtn")
        deleteBtn.addEventListener("click",()=>{
            const productId = parseInt(deleteBtn.getAttribute("data-id"))
            removeBasket(productId)
            console.log("salam");
        })
    })
}

function removeBasket(productId) {
    basketArr = basketArr.filter((product) => product.productId !== productId);
    setLocalStorage("basket", basketArr);
    generateBasketCards();
    updateTotalCostDisplay()
    
    let localLength = getLocalStorage("basket").length;
    bascetCountQuantity.textContent = basketArr.length;
    
}

function increaseCount(productId) {
    const product = basketArr.find((p) => p.productId === productId);
    if (product) {
      product.Productcount++;
      setLocalStorage("basket", basketArr);
      generateBasketCards();
      updateTotalCostDisplay();
    }
    console.log("salam");
}

function decreaseCount(productId) {
    const product = basketArr.find((p) => p.productId === productId);
    if (product && product.Productcount > 1) {
      product.Productcount--;
      setLocalStorage("basket", basketArr);
      generateBasketCards();
      updateTotalCostDisplay();
    }
    console.log("salam");
}



initializeBasket();

function initializeBasket() {
    basketArr = getLocalStorage("basket") || [];
    generateBasketCards();
    updateTotalCostDisplay();
  }
  
  function calculateTotalCost() {
    const totalCost = basketArr.reduce((acc, product) => {
      return acc + product.productPrice * product.Productcount;
    }, 0);
  
    return totalCost;
  }
  
  function updateTotalCostDisplay() {
    const totalCost = calculateTotalCost();
    const discountedTotalCost = calculateDiscountedTotalCost();
    const totalCount = document.querySelector("#totalCost");
    const discountedTotalCount = document.querySelector("#discountedTotalCost");
  
    if (totalCount) {
      totalCount.textContent = `TOPLAM ${totalCost.toFixed(2)} AZN`;
    }
  
    if (discountedTotalCount) {
      discountedTotalCount.textContent = `İNDİRİMLİ TOPLAM: ${discountedTotalCost.toFixed(2)} AZN`;
    }
  }
  
  function calculateDiscountedTotalCost() {
    const totalCost = basketArr.reduce((acc, product) => {
      let discountedPrice = product.productPrice;
      if (product.Productcount >= 5) {
        discountedPrice = product.productPrice * 0.8;
      }
      return acc + discountedPrice * product.Productcount;
    }, 0);
  
    return totalCost;
  }



getProducts()