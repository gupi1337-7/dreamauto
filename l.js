document.addEventListener("DOMContentLoaded", function () {
  var e = document.getElementById("content");
  e.classList.remove("hidden"),
    e.classList.add("fade-in"),
    document.querySelectorAll(".nav-item a").forEach(function (t) {
      t.addEventListener("click", function (n) {
        n.preventDefault();
        var d = t.getAttribute("href");
        e.classList.add("fade-out"),
          setTimeout(function () {
            window.location.href = d;
          }, 30);
      });
    });
});
