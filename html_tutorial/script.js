// Initialize CodeMirror with Monokai theme
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "htmlmixed",
    theme: "monokai",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true,
});

let fontSize = 14; // Default font size

// Function to increase font size
document.getElementById("increaseFont").onclick = () => {
    fontSize += 2;
    editor.getWrapperElement().style.fontSize = fontSize + "px";
    editor.refresh();
};

// Function to decrease font size
document.getElementById("decreaseFont").onclick = () => {
    if (fontSize > 8) {
        fontSize -= 2;
        editor.getWrapperElement().style.fontSize = fontSize + "px";
        editor.refresh();
    }
};

// Function to update live preview
function updatePreview() {
    const code = editor.getValue(); // Get the content of the editor
    const iframe = document.getElementById("html-output").contentWindow.document;

    try {
        iframe.open(); // Open the iframe document
        iframe.write(code); // Write the HTML code to the iframe
        iframe.close(); // Close the iframe document to render the changes
    } catch (err) {
        console.error("Error updating preview:", err); // Log errors, if any
    }
}

// Optional: Add live preview as they type
editor.on("change", updatePreview);
