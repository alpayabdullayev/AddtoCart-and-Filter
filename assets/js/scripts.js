const offCanvasOpenBtn = document.getElementById("basket");
const offCanvas = document.getElementById("offCanvas");
const offCanvasCloseBtn = document.getElementById("offcanvasCloseBtn");

offCanvas.style.transform= "translateX(100%)"

function OpenoffCanvas() {
    offCanvas.style.transform ="translateX(0)"
}
offCanvasCloseBtn.addEventListener("click",(e)=>{
    offCanvas.style.transform= "translateX(100%)"
})

offCanvasOpenBtn.addEventListener("click",()=>{
    OpenoffCanvas()
})






const tabButtons = document.querySelectorAll(".tab-ul li a");

    tabButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const category = button.parentElement.getAttribute("data-category");

      document.querySelectorAll(".cardData").forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        card.style.display = cardCategory === category ? "block" : "none";
      });
    });
});
