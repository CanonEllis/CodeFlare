// Lesson 2-specific scripts
// Initialize CodeMirror with Monokai theme
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "python",
    theme: "monokai",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true
});
let fontSize = 14; // Default font size

// Function to increase font size
document.getElementById("increaseFont").onclick = () => {
    fontSize += 2;
    editor.getWrapperElement().style.fontSize = fontSize + "px";
    editor.refresh(); // Refresh the editor to apply new font size
};

// Function to decrease font size
document.getElementById("decreaseFont").onclick = () => {
    if (fontSize > 8) { // Minimum font size limit
        fontSize -= 2;
        editor.getWrapperElement().style.fontSize = fontSize + "px";
        editor.refresh(); // Refresh the editor to apply new font size
    }
};
async function loadPyodideAndPackages() {
    window.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/"
    });
    await pyodide.loadPackage('numpy');

    // Enable the Run button once Pyodide is ready
    document.getElementById("runButton").disabled = false;
}

loadPyodideAndPackages();

async function runCode() {
    const code = editor.getValue();
    const outputElement = document.getElementById("output");
    outputElement.innerHTML = "";  // Clear previous output

    // Python code to capture print output within a function
    const wrappedCode = `
import sys
from io import StringIO

def execute_user_code():
    # Redirect stdout to capture print statements
    old_stdout = sys.stdout
    sys.stdout = mystdout = StringIO()

    try:
        exec("""
${code.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}
        """)
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        sys.stdout = old_stdout  # Reset stdout to original

    return mystdout.getvalue()

# Run the function and capture output
execute_user_code()
`;

    try {
        // Execute the wrapped code and get the captured output
        const results = await pyodide.runPythonAsync(wrappedCode);
        outputElement.innerHTML = results ? results.replace(/\n/g, "<br>") : "Code executed successfully.";
    } catch (err) {
        outputElement.innerHTML = `<span style="color: red;">${err}</span>`;
    }
}

// Placeholder functions for navigation
function goBack() {
    alert("Go to the previous section");
}

function goNext(page) {
    window.location.href = page;
}
