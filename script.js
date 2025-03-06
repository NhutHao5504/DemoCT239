function chuyenTrang(page) {
    window.location.href = page;
}
function hideImage() {
    let image = document.getElementById("bannerImage");
    if (image) {
        image.style.display = "none"; 
    }
}

// Gán sự kiện cho tất cả các chức năng trong sidebar
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".function-box");
    buttons.forEach(button => {
        button.addEventListener("click", hideImage);
    });
});

function showBaloWeight() {
    let baloWeightContainer = document.getElementById("baloWeightContainer");
    if (baloWeightContainer) {
        baloWeightContainer.style.display = "block";
    }
}