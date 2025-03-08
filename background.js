chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // POSTリクエストをbackground.jsから実行
  // Service Worker（backgroundスクリプト）を使用することで、ブラウザがバックグラウンドで実行可能
  // - 特定のウェブページやブラウザウィンドウとは独立して動作する
  // - CORS制限を受けない（特権的な環境で動作しているため）
  // - そのため、別ドメインへのクロスオリジンリクエストが可能

  if (request.action === "sendData") {
    console.log(`📥 [REQUEST RECEIVED] - ${new Date().toISOString()}`);
    console.log("Received data from popup.js:");
    console.table(request.data);

    const url = "https://postman-echo.com/post";
    console.log(`🌐 [SENDING POST REQUEST] - URL: ${url}`);
    console.log(`🕒 [TIMESTAMP]: ${new Date().toISOString()}`);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => {
        console.log(
          `✅ [HTTP STATUS]: ${response.status} ${response.statusText}`
        );
        return response.json();
      })
      .then((data) => {
        console.log("📩 [RESPONSE DATA]:");
        console.table(data);

        sendResponse({ status: "success", data });
      })
      .catch((error) => {
        console.error("❌ [ERROR OCCURRED]:", error.message);
        console.error("🔍 [FULL ERROR]:", error);
        sendResponse({ status: "error", error: error.message });
      });

    console.log("🔄 [WAITING FOR RESPONSE] - Keeping connection open...");
    return true;
  }
});
