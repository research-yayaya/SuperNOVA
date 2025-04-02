let model;

// Load the TensorFlow.js model
async function loadModel() {
    model = await tf.loadLayersModel('https://research-yayaya.github.io/SuperNOVA/model/model.json');  // Replace with your actual model URL
    console.log("Model Loaded!");
}

loadModel();

// Handle image upload
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('preview').src = reader.result;
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
    let tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224]) // Resize to match model input
        .toFloat()
        .expandDims();

    let predictions = await model.predict(tensor).data();
    let maxIndex = predictions.indexOf(Math.max(...predictions));

    let classes = ["Healthy Nail", "Disease A", "Disease B", "Disease C"];  // Replace with your real labels
    document.getElementById('resultText').innerText = classes[maxIndex];
}
