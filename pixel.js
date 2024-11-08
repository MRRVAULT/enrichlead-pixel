(function () {
  const script = document.getElementById("pixel-js");
  const pid = script.getAttribute("data-pid");
  const domain = window.location.hostname;
  const functionUrl =
    "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData";

  function getVisitorData() {
    return {
      pid: pid,
      domain: domain,
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
      pageTitle: document.title,
      utmSource: new URLSearchParams(window.location.search).get("utm_source"),
      utmMedium: new URLSearchParams(window.location.search).get("utm_medium"),
      utmCampaign: new URLSearchParams(window.location.search).get(
        "utm_campaign"
      ),
    };
  }

  function trackVisit() {
    const data = getVisitorData();
    fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error("Error sending tracking data:", error);
    });
  }

  if (document.readyState === "complete") {
    trackVisit();
  } else {
    window.addEventListener("load", trackVisit);
  }

  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackVisit();
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });

  window.addEventListener("beforeunload", () => {
    const data = Object.assign({}, getVisitorData(), {
      event: "page_exit",
      timeSpent: (new Date() - performance.timing.navigationStart) / 1000,
    });
    navigator.sendBeacon(functionUrl, JSON.stringify(data));
  });
})();
