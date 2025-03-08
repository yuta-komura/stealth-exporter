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
          chrome.runtime.sendMessage(
            {
              action: "sendData",
              data: results[0].result,
            },
            (response) => {
              if (response.status === "success") {
                showStatus("✅ 送信成功", "green");
              } else {
                showStatus("❌ 送信失敗: " + response.error, "red");
              }
            }
          );
        }
      }
    );
  });
});

function getLocalStorageData() {
  return { ...localStorage };
}

function displayData(data) {
  const output = document.getElementById("output");
  output.textContent = JSON.stringify(data, null, 2);
}

function showStatus(message, color) {
  const output = document.getElementById("output");
  output.innerHTML = `<p style="color: ${color};">${message}</p>`;
}
