!(function () {
  function sendPixelData(pid) {
    const endpoint =
      "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData";
    const domain = window.location.hostname;

    let scriptElement = document.createElement("script");
    scriptElement.async = true;
    scriptElement.src = `${endpoint}?pid=${pid}`;
    document.head.appendChild(scriptElement);

    function buildPayload() {
      return {
        pid: pid,
        domain: domain,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        pageTitle: document.title,
      };
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    })
      .then((response) => {
        if (response.ok) {
          console.log("✅ Data sent");
        } else {
          console.error("❌ Error in response:", response.statusText);
        }
      })
      .catch((error) => console.error("❌ Error:", error));

    if (location.href.includes("test=true")) {
      alert(
        "Congratulations!\n\nYou have successfully installed the pixel.\nYou can close this tab."
      );
    }
  }

  let currentScript = document.currentScript;
  let pid = currentScript?.dataset?.pid;

  if (pid) {
    sendPixelData(pid);
  } else if (currentScript) {
    pid = new URL(currentScript.src).searchParams.get("pid");
    if (pid) {
      console.log("> debug: using pid from query", pid);
      sendPixelData(pid);
    }
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      let scriptElement = document.getElementById("pixel-js");
      let backupPid = scriptElement?.dataset?.pid;
      if (backupPid) {
        console.log("> debug: using pid from backup", backupPid);
        sendPixelData(backupPid);
      }
    });
  }
})();
