let model;

// Load the TensorFlow.js model
async function loadModel() {
    try {
        console.log("Loading model...");
        model = await tf.loadLayersModel('https://research-yayaya.github.io/SuperNOVA/model/model.json');
        console.log("Model Loaded Successfully!");
        document.getElementById("status").innerText = "Model Loaded!";

        // 🔥 Fix: Initialize the model by making a dummy prediction
        let dummyTensor = tf.zeros([1, 224, 224, 3]); // Shape [batch_size, 224, 224, 3]
        model.predict(dummyTensor).dispose(); // Make a dummy prediction

    } catch (error) {
        console.error("Error loading model:", error);
        document.getElementById("status").innerText = "Failed to load model.";
    }
}

// Call loadModel() when the page loads
window.onload = () => {
    loadModel();
};

// Handle image upload
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('preview').src = reader.result;
        document.getElementById('preview').style.display = "block"; // Show the image preview
    };
    reader.readAsDataURL(event.target.files[0]);
});

// Process and predict the image
async function predict() {
    if (!model) {
        alert("Model is still loading...");
        return;
    }

    let img = document.getElementById('preview');

    // Ensure the image is fully loaded before processing
    img.onload = async function () {
        let tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224]) // Resize to match model input
            .toFloat()
            .expandDims(0); // Add batch dimension to the tensor

        let predictions = await model.predict(tensor).data();
        let maxIndex = predictions.indexOf(Math.max(...predictions));

        let classes = ["Healthy Nail", "Disease A", "Disease B", "Disease C"];  // Replace with your real labels
        document.getElementById('resultText').innerText = classes[maxIndex];
    };
}
