const onButton = document.getElementById("switch");

let state = false; // Initialize state variable

onButton.addEventListener("change", function() {
    state = !state; // Toggle the state when the button is changed

    if (state === true) {
        console.log("the extension is on");
    } else {
        console.log("the extension is off");
    }
});
