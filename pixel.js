!(function () {
  function e(e) {
    const t =
        "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData",
      n = window.location.hostname;
    let o = document.createElement("script");
    (o.async = !0),
      (o.src = `${t}?pid=${e}`),
      document.head.appendChild(o),
      fetch(
        "https://api.ipdata.co?api-key=33c71249f49c4fc76a917075a622ab36f32162febc931448cd214d04"
      )
        .then((response) => response.json())
        .then((ipData) => {
          fetch(t, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pid: e,
              domain: n,
              path: window.location.pathname,
              referrer: document.referrer,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              pageTitle: document.title,
              ipData: ipData,
            }),
          })
            .then((e) => {
              e.ok
                ? console.log("✅ Data sent")
                : console.error("❌ Error in response:", e.statusText);
            })
            .catch((e) => console.error("❌ Error:", e));
        })
        .catch((e) => console.error("❌ Error:", e));
  }
  let t = document.currentScript,
    n = t?.dataset?.pid;
  n
    ? e(n)
    : t
    ? (n = new URL(t.src).searchParams.get("pid")) &&
      (console.log("> debug: using pid from query", n), e(n))
    : document.addEventListener("DOMContentLoaded", function () {
        let t = document.getElementById("pixel-js")?.dataset?.pid;
        t && (console.log("> debug: using pid from backup", t), e(t));
      });
})();
