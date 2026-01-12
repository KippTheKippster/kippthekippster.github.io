document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start").addEventListener("click", function() {
        sessionStorage.setItem("name", document.getElementById("name-input").value)
        sessionStorage.setItem("color", document.getElementById("color-input").value)
        console.log(sessionStorage.getItem("name"))
        window.location.href = "controller.html";
    })
})