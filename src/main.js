const sampleHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sample Offline Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>This sample page is safe to encode and decode offline.</p>
  </body>
</html>`;

function setStatus(message, state = 'success') {
  const statusNode = document.getElementById('status');
  statusNode.textContent = message;
  statusNode.className = `status-box ${state}`;
}

function encodeText(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeText(value) {
  return decodeURIComponent(escape(atob(value)));
}

function handleEncode() {
  const sourceValue = document.getElementById('sourceInput').value.trim();

  if (!sourceValue) {
    setStatus('Please add text or HTML to encode.', 'error');
    return;
  }

  try {
    const encoded = encodeText(sourceValue);
    document.getElementById('outputArea').value = encoded;
    setStatus('Data encoded successfully.', 'success');
  } catch (error) {
    setStatus('Encoding failed. Check the input format.', 'error');
  }
}

function handleDecode() {
  const sourceValue = document.getElementById('sourceInput').value.trim();

  if (!sourceValue) {
    setStatus('Please add encoded text to decode.', 'error');
    return;
  }

  try {
    const decoded = decodeText(sourceValue);
    document.getElementById('outputArea').value = decoded;
    setStatus('Data decoded successfully.', 'success');
  } catch (error) {
    setStatus('Decoding failed. The value may not be valid base64.', 'error');
  }
}

function handleCopy() {
  const value = document.getElementById('outputArea').value;

  if (!value) {
    setStatus('No output to copy.', 'error');
    return;
  }

  navigator.clipboard.writeText(value)
    .then(() => setStatus('Output copied to clipboard.', 'success'))
    .catch(() => setStatus('Clipboard access was blocked.', 'error'));
}

function handleDownload() {
  const value = document.getElementById('outputArea').value;

  if (!value) {
    setStatus('No output to download.', 'error');
    return;
  }

  const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'offline-webpage-output.txt';
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus('Output downloaded as a text file.', 'success');
}

function loadSample() {
  document.getElementById('sourceInput').value = sampleHtml;
  setStatus('Sample HTML loaded.', 'success');
}

function clearFields() {
  document.getElementById('sourceInput').value = '';
  document.getElementById('outputArea').value = '';
  setStatus('Fields cleared.', 'success');
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('sourceInput').value = String(reader.result || '');
    setStatus(`Loaded file: ${file.name}`, 'success');
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('encodeBtn').addEventListener('click', handleEncode);
  document.getElementById('decodeBtn').addEventListener('click', handleDecode);
  document.getElementById('copyBtn').addEventListener('click', handleCopy);
  document.getElementById('downloadBtn').addEventListener('click', handleDownload);
  document.getElementById('sampleBtn').addEventListener('click', loadSample);
  document.getElementById('clearBtn').addEventListener('click', clearFields);
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
  loadSample();
});
