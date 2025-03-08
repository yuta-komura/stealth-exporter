document.getElementById("sendData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: getLocalStorageData,
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          displayData(results[0].result);
          // データを background.js に送信
          chrome.runtime.sendMessage({
            action: "sendData",
            data: results[0].result,
          });
        }
      }
    );
  });
});

function getLocalStorageData() {
  const data = { ...localStorage };
  return data;
}

function displayData(data) {
  const output = document.getElementById("output");
  output.textContent = JSON.stringify(data, null, 2);
}
