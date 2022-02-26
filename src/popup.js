"use strict";

import "./popup.css";

(function () {
  const createShortUrl = (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const path = document.getElementById("path").value;
      fetch("https://api.shorturl.jurivana.de/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          path: path,
        }),
      }).then((response) => {
        const result = document.getElementById("result");
        if (response.status == 409) {
          result.classList.remove("success");
          result.classList.remove("hidden");
          result.classList.add("failure");
          result.textContent = "Pfad ist schon vergeben.";
        } else if (response.status == 201) {
          result.classList.remove("failure");
          result.classList.remove("hidden");
          result.classList.add("success");
          response.json().then((body) => {
            document.oncopy = (event) => {
              event.clipboardData.setData("text/plain", body.url);
              event.preventDefault();
            };
            document.execCommand("copy", false, null);
            result.textContent = `${body.url} wurde kopiert.`;
          });
        }
      });
    });
    return false;
  };
  document.getElementById("form").addEventListener("submit", createShortUrl);
})();
