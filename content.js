// Access the DOM.
var x = document.getElementsByTagName("img");
for (var i = 0; i < x.length; i++) {
  alert(x[i].className);
  x[i].addEventListener(
    "click",
    () => {
      alert("Hello World!");
    },
    false
  );
}
