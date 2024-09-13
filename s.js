const extpay = ExtPay("dreamauto");
let countdownDisplay,
  textFields = [];
function formatTime(e) {
  return Math.floor(e / 60) + ":" + ((e %= 60) < 10 ? "0" : "") + e;
}
function getTextFields() {
  for (let e = 1; e <= 50; e++) {
    let t = document.getElementById("text-" + e);
    t && textFields.push(t.value);
  }
}
function setTextFields() {
  for (let e = 1; e <= 50; e++) {
    let t = document.getElementById("text-" + e);
    t && (t.value = textFields[e - 1] || "");
  }
}
function clearTextFields() {
  for (let e = 1; e <= 50; e++) {
    let t = document.getElementById("text-" + e);
    t && (t.value = "");
  }
  textFields = [];
}
function enableSound() {
  chrome.storage.local.get("enableSounds", (e) => {
    e.enableSounds
      ? (chrome.storage.local.set({ enableSounds: !1 }),
        chrome.runtime.sendMessage({ command: "disableSound" }),
        updateButtonState(!1))
      : (chrome.storage.local.set({ enableSounds: !0 }),
        chrome.runtime.sendMessage({ command: "enableSound" }),
        updateButtonState(!0));
  });
}
function updateButtonState(e) {
  let t = document.getElementById("enableSound");
  e
    ? ((t.innerHTML = "&#x1F50A"),
      t.classList.add("enabled"),
      t.classList.remove("disabled"))
    : ((t.innerHTML = "&#128263"),
      t.classList.add("disabled"),
      t.classList.remove("enabled"));
}
function handleStart() {
  chrome.runtime.sendMessage({ command: "start" });
}
function handleStop() {
  chrome.runtime.sendMessage({ command: "stop" }),
    (document.querySelector("#countdown-display").innerText =
      "Time before the next letter: 00:00");
}
function handleSave() {
  getTextFields();
  console.log(textFields);

  const isEmpty = textFields.every((field) => !field.trim());
  if (isEmpty) {
    alert("You need to fill in the text area!");
  } else {
    chrome.runtime.sendMessage({ command: "save", textFields: textFields });
  }
}
function handleClear() {
  clearTextFields(), chrome.runtime.sendMessage({ command: "clear" });
}
function init() {
  countdownDisplay = document.querySelector("#countdown-display");
  let e = document.getElementById("save-button");
  e && e.addEventListener("click", handleSave);
  let t = document.getElementById("clear-button");
  t && t.addEventListener("click", handleClear);
  let n = document.getElementById("stop-button");
  n && n.addEventListener("click", handleStop);
  let o = document.getElementById("start-button");
  o && o.addEventListener("click", handleStart);
  let a = document.getElementById("enableSound");
  a && a.addEventListener("click", enableSound);
  for (let e = 1; e <= 50; e++) {
    let t = document.getElementById("text-" + e);
    t &&
      t.addEventListener("input", function () {
        (textFields[e - 1] = t.value),
          chrome.storage.local.set({ textFields: textFields });
      });
  }
  chrome.storage.local.get(["textFields", "videoFields"], function (e) {
    e.textFields && ((textFields = e.textFields), setTextFields());
  }),
    extpay.onPaid.addListener(function () {
      window.location.reload();
    }),
    chrome.runtime.onMessage.addListener(function (e, t, n) {
      "update-countdown" === e.command
        ? (countdownDisplay.innerHTML = formatTime(e.time))
        : "update" === e.command &&
          chrome.storage.local.get(["textFields"], function (e) {
            textFields = e.textFields || [];
          });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("enableSounds", (e) => {
    updateButtonState(e.enableSounds);
  });
}),
  (window.onload = init);
var modal = document.getElementById("myModal"),
  span = document.getElementsByClassName("close")[0];
(span.onclick = function () {
  (modal.style.display = "none"), chrome.storage.local.set({ showModal: !1 });
}),
  chrome.storage.local.get(["version", "showModal"], function (e) {
    e.showModal &&
      ((modal.querySelector(".modal-content p").innerHTML =
        "Version: " +
        e.version +
        '<br><br>&mdash; Minor fixes. Optimizations.<br><br><br>Version: 1.0.6<br><br>&mdash; The user can now decide if they want to exclude or include favorites.<br><br><br>Version: 1.0.5.5 - 1.0.5.4<br><br>&mdash; Changes to the UI again.<br><br><br>Version: 1.0.5.3<br><br>&mdash; Small changes to the UI.<br><br>&mdash; Some bugs with names, which caused a heavy memory load, have been fixed.<br><br><br>Version: 1.0.5.2<br><br>&mdash; More bugs fixed. <br><br><br>Version: 1.0.5.1<br><br>&mdash; Fixed minor bugs.<br><br><br>Version: 1.0.5<br><br>&mdash; Added Radio.<br>&mdash; The user can now open the browser that sent the notification by clicking on the notification.<br><br><br>Version: 1.0.4.3<br><br>&mdash; Added a bypass when the DS changes the chat page to the main page.<br><br><br>Version: 1.0.4.2<br><br>&mdash; Fixed a bug that caused the name to not show up in notifications.<br>&mdash; Notification Optimization.<br><br><br>Version: 1.0.4.1<br><br>&mdash; Added name to TTS in case you have more than 1 account to prevent confusion.<br><br><br>Version: 1.0.4<br><br>&mdash; Added TTS function as an audio notification.<br><br><br>Version: 1.0.3.1 <br><br>&mdash; Fixed a bug that caused the chat timer to not be assigned if the popup was closed after assignment.<br><br><br>Version: 1.0.3 <br><br>&mdash; Removed "Myjchina" from the start of the letter.<br>&mdash; Swapped notification icons.<br>&mdash; Fixed bug when tab was not defined during searching for new invites.<br><br><br>Version: 1.0.2 <br><br>&mdash; Added WS reconnection to prevent notifications from an inactive browser from not being received.<br>&mdash; Fixed notification count to 1 for each type to prevent spam.<br><br><br>Version: 1.0.1 <br><br>&mdash; Tab behavior changed.<br>&mdash; Changed logic for letter notification.<br>&mdash; Fixed bug with connecting to WS.<br>&mdash; Fixed bug making not possible to set letters without at least one video file.<br>&mdash; Fixed array bug when text is filled in two fields and the field between them is empty.<br>&mdash; Fixed a bug where chat invitations were triggered twice after opening the tab for the very first time.<br><br><br>Version: 1.0.0 <br><br>&mdash; Extensions are combined into one.<br>&mdash; Added functionality to set custom  chat invites. <br>&mdash; Added notifications about letters and chats.'),
      (modal.style.display = "block"));
  });
let popupPort = chrome.runtime.connect({ name: "popup" });
popupPort.onMessage.addListener(function (e) {
  e.countdownValue &&
    countdownDisplay &&
    (countdownDisplay.textContent = `Time before the next letter:\n    \n    ${formatTime(
      e.countdownValue
    )}`);
});
var payButton = document.createElement("button");
(payButton.id = "pay-button"),
  (payButton.innerText = "Pay"),
  (payButton.className = "center1"),
  payButton.addEventListener("click", function () {
    extpay.openPaymentPage();
  });
var trialButton = document.createElement("button");
(trialButton.id = "trial-button"),
  (trialButton.innerText = "Trial"),
  (trialButton.className = "center1"),
  trialButton.addEventListener("click", function () {
    extpay.openTrialPage("3-day");
  });
var loginButton = document.createElement("button");
(loginButton.id = "login-button"),
  (loginButton.innerText = "Login"),
  (loginButton.className = "center1"),
  loginButton.addEventListener("click", function () {
    extpay.openLoginPage();
  });
var modal1 = document.getElementById("myModal1");
(modal1.style.opacity = "0"),
  (modal1.style.transition = "opacity 1s"),
  setTimeout(function () {
    modal1.style.opacity = "1";
  }, 500),
  extpay.getUser().then((e) => {
    let t = new Date();
    e.paid
      ? (Date.parse(e.paidAt),
        t.getTime(),
        (document.getElementById("status").innerText =
          "You have an active subscription.\n"),
        (document.getElementById("checkStatus").innerText =
          "Check your status"),
        (document.getElementById("checkStatus").onclick = function () {
          extpay.openPaymentPage();
        }))
      : e.trialStartedAt && t - e.trialStartedAt < 2592e5
      ? (Date.parse(e.trialStartedAt),
        t.getTime(),
        (document.getElementById("status").innerText =
          "You have a trial period active.\n"),
        (document.getElementById("checkStatus").innerText = "Upgrade"),
        (document.getElementById("checkStatus").onclick = function () {
          extpay.openPaymentPage();
        }))
      : null === e.trialStartedAt
      ? ((modal1.querySelector(".modal1-content p").innerHTML =
          "No data about subscription. You can start free or log in<br>If you have any questions, feel free contacting mcjillz1@gmail.com or @Wp3ki4 on Telegram"),
        modal1.appendChild(payButton),
        modal1.appendChild(trialButton),
        modal1.appendChild(loginButton),
        (modal1.style.display = "block"))
      : e.trialStartedAt &&
        t - e.trialStartedAt > 2592e5 &&
        ((modal1.querySelector(".modal1-content p").innerHTML =
          "Trial expired, please pay to continue<br>If you have any questions, feel free contacting mcjillz1@gmail.com or @Wp3ki4 on Telegram"),
        modal1.appendChild(payButton),
        modal1.appendChild(loginButton),
        (modal1.style.display = "block"));
  });
