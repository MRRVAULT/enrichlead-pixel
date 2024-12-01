(() => {
  function t(t) {
    console.log("PID:", t);
    let o = window.location.hostname,
      n = new URL(window.location.href).searchParams.get("test") === "true";
    fetch(
      "https://api.ipdata.co?api-key=33c71249f49c4fc76a917075a622ab36f32162febc931448cd214d04"
    )
      .then((e) => e.json())
      .then((e) => {
        fetch(
          "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pid: t,
              domain: o,
              path: window.location.pathname,
              referrer: document.referrer,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              pageTitle: document.title,
              ipData: e,
              test: n,
            }),
          }
        )
          .then((e) => {
            e.ok
              ? (console.log("✅ Data sent successfully", e),
                n && alert("Congratulations! Test completed successfully"))
              : console.error("❌ Error in response:", e.statusText);
          })
          .catch((e) => {
            console.error("❌ Error:", e);
          });
      })
      .catch((e) => {
        console.error("❌ Error fetching IP data:", e);
      });
  }
  var e = document.currentScript,
    n = e?.dataset?.pid;
  n
    ? t(n)
    : (n = new URL(e.src).searchParams.get("pid"))
    ? (console.log("> debug: using pid from query", n), t(n))
    : document.addEventListener("DOMContentLoaded", function () {
        var e = document.getElementById("pixel-js")?.dataset?.pid;
        e && (console.log("> debug: using pid from backup", e), t(e));
      });
})();
