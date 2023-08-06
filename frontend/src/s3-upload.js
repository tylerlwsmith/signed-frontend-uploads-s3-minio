import axios from "axios";

const fileInput = document.querySelector("#file-input");
const resultContainer = document.querySelector("#result-container");

fileInput.addEventListener("change", async function handleFileSelect(event) {
  const file = event.target.files[0];

  if (!file) {
    clearResultsContainer();
    return;
  }

  let signedUrl;
  try {
    signedUrl = await getSignedUrl(file, process.env.UPLOAD_ENDPOINT).then(
      ({ data }) => data.signedUrl
    );
    await uploadToS3(file, signedUrl);
  } catch (error) {
    renderError(error);
  } finally {
    clearFileInput();
  }

  if (file.type.match("image/*")) {
    showUploadedImage(signedUrl);
  } else {
    clearResultsContainer();
  }
});

async function getSignedUrl(file, endpoint) {
  return await axios.post(
    endpoint,
    {
      contentType: file.type,
      contentLength: file.size,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function uploadToS3(file, signedUrl) {
  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": "form/multipart",
    },
  });
}

function renderError(error) {
  resultContainer.innerHTML = error.message;
}

function showUploadedImage(signedImageUrl) {
  const signedUrlObject = new URL(signedImageUrl);
  resultContainer.innerHTML = `<img src="${
    signedUrlObject.origin + signedUrlObject.pathname
  }" alt="Uploaded image" style="max-width: 100%">`;
}

function clearResultsContainer() {
  resultContainer.innerHTML = "";
}

function clearFileInput() {
  fileInput.value = "";
}
