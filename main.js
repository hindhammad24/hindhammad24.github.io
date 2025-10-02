// resources:
// for the first interaction i used this website https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
// for the second one https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp
// for the last step i used the link before with some ai as i pasted the question and answer underneath

// Welcome message
// for the first interaction it is very simple where it shows a greeting pop-up when the page loads
// I used this https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event to help me with this idea 
window.addEventListener("load", () => {
  alert("Welcome to Hind Hammad’s Creative Corner!");
});

// Dark mode toggle
//for my second interaction i made a button that changes the colors of the website to dark mode 
// i used this toturial to help me with this https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp 
// created a button using JavaScript
const toggleButton = document.createElement("button");
// Set the text for the button
toggleButton.textContent = "Toggle Dark Mode";
// Style the button 
toggleButton.style.position = "fixed";
toggleButton.style.bottom = "20px";
toggleButton.style.right = "20px";
toggleButton.style.padding = "10px 15px";
toggleButton.style.borderRadius = "8px";
toggleButton.style.border = "none";
toggleButton.style.cursor = "pointer";
toggleButton.style.background = "#d63384";
toggleButton.style.color = "white";
// Add the button to the body of the page
document.body.appendChild(toggleButton);
// Add click event to toggle dark mode
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
// I then in css document chose the colors i want it to reset to 


// Copy email to clipboard popup 
// very similar to the welcome message i made it pop up when email link is clicked or coppied
// for this idea i used the prevose website along with some AI help  
// i asked chat "using chatgpt help me copy email link to cliboard and notify user once it clickes on email link considering i have a link"
// it replied with "Sure! Here are the steps: Select the email link – Use JavaScript to get a reference to the <a> element containing the email (mailto:).
// Add a click event listener – Detect when the user clicks the email link.
// Prevent the default action temporarily – Stop the link from immediately opening the email client, so you can copy first.
//Copy the email to the clipboard – Use the navigator.clipboard.writeText() function to copy the mailto: link.
//Notify the user – Show a message (e.g., alert or tooltip) confirming the email has been copied.
//Open the email client – After copying, allow the link to open the user’s default email application."

//once it is selected 
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Copy the email address to clipboard
    navigator.clipboard.writeText("hind.hammad24@gmail.com");
    // Alert the user that the email is copied
    alert(" Email copied to clipboard!");
  });
}
