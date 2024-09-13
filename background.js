importScripts("ExtPay.js");
const extpay = ExtPay("dreamauto");
let tabId; // eto jest
extpay.startBackground(),
  extpay.getUser().then((e) => {
    console.log(e);
  });
let countdown,
  popupPort,
  popupPort1,
  tabIdNotifications,
  tabId1,
  countdownValue = 1200;
function startCountdown() {
  countdown = setInterval(function () {
    --countdownValue <= 0 && (countdownValue = 1200),
      chrome.storage.local.set({ countdownValue: countdownValue }),
      popupPort && popupPort.postMessage({ countdownValue: countdownValue });
  }, 1e3);
}
function checkSite() {
  chrome.tabs.query(
    { url: "https://www.dream-singles.com/members/messaging/bot/" },
    function (e) {
      0 === e.length
        ? chrome.tabs.create(
            {
              url: "https://www.dream-singles.com/members/messaging/bot/",
              pinned: true,
              active: false,
            },
            function (e) {
              tabId = e.id;
            }
          )
        : ((tabId = e[0].id),
          e[0].active ||
            chrome.tabs.update(tabId, { pinned: true, active: false }));
    }
  );
}

//dsad
function checkErrorsAndReload() {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function() {
      let e = !1,
        o = document.querySelector("title");
      o && o.textContent.includes("An Error Occurred: Too Many Requests")
        ? ((e = !0), console.log("An Error Too Many Request Occurred"))
        : ((e = !1),
          console.log("Looks like we have no Too Many Requests error")),
        e &&
          (console.log("Got an error. Reloading the page!"),
          (window.location.href =
            "https://www.dream-singles.com/members/messaging/bot"));
    },
  });
}
function insertText() {
  checkSite();
  chrome.storage.local.get(["textFields", "videoFields"], function (e) {
    console.log("Current textFields:", e.textFields);
    console.log("Current videoFields:", e.videoFields);

    let textFields = e.textFields || [];
    let videoFields = e.videoFields || [];

    let filteredTextFields = [];
    let filteredVideoFields = [];

    for (let i = 0; i < Math.max(textFields.length, videoFields.length); i++) {
      let textIsValid =
        textFields[i] &&
        typeof textFields[i] === "string" &&
        textFields[i].trim() !== "";
      let videoIsValid =
        videoFields[i] &&
        typeof videoFields[i] === "string" &&
        videoFields[i].trim() !== "";

      if (textIsValid || videoIsValid) {
        filteredTextFields.push(textFields[i]);
        filteredVideoFields.push(videoFields[i]);
      }
    }

    e.textFields = filteredTextFields;
    e.videoFields = filteredVideoFields;

    console.log("Filtered textFields:", e.textFields);
    console.log("Filtered videoFields:", e.videoFields);

    if (e.textFields && e.textFields.length > 0) {
      let o = e.textFields.shift();

      if (e.videoFields && e.videoFields.length > 0) {
        let t = e.videoFields.shift();
        e.textFields.push(o);
        e.videoFields.push(t);

        chrome.storage.local.set({
          textFields: e.textFields,
          videoFields: e.videoFields,
        });

        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            function: function (e, o) {
              setTimeout(function () {
                var t = document.querySelector(".cke_wysiwyg_frame.cke_reset"),
                  a = t.contentDocument || t.contentWindow.document,
                  n = a.querySelectorAll("p"),
                  i = a.querySelector("p");
                if (n.length > 1) {
                  n.forEach((e) => {
                    e.innerText = "";
                  });
                }
                // i.innerText = "Myjchina " + e;
                i.innerText = e;
                if (o) {
                  console.log("Using video:", o.name);
                  var r = document.querySelector("#bot_video");
                  if (r) {
                    var s = atob(o.data.split(",")[1]),
                      l = new Array(s.length);
                    for (var u = 0; u < s.length; u++) {
                      l[u] = s.charCodeAt(u);
                    }
                    var h = new Uint8Array(l),
                      d = new File([h], o.name, { type: o.type }),
                      c = new DataTransfer();
                    c.items.add(d);
                    r.files = c.files;
                    var y = new Event("change", { bubbles: true });
                    r.dispatchEvent(y);
                    console.log("File set to input:", r.files[0]);
                  } else {
                    console.error("Video input element not found.");
                  }
                }
              }, 8000);
            },
            args: [o, t],
          },
          (e) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            } else {
              chrome.scripting.executeScript(
                {
                  target: { tabId: tabId },
                  function: function () {
                    document
                      .querySelector(
                        ".click-ajax-modal.btn.btn-outline-primary.mt-5"
                      )
                      .click();
                    setTimeout(function () {
                      var e = document.querySelectorAll(
                        "#modal-large .gallery-media-wrapper[data-id]"
                      );
                      if (e && e.length > 0) {
                        var o =
                          e[Math.floor(Math.random() * e.length)].getAttribute(
                            "data-id"
                          );
                        document.querySelector(
                          'input[name="media-gallery-selection"]'
                        ).value = o;
                        var t = document.getElementById("sendPhotoBtn");
                        t.removeAttribute("disabled");
                        t.click();
                      }
                      setTimeout(function () {
                        document.getElementById("bot_save").click();
                      }, 5000);
                    }, 8000);
                  },
                },
                function () {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                  }
                }
              );
            }
          }
        );
      } else {
        console.log(
          "No videoFields available, proceeding with textFields only."
        );
        e.textFields.push(o);
        chrome.storage.local.set({ textFields: e.textFields });

        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            function: function (e) {
              setTimeout(function () {
                var t = document.querySelector(".cke_wysiwyg_frame.cke_reset"),
                  a = t.contentDocument || t.contentWindow.document,
                  n = a.querySelectorAll("p"),
                  i = a.querySelector("p");
                if (n.length > 1) {
                  n.forEach((e) => {
                    e.innerText = "";
                  });
                }
                i.innerText = "Myjchina " + e;
              }, 8000);
            },
            args: [o],
          },
          (e) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            } else {
              chrome.scripting.executeScript(
                {
                  target: { tabId: tabId },
                  function: function () {
                    document
                      .querySelector(
                        ".click-ajax-modal.btn.btn-outline-primary.mt-5"
                      )
                      .click();
                    setTimeout(function () {
                      var e = document.querySelectorAll(
                        "#modal-large .gallery-media-wrapper[data-id]"
                      );
                      if (e && e.length > 0) {
                        var o =
                          e[Math.floor(Math.random() * e.length)].getAttribute(
                            "data-id"
                          );
                        document.querySelector(
                          'input[name="media-gallery-selection"]'
                        ).value = o;
                        var t = document.getElementById("sendPhotoBtn");
                        t.removeAttribute("disabled");
                        t.click();
                      }
                      setTimeout(function () {
                        document.getElementById("bot_save").click();
                      }, 5000);
                    }, 8000);
                  },
                },
                function () {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                  }
                }
              );
            }
          }
        );
      }
    } else {
      chrome.alarms.clear("insertText");
    }
  });
}
function start() {
  (countdownValue = 1200),
    clearInterval(countdown),
    startCountdown(),
    checkSite(),
    chrome.alarms.clear("insertTextOnce"),
    chrome.alarms.clear("insertTextRepeat"),
    chrome.alarms.clear("checkErrorsAndReload"),
    chrome.alarms.create("insertTextOnce", { delayInMinutes: 0.083333 }),
    chrome.alarms.create("insertTextRepeat", { periodInMinutes: 20 }),
    chrome.alarms.create("checkErrorsAndReload", { periodInMinutes: 0.3 });
}
function stop() {
  (textFields = []),
    chrome.alarms.clear("insertTextOnce"),
    chrome.alarms.clear("insertTextRepeat"),
    chrome.alarms.clear("checkErrorsAndReload"),
    clearInterval(countdown),
    (countdownValue = 1200);
}

chrome.runtime.onConnect.addListener(function (e) {
  "popup" === e.name &&
    ((popupPort = e),
    popupPort.onDisconnect.addListener(function () {
      popupPort = null;
    }));
}),
  chrome.runtime.onMessage.addListener(function (e, o, t) {
    "start" === e.command
      ? ((countdownValue = 1200), startCountdown())
      : "stop" === e.command && clearInterval(countdown);
  }),
  chrome.alarms.onAlarm.addListener(function (e) {
    ("insertTextOnce" !== e.name && "insertTextRepeat" !== e.name) ||
      (insertText(),
      "insertTextOnce" === e.name && chrome.alarms.clear("insertTextOnce"));
  }),
  chrome.alarms.onAlarm.addListener(function (e) {
    "checkErrorsAndReload" === e.name && checkErrorsAndReload();
  }),
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    extpay.getUser().then((user) => {
      let currentDate = new Date();
      if (
        user.paid ||
        (user.trialStartedAt && currentDate - user.trialStartedAt < 2592e5)
      ) {
        handlePaidUserCommands(message, sender, sendResponse);
      } else {
        stop();
        if (intervalId) {
          messagingPageTabId = -1;
          clearInterval(intervalId);
          intervalId = null;
          clearInterval(timerId);
          timerId = null;
        }
        chrome.storage.local.set({ buttonState: false });
        stop1();
      }
    });
  });

function handlePaidUserCommands(message, sender, sendResponse) {
  if (message.command) {
    switch (message.command) {
      case "save":
        start();
        break;
      case "clear":
        chrome.storage.local.remove("textFields");
        chrome.storage.local.remove("videoFile");
        chrome.storage.local.remove("videoFields");
        stop();
        break;
      case "stop":
        stop();
        break;
      case "enableSound":
        chrome.storage.local.set({ enableSounds: true });
        console.log("sounds enabled");
        getAnyDreamTab()
          .then(() => {
            console.log("Tab is ready for notifications");
          })
          .catch((err) => {
            console.error("Failed to get or create the tab:", err);
          });
        break;
      case "disableSound":
        chrome.storage.local.set({ enableSounds: false });
        console.log("sounds disabled");
        if (tabIdNotifications) {
          chrome.tabs.remove(tabIdNotifications, () => {
            tabIdNotifications = null;
          });
        }
        break;
      default:
        console.log("Unknown command: " + message.command);
    }
  } else if (message.type) {
    switch (message.type) {
      case "START_SCRIPT":
        start1();
        if (message.value !== undefined) {
          reloadTime = message.value;
        }
        break;
      case "STOP_SCRIPT":
        stop1();
        break;
      case "SET_MODE":
        mode = message.mode;
        break;
      case "SET_EMOJI":
        selectedEmoji = message.emoji;
        break;
      case "SET_TIMER":
        reloadTime = message.value;
        break;
      case "GET_SCRIPT_STATUS":
        sendResponse({
          type: "SCRIPT_STATUS",
          isScriptRunning: isScriptRunning,
        });
        break;
      default:
        console.log("Unknown type: " + message.type);
    }
  } else if (message.action) {
    switch (message.action) {
      case "startSender":
        if (!intervalId) {
          if (messagingPageTabId !== -1) {
            chrome.tabs.update(
              messagingPageTabId,
              { pinned: true, active: false },
              () => {
                chrome.storage.local.get(["userSelection"], function (result) {
                  if (result.userSelection) {
                    let fastMode = result.userSelection.fastMode;
                    intervalId =
                      fastMode == 1
                        ? setInterval(clickButtonFast, 100)
                        : setInterval(clickButton, 1e4);
                  }
                });
                timerId = setInterval(checkErrorsAndReload1, 9e4);
              }
            );
          } else {
            timerId = setInterval(checkErrorsAndReload1, 9e4);
            openMessagingPage();
          }
          chrome.storage.local.set({ buttonState: true });
        }
        break;
      case "stopSender":
        if (intervalId) {
          messagingPageTabId = -1;
          clearInterval(intervalId);
          intervalId = null;
          clearInterval(timerId);
          timerId = null;
        }
        chrome.storage.local.set({ buttonState: false });
        break;
      default:
        console.log("Unknown action: " + message.action);
    }
  }
}
chrome.runtime.onInstalled.addListener(function (e) {
  ("install" != e.reason && "update" != e.reason) ||
    chrome.storage.local.set({
      version: chrome.runtime.getManifest().version,
      showModal: !0,
    });
});
let countdown1,
  popupChat,
  isScriptRunning = !1,
  mode = "Online",
  selectedEmoji = "Emoji",
  reloadTime = 5,
  countdownValue1 = 60 * reloadTime;
function startCountdown1() {
  countdown1 = setInterval(function () {
    countdownValue1--,
      countdownValue1 <= 0 && (countdownValue1 = 60 * reloadTime),
      chrome.storage.local.set({ countdownValue1: countdownValue1 }),
      popupChat && popupChat.postMessage({ countdownValue1: countdownValue1 });
  }, 1e3);
}
function checkSite1(callback) {
  chrome.tabs.query(
    { url: "https://www.dream-singles.com/members/chat/*" },
    function (tabs) {
      if (tabs.length === 0) {
        chrome.tabs.create(
          {
            url: "https://www.dream-singles.com/members/chat/",
            pinned: true,
            active: false,
          },
          function (tab) {
            chrome.tabs.update(tab.id, { pinned: true, active: false });
            tabId1 = tab.id;
            callback();
          }
        );
      } else {
        tabId1 = tabs[0].id;
        if (!tabs[0].pinned) {
          chrome.tabs.update(tabId1, { pinned: true, active: false });
        }
        callback();
      }
    }
  );
}

function checkElement() {
  isScriptRunning &&
    chrome.scripting.executeScript({
      target: { tabId: tabId1 },
      function: () => {
        let e = 0;
        setInterval(() => {
          var o = document.querySelector("#men-online-pane");
          o && o.style.height
            ? ((e = 0), console.log(e))
            : (e++,
              console.log(e),
              e >= 3 &&
                ((window.location.href =
                  "https://www.dream-singles.com/members/chat/"),
                (e = 0)));
        }, 3e3);
      },
    });
}

async function fillTextAreaAndClick() {
  let { favoriteShouldClick } = await chrome.storage.local.get(
    "favoriteShouldClick"
  );
  favoriteShouldClick = favoriteShouldClick || false;
  chrome.scripting.executeScript({
    target: { tabId: tabId1 },
    function: (e, o, t, a, favoriteShouldClick) => {
      let n;
      const i = [
          "❤️",
          "🧡",
          "💛",
          "💚",
          "💙",
          "💜",
          "💕",
          "💞",
          "💓",
          "💗",
          "💖",
          "😍",
          "😘",
          "😚",
          "😻",
          "🤩",
          "💏",
          "💑",
          "👩‍❤️‍👩",
          "👨‍❤️‍👨",
          "💌",
          "💋",
          "💘",
          "💝",
          "🎀",
          "🌹",
          "🌷",
          "🌺",
          "🌸",
          "🍫",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🥳",
          "🤗",
          "😙",
          "💏‍",
          "💏‍",
          "💑‍",
          "💑‍",
          "👩‍❤️‍💋‍👩",
          "👨‍❤️‍💋‍👨",
          "💟",
          "👩‍❤️‍👨",
          "👨‍❤️‍👩",
          "👩‍❤️‍💋‍👨",
          "👨‍❤️‍💋‍👩",
          "❣️",
          "💓",
          "💔",
          "💕",
          "💖",
          "💗",
          "💘",
          "💙",
          "💚",
          "💛",
          "💜",
        ],
        r = [
          "😢",
          "😔",
          "😞",
          "😟",
          "😕",
          "🙁",
          "☹️",
          "😣",
          "😭",
          "😥",
          "😓",
          "😩",
          "😫",
          "😰",
          "😨",
          "😖",
          "😿",
          "💔",
          "💤",
          "😪",
          "😷",
          "🤒",
          "🤕",
          "😨",
          "😰",
          "😓",
          "😥",
          "😢",
          "😩",
          "😫",
          "😭",
          "😵",
          "🥺",
          "😢",
          "😟",
          "😞",
          "😔",
          "😕",
          "🙁",
          "☹️",
          "😖",
          "😣",
          "😿",
          "💔",
          "💧",
          "💦",
          "🌧️",
          "🌦️",
          "🌩️",
          "⚡",
          "❄️",
          "🌨️",
          "🌧️",
          "🌦️",
          "🌩️",
          "⚡",
          "🌪️",
          "🥶",
          "😨",
          "😱",
          "😳",
          "😲",
          "🥺",
          "😢",
          "😭",
          "😟",
          "😔",
          "😕",
          "🙁",
          "☹️",
          "😖",
          "😣",
          "😫",
          "😩",
          "😓",
          "😩",
          "😫",
          "😓",
          "😥",
          "😰",
          "😢",
          "🥺",
          "😪",
          "😴",
          "😷",
          "🤕",
          "🤒",
          "😨",
          "😭",
          "😞",
          "😔",
          "😣",
          "😩",
          "😫",
          "😓",
          "😖",
          "😰",
          "😢",
          "😥",
          "😓",
          "😩",
          "😫",
          "😢",
          "😞",
          "😔",
          "😭",
          "😖",
          "😣",
          "😕",
          "🙁",
          "☹️",
          "😿",
          "💔",
          "💤",
          "💧",
          "💦",
          "🌧️",
          "🌦️",
          "🌩️",
          "⚡",
          "❄️",
          "🌨️",
          "🌧️",
          "🌦️",
          "🌩️",
          "⚡",
          "🌪️",
          "🥶",
          "😨",
          "😱",
          "😳",
          "😲",
          "🥺",
          "😢",
          "😭",
          "😟",
          "😔",
          "😕",
          "🙁",
          "☹️",
          "😖",
          "😣",
          "😫",
          "😩",
          "😓",
          "😩",
          "😫",
          "😓",
          "😥",
          "😰",
          "😢",
          "🥺",
          "😪",
          "😴",
          "😷",
          "🤕",
          "🤒",
          "😨",
          "😭",
          "😞",
          "😔",
          "😣",
          "😩",
          "😫",
          "😓",
          "😖",
          "😰",
          "😢",
          "😥",
          "😓",
          "😩",
          "😫",
          "😢",
          "😞",
          "😔",
          "😭",
          "😖",
          "😣",
          "😕",
          "🙁",
          "☹️",
          "😿",
          "💔",
          "💤",
          "💧",
          "💦",
          "🌧️",
          "🌦️",
          "🌩️",
          "⚡",
          "❄️",
          "🌨️",
          "🌧️",
          "🌦️",
          "🌩️",
          "⚡",
          "🌪️",
          "🥶",
          "😨",
          "😱",
          "😳",
          "😲",
          "🥺",
        ],
        s = [
          "😡",
          "😠",
          "🤬",
          "😤",
          "😾",
          "👿",
          "😒",
          "😣",
          "😞",
          "😑",
          "🙄",
          "😩",
          "😫",
          "😖",
          "😠",
          "😾",
          "😿",
          "💢",
          "🤯",
          "🤢",
          "🤮",
          "😷",
          "👹",
          "👺",
          "💀",
          "☠️",
          "💩",
          "🤡",
          "👿",
          "👽",
          "👾",
          "🤖",
          "😾",
          "🙅‍",
          "🙅",
          "🙅‍",
          "🙅‍",
          "🙅",
          "🙅‍",
          "🙆‍",
          "🙆",
          "🙆‍",
          "🙆‍",
          "🙆",
          "🙆‍",
          "🙎‍",
          "🙎",
          "🙎‍",
          "🙎‍",
          "🙎",
          "🙎‍",
          "🙍‍",
          "🙍",
          "🙍",
          "🙍‍",
          "💔",
          "🤬",
          "😡",
          "😠",
          "😤",
          "😾",
          "👿",
          "😒",
          "😣",
          "😞",
          "😑",
          "🙄",
          "😩",
          "😫",
          "😖",
          "😠",
          "😾",
          "😿",
          "💢",
          "🤯",
          "🤢",
          "🤮",
          "😷",
          "👹",
          "👺",
          "💀",
          "☠️",
          "💩",
          "🤡",
          "👿",
          "👽",
          "👾",
          "🤖",
          "😾",
          "🙅‍",
          "🙅",
          "🙅‍",
          "🙍‍",
          "🙍",
          "🙍‍",
          "💔",
          "😤",
          "🤯",
          "😫",
          "😾",
          "👿",
          "😡",
          "😠",
          "😖",
          "🤬",
          "😩",
          "🙄",
          "😒",
          "😣",
          "😾",
          "💢",
          "🤢",
          "🤮",
          "😷",
          "👹",
          "👺",
          "💀",
          "☠️",
          "💩",
          "🤡",
          "👿",
          "👽",
          "👾",
          "🤖",
          "💔",
        ],
        l = [
          "❤️",
          "🌹",
          "🌷",
          "💖",
          "💘",
          "💏",
          "💑",
          "💓",
          "💕",
          "💗",
          "💞",
          "💝",
          "💟",
          "😍",
          "😘",
          "😚",
          "😻",
          "💌",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
          "💌",
          "💏",
          "💑",
          "💘",
          "💗",
          "😍",
          "😘",
          "😚",
          "😻",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
          "💌",
          "💏",
          "💑",
          "💘",
          "💗",
          "😍",
          "😘",
          "😚",
          "😻",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
          "💌",
          "💏",
          "💑",
          "💘",
          "💗",
          "😍",
          "😘",
          "😚",
          "😻",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
          "💌",
          "💏",
          "💑",
          "💘",
          "💗",
          "😍",
          "😘",
          "😚",
          "😻",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
          "💌",
          "💏",
          "💑",
          "💘",
          "💗",
          "😍",
          "😘",
          "😚",
          "😻",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
          "💌",
          "💏",
          "💑",
          "💘",
          "💗",
          "😍",
          "😘",
          "😚",
          "😻",
          "💋",
          "🥰",
          "😇",
          "😊",
          "😌",
          "😋",
          "😜",
          "😎",
          "🤩",
          "🤗",
          "😙",
          "💖",
          "💕",
          "💞",
          "💓",
          "💟",
          "❤️",
        ],
        u = [
          "😊",
          "😍",
          "😘",
          "😚",
          "😻",
          "🥰",
          "😗",
          "😙",
          "🤩",
          "😎",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😍",
          "🥰",
          "😚",
          "😘",
          "😙",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😊",
          "😍",
          "😘",
          "😚",
          "😗",
          "😙",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😊",
          "😍",
          "😘",
          "😚",
          "😻",
          "🥰",
          "😗",
          "😙",
          "🤩",
          "😎",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😊",
          "😍",
          "😘",
          "😚",
          "😗",
          "😙",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😊",
          "😍",
          "😘",
          "😚",
          "😻",
          "🥰",
          "😗",
          "😙",
          "🤩",
          "😎",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😊",
          "😍",
          "😘",
          "😚",
          "😗",
          "😙",
          "😏",
          "😇",
          "🥳",
          "😛",
          "😜",
          "😝",
          "😌",
          "😊",
          "😍",
          "😘",
          "😚",
          "😻",
          "🥰",
          "😗",
          "😙",
          "🤩",
          "😎",
          "😏",
          "😇",
          "🥳",
          "😛",
        ],
        h = [
          "😐",
          "😑",
          "😶",
          "🤐",
          "😒",
          "🙄",
          "😔",
          "😕",
          "🤨",
          "😬",
          "🤥",
          "😓",
          "😞",
          "😖",
          "😣",
          "😠",
          "😡",
          "😤",
          "😢",
          "😭",
          "😥",
          "😦",
          "😧",
          "😨",
          "😩",
          "😰",
          "😱",
          "😳",
          "😵",
          "😲",
          "🥺",
          "😖",
          "😓",
          "🙁",
          "☹️",
          "😟",
          "😞",
          "😠",
          "😡",
          "😔",
          "😌",
          "😓",
          "😒",
          "😕",
          "🤨",
          "🧐",
          "😬",
          "😩",
          "😫",
          "😖",
          "😣",
          "😥",
          "😔",
          "😞",
          "😓",
          "😟",
          "😠",
          "😡",
          "😤",
          "😢",
          "😭",
          "😰",
          "😱",
          "😳",
          "😨",
          "😧",
          "😦",
          "😥",
          "😤",
          "😠",
          "😡",
          "😬",
          "😖",
          "😣",
          "😔",
          "😞",
          "😓",
          "😒",
          "😕",
          "🤨",
          "😐",
          "😑",
          "😶",
          "🤐",
          "😟",
          "😠",
          "😡",
          "😢",
          "😣",
          "😤",
          "😥",
          "😦",
          "😧",
          "😨",
          "😩",
          "😰",
          "😱",
          "😳",
          "😵",
          "😲",
          "🥺",
          "😖",
          "😓",
          "🙁",
          "☹️",
          "😟",
          "😞",
          "😠",
          "😡",
          "😔",
          "😌",
          "😓",
          "😒",
          "😕",
          "🤨",
          "🧐",
          "😬",
          "😩",
          "😫",
          "😖",
          "😣",
          "😥",
          "😔",
          "😞",
        ];
      let d = [
          "What's your favorite way to spend a nice Saturday afternoon in the sun?",
          "Where would your dream house be located if you could live anywhere in the world?",
          "Tequila or vodka? What would you choose?",
          "What's your favorite way to spend a leisurely day off with no plans at all?",
          "Do you have roommates? Imagine they're out of town...we could have a party, just the two of us! ",
          "How do you like to spend the perfect sunny Saturday?",
          "If you could have any superhuman ability, what special power would you want?",
          "If you could know the answer to one question about your future, what would you want to ask? ",
          "If you could learn any new skill instantly, what would you want to learn?",
          "Whats your favorite travel memory?",
          "What's the biggest goal or dream you want to achieve in your life?",
          "What's the most daring or spontaneous thing you've ever done?",
          "What's guaranteed to always make you smile, no matter what? I'd love to know so I can try it someday!",
          "Can you paint my nails for me? You can choose the color...and where you paint it.",
          "What song always pumps you up when you need some motivation?",
          "I need your help picking an outfit! Want to watch my fashion show? ",
          "What song pumps you up when you need motivation?",
          "If you could only keep 5 personal possessions, what would make the cut?",
          "Whats something youre looking forward to in the next few months?",
          "Where's the most interesting restaurant you've ever eaten at?",
          "What's your most cherished family tradition or childhood memory?",
          "What's the craziest thing still left on your bucket list?",
          "Where's the most jaw-droppingly beautiful place you've ever visited?",
          "If you could become instantly good at any new skill, what would you want to learn?",
          "I want to learn something new and interesting. What can you teach me?",
          "How steady are your hands? Lets find out...",
          "If you had unlimited funds, how would you spend your time?",
          "Wheres the most beautiful place youve ever visited? I want to see photos!",
          "Whats your favorite way to spend a cozy night in?",
          "If you could witness any historical event, what would you want to see?",
          "What's your perfect way to spend a summer weekend?",
          "Hey there! I was just thinking about you and had to say hi.",
          "Help me update my wardrobe and reinvent my style! Want to see what I've got so far?",
          "If you had to pick one food to eat for the rest of your life, what would you choose?",
          "Whats the most daring thing left on your bucket list?",
          "What's the most amazing natural place you've hiked or explored?",
          "Describe yourself using only 3 words. I bet you can come up with something clever!",
          "What's the most thoughtful gift you've ever received?",
          "I need help decorating my space with photos and art. What should I hang up?",
          "If you had all the time in the world, what would you love to learn more about?",
          "Whats your go-to song when you need motivation?",
          "Whats your favorite book? Id love a new reading recommendation!",
          "If you had unlimited spare time, what subject would you love to learn more about?",
          "I want to plan a fun themed party. Any suggestions on what the theme should be?",
          "If you could time travel, would you go to the past or the future?",
          "I want to shake things up today! Whats something youve always wanted to try but havent yet?",
          "Imagine we had the place to ourselves tonight...should we have a little party?",
          "I want to plant a herb garden. Will you help me pick out what to grow?",
          "Whats the most spontaneous thing youve ever done?",
          "Whats your favorite way to spend a sunny Saturday afternoon?",
          "If you had to eat one food every day for the rest of your life, what would you choose? ",
          "I'm so bored...want to play a game? No board games though, use your imagination! ",
          "Do you have roommates? Hmm imagine they are out of town... could we have party just the two of us?",
          "I bought a new scent...want to guess what it is as you smell my neck?",
          "Let's play truth or dare! But maybe just dare... ",
          "What's your number one all-time favorite book?",
          "Tell me about the best concert you've ever been to.",
          "What's an unpopular opinion that you have?",
          "Let's shake things up! What's something crazy you've always wanted to try but haven't yet?",
          "Lets have a karaoke night!",
          "If you could master any musical instrument, what would you want to play?",
          "I want to plan an amazing trip this summer. Where should I go? What should I do?",
          "I'm baking cookies tonight. Want to be my official taster?",
          "Tell me about your favorite travel adventure or memory!",
          "Help me decorate my space with some cool photos and art! What should I hang up?",
          "Whats your favorite way to spend a summer weekend?",
          "I need some help planning my dream vacation. Where should I go and what should I do?",
          "Im planning a fun movie marathon night. anything you could recommend? I'd recommend you to join hehe",
          "If you could time travel back to any historical era, which one would you want to experience?",
          "Let's have a movie marathon night! What films should we watch?",
          "If you could learn the answer to one question about your future, what would you want to know?",
          "If you could meet anyone living, who would you choose? Why?",
          "If you had to pare down to just 5 possessions, what would make the cut? ",
          "Whats your favorite family tradition or memory growing up?",
          "What's the best book you've read recently?",
          "What's your favorite family tradition or childhood memory?",
          "Whats your biggest goal or dream you want to accomplish in life?",
          "Want to be my personal photographer for the day? I could be your model.",
          "What's your favorite season of the year?",
          "If you could only eat one food for the rest of your life, what would you choose?",
          "If you could fly anywhere in the world right now, where would your dream destination be?",
          "Whats the most fun youve ever had traveling?",
          "If you could have any supernatural ability, what power would you want?",
          "If you could have dinner with anyone, dead or alive, who would you choose?",
          "Lets sneak away just together here...",
          "Will you help me plan an indoor herb garden?",
          "Let's see how gentle your touch is...brush your hand slowly over mine.",
          "Help me clean out my closet and update my wardrobe. would you like me to show what I have?",
          "Let's play 20 questions, but we'll make them special.",
          "Im in the mood for an adventure today. Any suggestions on what we could do for fun?",
          "Who would be your dream dinner guest, living or dead?",
          "What's your ideal way to spend a sunny Saturday?",
          "If you had to eat one meal everyday for the rest of your life, what would you choose?",
          "Whats something you believe that not everyone agrees with?",
          "What's the most spontaneous thing you've ever done?",
          "Would you stand homemade pizzas and a wine and movie night?",
          "What's your all-time favorite book?",
          "If you could travel anywhere in the world right now, where would you go? Im curious!",
          "I got a new scented candle! My friend said it reminds her of fire and ice. What does it mean? ",
          "If you could instantly learn to play any musical instrument, what would you choose?",
          "If you had unlimited spare time, what would you love to learn about?",
          "Describe the most memorable place you've ever visited on your travels.",
          "Whats your favorite way to spend a rainy day stuck inside?",
          "What are you most looking forward to in the coming months?",
          "Im making cookies tonight. Want to be my taste tester?",
          "I'm trying out a new perfume - want to guess the scent?",
          "Who do you really admire? Tell me all about them!",
          "I just got a manicure - want to see how sharp my nails are now? Careful, I might scratch! ",
          "My ACs broken...I'm all sweaty here! Can't turn it off!!!",
          "Lets play truth or dare! But maybe just dare...",
          "If you could only keep 5 possessions, what would they be?",
          "I got a new lipstick - want to help me test how kiss-proof it is?",
          "What animal would you be for a day if you could choose?",
          "Whats the most thoughtful gift youve ever given someone?",
          "What's the most unique restaurant you've ever dined at?",
          "Got a new corset, but it's a bit complicated to tie it alone...",
          "I saw something earlier that instantly made me think of you. Want to try and guess what it was?",
          "Im bored🥱🥱...want to play a game? No board games, just imagination.",
          "Whats your favorite way to spend a sunny Saturday?",
          "What's the best concert you've ever been to?",
          "Let's see how gentle your touch is...can you lightly run your hands over mine",
          "Let's mix things up today! What's something outrageous you've always wanted to try but haven't yet? I'm game for anything!",
          "If you could only eat one meal for the rest of your life, what would it be?",
          "If you could live anywhere in the world, where would your dream home be?",
          "If you could live in any era or time period, when would you choose?",
          "Whos someone you really admire?",
          "Should we make homemade pizzas together and watch a movie with some wine?",
          "If you could time travel, what historical era would you want to experience?",
          "I got a new corset but I can't lace it up alone. Could you help?",
          "Whats the most amazing place youve ever hiked or explored in nature?",
          "What's the most memorable place you've traveled to?",
          "Whats something that always makes you smile, no matter what?",
          "Whats the most thoughtful gift youve ever received?",
          "If you suddenly had unlimited money, how would you spend your time? Let your imagination run wild!",
          "What's the most daring thing still left on your bucket list?",
          "Whats your favorite season?",
          "If you could trade lives with someone for a day, who would you choose?",
          "Where's the most breathtaking place you've ever been? I'd love to see pics! ",
          "If you could gain one skill instantly, what would you want to learn?",
          "What's your favorite family holiday tradition?",
          "I just took a bubble bath - my fingers are so pruny!",
          "Whats your favorite way to spend a day off with no plans?",
          "What's your favorite way to spend a nice sunny Saturday afternoon?",
          "I'm eating something sweet right now - want to guess what it is?",
          "I'm going shopping for new dresses. Want to help me pick some out?",
          "If you could only keep 5 personal items, what would they be? ",
          "If you could live anywhere in the world, where would your dream home be?",
          "Wheres the most interesting place youve ever eaten dinner?",
          "I just took a bubble bath - want to see how wrinkly my fingers got? ",
          "What are you looking forward to most in the coming months?",
          "I'm making the ultimate road trip playlist. What songs simply MUST be on it?",
          "Will you help me put some lotion on my neck?",
          "I'm wearing new lipstick - how could we find out how long it lasts?",
          "Whats your celebrity crush?",
          "Whats your favorite family holiday tradition?",
          "If you could time travel, would you visit the past or the future?",
          "Whats the most memorable place youve ever visited while traveling?",
          "What's up! I wanted to say hello.",
          "Whats the best concert youve ever been to?",
          "Hey, I was just thinking of you and wanted to say hi! How's everything going today? ",
          "My AC is broken...I'm sweating over here! What should I do to cool off?",
          "Im in the mood to learn something new. anything you could teach me?",
          "What's an unpopular opinion you have? I'm curious to hear a unique perspective! ",
          "Whats the best book youve read recently?",
          "I just got a manicure. Wanna see how sharp my nails are now?",
          "Tell me something that never fails to make you smile, no matter what",
          "Help me plan my dream vacation! Where should I go and what should I do?",
          "If you could switch lives with anyone for a day, who would you choose?",
          "I'm feeling spontaneous today - any fun adventure ideas you can think of? I'm open to anything!",
          "Who's your celebrity crush?",
          "Who would be your ultimate dinner guest, living or dead?",
          "What was the most fun trip you've ever taken?",
          "What's the most thoughtful gift you've ever given someone?",
          "I'm so bored right now...want to play a game? No boards though - we'll have to use our imaginations!",
          "How do you like to spend a rainy day cooped up at home?",
          "I want to plan an awesome trip this summer. Where should I go?",
          "I want to throw a themed costume party!",
          "What's your favorite way to spend a rainy day cooped up inside?",
          "I'm trying out a new perfume - want to guess what it smells like?",
          "I need help picking out an outfit. Want to watch my fashion show?",
          "I got a new scented candle! My friend said it reminds her of fire and ice. What does it mean?",
          "I'm feeling adventurous today! Any fun or crazy activity ideas you can come up with? I'm open to anything.",
          "If you had to pare down to just 5 of your belongings, what would you keep?",
          "What's your favorite season and why?",
          "If you could eat one meal everyday for the rest of your life, what would it be? ",
          "If you could only keep 5 possessions, what would you choose?",
          "Would you like to be a photographer for me? I could be your model...",
          "If you could witness any historic event, which would you choose?",
          "I have a new candle I want to try out...My friend joking about ice and fire. Could you tell me what she means?",
          "If you could know the answer to any question about your future, what would you want to ask?",
          "Whats your favorite season and why?",
          "What's the most thoughtful gift you've ever given someone? What was it and why?",
          "I'm baking cookies tonight. Want to be my official taste tester?",
          "Who would be your dream dinner guest, dead or alive?",
          "Want to play 20 questions? But the questions can only be non usual ones...",
          "Who's someone you truly admire?",
          "What's the biggest accomplishment or goal you want to achieve in your lifetime?",
          "Describe the most amazing natural place you've ever explored.",
          "If you had to describe yourself using only 3 words, what would they be?",
          "If you could travel anywhere in the world right now, where would you jet off to?",
          "I just got a manicure - want to see how sharp my nails are?!",
          "Paint my nails for me? You can choose the color...and where you paint it ",
          "If you could have dinner with anyone, dead or alive, who would you invite?",
          "What's your favorite holiday tradition with your family?",
          "If you could instantly become a master at any instrument, what would you want to play?",
          "How do you like to spend a perfect cozy night at home?",
          "I can't decide what to wear! Want to help me pick an outfit? Maybe I'll do a fashion show for you.",
          "Im eating something juicy right now...want to guess what it is based on my lips?",
          "How do you like to spend the perfect summer weekend?",
          "Let's play truth or dare! But maybe just dare...",
          "Paint my nails for me? You can choose the color...and where you paint it.",
          "Red or white wine tonight - which should be opened first?",
          "I'm wearing new lipstick - want to help me test how kiss-proof it is? ",
          "If you could be an animal for a day, what would you be and why?",
          "How would you describe yourself in just 3 words?",
          "If you could time travel, would you visit the past or the future?",
          "Im trying to pull together a really fun road trip playlist. What songs should I add?",
          "Will you go to the history museum with me?",
          "How do you like to spend a relaxing day off with absolutely no plans?",
          "What's the most thoughtful gift you've ever received? What made it so meaningful?",
          "Tell me about your most fun trip ever.",
        ],
        c = [
          "Are you tired of just reading my words? Let's video chat so you can hear my voice and I can get lost in your dreamy eyes. 😉",
          "When are you going to stop being shy and turn that video on, Myjchina? I promise I don't bite!",
          "My webcam awaits! I'll video chat wearing something that matches your favorite color...care to tell what it might be? 💙❤️💜",
          "Myjchina, want to witness my stunning clumsiness firsthand? Let's video chat and you can watch me trip over my own two feet! 🤣",
          "I think my webcam has the hots for you! It keeps asking when Myjchina will video chat already...",
          "Don't you wish technology let you smell things through video chat? I'll spray my perfume before we chat so you imagine my scent. 🌹",
          "My puppy is dying to meet you on video chat! Don't break his widdle heart by making him wait any longer! 🐶",
          "I'm all squirmy and giddy imagining our video chat! Try not to melt when you witness my cuteness on cam. 🙈",
          "Shhh...don't tell my boss but I may 'work from home' one day just so we can chat over my morning coffee. 🤫☕",
          "Do you come with a warning label? 'Caution: Smoldering hotness during video chats'? Just want to be prepared! 🔥",
          "I'll video chat before my workout so you can see difference! haha!",
          "Don't video chat while you're busy or driving just to chat with me! I can wait patiently for your full attention! ",
          "Eek, am I video chat ready? I need to fluff my hair, find the best lighting, pick an outfit... Want to see? 😅",
          "Let's play truth or dare over video chat? but keep in mind my webcam blushes easily! ",
          "Don't keep me waiting too long to video chat, pretty please? I stare longingly at my webcam",
          "have you had a chance to try out the new video chat feature yet????",
          "when are you going to video chat?",
          "did you hear me sneeze in the chat room?? do you get audio and video in the chat room??",
          "Are you waiting to see the monster when I turn on the camera to chat with you?",
          "My webcam is getting cobwebs waiting for you!",
          "I bet I can make you blush on video chat without saying a single word? 😏",
          "Let's have a staring contest on video chat. First one to crack has to send an embarrassing baby pic! 👶",
          "Pick your most cringey dad joke and tell it to me on video chat. If you make me snort-laugh, you pass the vibe check! 😂",
          "Shhh don't tell your jealous exes, but we're having a secret video chat date! 🤫",
          "I triple-dog-dare you to video chat with my dog on your lap. Let's see if he gives their approval! ",
          "Let's play Never Have I Ever on video chat so I can expose all your most shameful secrets! Mwahaha",
          "Careful not to choke on all the dust when I turn on my webcam! I should really clean it more often...hope you don't mind a messy girl! ",
          "Fair warning, you may witness an epic sneezing fit when my dusty camera kicks up allergies. Keep tissues nearby for our video chat date! 🤧",
          "I promise I'm not a vampire, but I swear this webcam hasn't seen the light of day in ages! Pardon the dust bunnies... 🧛",
          "I would say let's play hide-and-seek on video chat but with all this dust, you'd easily track my footprints! Darn!",
        ],
        y = [
          "How's your evening looking, handsome? I was hoping we could video chat later tonight if you have some free time! 😊",
          "Any chance you're free for a video date tonight? I'd love to chat one-on-one and have your undivided attention! 🥰",
          "I'll be counting down the minutes until we can video chat tonight! What time works best for your schedule, darling?",
          "Let's make virtual date night plans - what time should I expect your handsome face on my screen tonight? I'll be waiting! 💕",
          "I'm all yours tonight if you have a free moment to video chat! My evening is wide open for you. 😉",
          "Want to video chat tonight, say around evening? I'll pour myself a glass of wine and tell you all my secrets! 🍷",
          "How about a virtual rendezvous tonight? We could video chat if you don't have other plans. 😏",
          "I wish we could cuddle in person, but video chatting tonight is the next best thing! What time works for you? 😘",
          "Netflix and video chat tonight? We can watch something together through the magic of technology! 📺",
          "I'll be taking my laptop to bed tonight if you want to video chat before I drift off to dreamland... 🛏️💤",
          "Let's chat face-to-face tonight instead of hiding behind our keyboards. I want to see you on my screen! 👀",
          "My laptop is charged and my wifi is ready for our virtual date night! Say when...I'll be right here waiting. ⏰",
          "I'm blocking my calendar off after 9pm in case you have some time to video chat before bed. deal? 🙋‍♀️",
          "Let's chat over a late night! Imagine I'll eat ice cream and you can tell me if I have any on my face. 🍦😆",
          "Will I be falling asleep on video chat with you tonight or will you keep me up late? I hope for the latter! 🌙",
          "I wish I could ask you in person if you'd like to video chat tonight...sending the invitation through a screen feels less fun! 💻",
          "Do you have about an hour to dedicate to me on camera tonight? I promise I'll make it worthwhile... 🎥",
          "It's not a date if we're just chatting, right? So let's do a video chat instead, deal? 😜",
          "My lips are already feeling lonely thinking about a virtual chat instead of the real thing. But I'll take what I can get for now! 👄",
          "I'll put on something nice and fix my hair all pretty if you say yes to a video date tonight...please say yes? 🙏",
          "If you agree to a video chat tonight, what background should I use? I want to impress you with my decor tastes! 🏠",
          "I wish you were here in person, but a virtual movie night will have to suffice for tonight! Which film should we 'watch' together? 🎞️",
          "Don't stand me up on our video chat tonight! I'll be staring at my screen with a pouty face until you appear. 😾",
          "I'm hoping tonight's the night we video chat until the sun comes up! Think you can handle that, night owl? 🦉",
          "It's a date! Can't wait to see your face on my screen tonight. Now to pick out the perfect outfit...😍",
        ],
        m = [
          "Do you often keep a woman waiting?)",
          "If I ask you, will you wear my dress?",
          "Do you often have a cup of hot coffee in the morning?",
          "How do you feel about displays of affection in public places?",
          "Will you go with me into the world of passion?)",
          "ARE YOU AGAINST WOMEN WITHOUT CHILDREN?",
          "I want to smell your scent... in bed. on the pillows. mmm!",
          "Do you have a domestic cat or a wild tigress by your side?",
          "do you warm my soul? my body? my lips? ",
          "ARE YOU HIDING WHERE YOU LIVE?",
          "Is it too stupid to have a pillow fight to end a date?",
          "WOMEN WHO HAVE A CHILD get on your blacklist?",
          "You want to see how I CHARGE?",
          "I could sleep on your couch like a cat for a few days)?",
          "If the apocalypse comes, can I hide in your bunker?",
          "SHOCKER! YOU HAVE A GUEST COUCH IN YOUR HOUSE?!",
          "How many meetings have you had this month?",
          "Okay, tell me when you'll get back to me. Next year.????.",
          "What will you promise if a woman comes up to you?",
          "Do you like it better when a girl wears pants or skirts????",
          "LADY posing for a magazine cover is a bad job?",
          "What do you do if a lady has WIDE legs?",
          "Does a girl need to have her breasts enlarged, if nature didn't give it to her?",
          "I have such sweet lips.... do you want to try it?",
          "You think it's very vulgar????? red lipstick on your lips",
          "YOU WANT TO SEE ME NOW?????? Tomorrow???? Always ??? ",
          "Is it normal for a man to control his woman's outfits?",
          "Is it heaven or hell to live in the same house with you?",
          "How do you feel about manipulative women?",
          "How do you feel about having a child in your relationship?",
          "How do you feel about tongue kissing?",
          "I won't have to fight you at night for a blanket?)))",
          "Have you thought about installing video cameras in the house?",
          "1 chat, 1 letter, 1 date, does that work?",
          "Why are you still single?",
          "what is your favorite thing to do when you're bored?",
          "Would you like to see the sunrise with me by your side???",
          "Is this really what you wanted to see, and will it be followed by your answer???",
          "WHY DO MEN LAUGH AT ME WHEN I TELL THEM HOW I FEEL??",
          "A SENSUAL AND UNDERSTANDING RELATIONSHIP, OR CAN'T I EXPECT THAT FROM YOU??",
          "Can our eyes meet in the near future???",
          "I can only hope you've written your profile info correctly. ",
          "You can see my invitation to chat, right?? Should I wait for you right now???",
          "Is a video chat date something you'd like to do right now??? Should I wait for you right now, or am I just gonna sit here alone???",
          "beauty or inner peace? what is more important for you when meeting a girl?",
          "how can you leave your business alone for at least a day and achieve balance in your life????",
          "how do you find love and not stumble into a toxic relationship??",
          "you only look at 18 year old girls and my age repels your attention????",
          "Is tonight's date night open? Or what else would you call it?",
          "HOW DO YOU FEEL ABOUT A GIRL WHO'S SUCCESSFUL IN BUSINESS? AND WHAT IS SUCCESS TO YOU?",
          "CAN YOU TELL ME WHAT TIME YOU'LL BE FREE?",
          "Do you have a car? Will you try to come in it?",
          "Is the city in your profile true? Are you really there?",
          "Do you think if a girl can provide for herself and her man, it's a good thing?",
          "do you see this check mark in my profile✅?",
          "men here treat girls like toys with no feelings?",
          "Do I have to record a video of me holding up two fingers to prove to you that I'm real? ",
          "What time do you plan to walk to church on this feast day?",
          "Are you familiar with the world-famous place called the green sign café?",
          "Could you take care of my flower if I can't??",
          "WHAT PLACE DO I HAVE TO BE IN AN HOUR TO SEE YOUR FACE?",
          "IS THERE ANY OTHER WAY TO PROVE TO YOU THAT THIS ISN'T A GAME?",
          "Are you tired of spending your evenings alone, too?",
          "Baby, did you come in the chat room? Why am I chatting and you're not responding?",
          "WHAT ARE THE CHANCES THAT AT THE END OF THE MONTH IT'LL BE JUST THE TWO OF US TOGETHER?",
          "What do you have to do to make the girl you're chatting with worthy of the title 'wife'?? ",
          "Have you seen what they've added to the chat room?!",
          "Do you know where the key to happiness is? Do you want me to tell you the secret?",
          "CAN I TRY TO GIVE YOU TONIGHT THE LOVE YOU'VE BEEN LOOKING FOR?",
          "IN THE LAND OF SILENCE, YOU'D BE KING, WOULDN'T YOU?",
          "WHAT WOULD YOU DO IF YOU WERE FACE TO FACE WITH A GIRL?",
          "YOU DIDN'T TAKE THAT LAST STEP JUST MOMENTS AWAY FROM YOUR GOAL?",
          "DID YOU EVER BELIEVE THAT DREAMS CAN COME TRUE?",
          "ARE YOU GONNA BE FREE TODAY? OR DO I HAVE TO WASTE ANOTHER DAY?",
          "IF A GIRL WAS BEING TRICKED, WOULD YOU INTERVENE? ",
          "DO YOU THINK OUR DATE COULD BE CONSIDERED AN ACCIDENT OR WAS IT PLANNED BY FATE?",
          "HAVE YOU EVER BELIEVED IN LOVE AT FIRST SIGHT?",
          "YOU STILL HAVEN'T REALIZED THAT YOU ARE THE NUMBER 1 MAN ON DREAM SINGLES?",
          "IS IT BETTER TO COME AND SEE THE PLOTS IN PERSON, OR CAN I TRUST THE PHOTOS ON THE INTERNET?",
          "WHAT AUTHORITIES DEAL WITH REAL ESTATE ISSUES? ",
          "You must have a lot of groupies chasing you, or am I wrong?) ",
          "Am I really that boring? Why are you avoiding me?",
          "Do you think the color red would suit me?",
          "Have you heard about the premium chatting here?!?",
          "It's urgent!!! we have to solve this right now!!! when can we meet?!? ",
          "I bet you like to communicate with your voice more than you like to chat on the internet, am I right?",
          "Will your credits run out if you chat with me for two minutes????",
          "how do you get an insurance discount in your town?",
          "How long are you gonna hide from me?? ",
          "How much longer do I have to take the initiative to see you???",
          "IS MAKING GIRLS HAPPIER YOUR JOB? 😍 ",
          "WHEN YOU'RE AROUND A GIRL, YOU JUST DON'T CARE ABOUT HER??",
          "IS IT TRUE THAT THERE'S AN OFF-SITE CONTACT FEATURE???",
          "ARE YOU AFRAID OF GETTING HURT AGAIN?",
          "DO YOU REALLY LIKE BEING ALONE THAT MUCH??",
          "AM I RIGHT IN ASSUMING THAT I SHOULDN'T EXPECT TO CELEBRATE WITH YOU TONIGHT???",
          "DO YOU ALREADY HAVE A DATE IN MIND FOR YOUR SPECIAL DAY???",
          "I NEED TO KNOW RIGHT NOW WHAT YOU WANT ME TO WEAR ON A FIRST DATE.",
          "WILL OUR LIPS MEET IN THAT SWEET KISS? ",
          "WILL YOU LET ME HUG YOU THE FIRST TIME WE MEET?",
        ],
        g = [
          "Playing mini golf and eating ice cream after?",
          "Let's go on a scenic hike and watch the sunset.",
          "I'd love to paint something special for you! Any ideas what I should create?",
          "Hi! I hope these roses 🌹🌹🌹 brighten your day.",
          "Candlelit yoga for two?",
          "Picnic lunch at the botanical gardens?",
          "Let's dress up all fancy and go salsa dancing tonight!",
          "Picnic under the stars? I'll pack all the fixings.",
          "Let's go rollerblading along the beach.",
          "Let's bake cookies and share the dough.",
          "Let's learn a fun dance together and have our own private dance party!",
          "Let's go on a scenic hike.",
          "Poetry, flowers, chocolates - I want to romance you every way possible! What's your love language hun?",
          "Slow dancing in the rain sounds so romantic!",
          "Let's have a pajama day in bed watching movies and cuddling",
          "I want to sprinkle rose petals on the bed and give you a sweet kiss for each one",
          "Home spa day - face masks, foot massages, herbal tea?",
          "I'll paint something inspired by you!",
          "You crossed my mind today and I wanted to send you good wishes from afar!",
          "You deserve to be showered in flowers and affection!",
          "Ooo a cozy night in sipping wine by the fire sounds so perfect right now!",
          "Bowling and arcade night? I'll let you win ;)",
          "Just wanted to send over a smile to make your day a little brighter!",
          "Let's get all cozy with hot cocoa and watch the snow fall outside! So dreamy",
          "Mmm let's watch the sunrise together one morning",
          "This girl knows how to give an amazing massage, just sayin'",
          "Snuggling by the fire with hot apple cider sounds heavenly! Let's do that soon",
          "I admire you from a distance and wish wonderful things for you always.",
          "Hehe any fun, unique date night ideas come to mind? I'm open to suggestions ;)",
          "Romantic sunset sail around the bay?",
          "Let's go rock climbing at the gym.",
          "If I could write you a love letter it would be 10 miles long.",
          "Aww I want to shower you with rose petals and kisses hehe",
          "Hehe let's daydream about our perfect first date...I'll remember every detail forever",
          "Let's go on a hot air balloon ride!",
          "A moonlit beach slow dance sounds so romantic!",
          "I wish I was kissing you right now hehe",
          "Mmm let's cozy up by the fire, gaze into each other's eyes, sip wine and feed each other chocolate covered strawberries",
          "I just want to dance the night away with you!",
          "I wrote you a song! Want to hear it?",
          "Romantic sunset sail?",
          "Poetry reading in the park?",
          "Sending the most gentle and caring kiss your way.",
          "Salsa dancing date night?",
          "How romantic would a sunset hot air balloon ride be?! Will you float away with me?",
          "Want to go to the observatory and stargaze?",
          "Cooking dinner together and dancing in the kitchen.",
          "Hehe want me to cover the bed in rose petals just for us?",
          "Maybe I'm crushing on you?",
          "Lounging around in pjs all day watching movies and cuddling sounds like the perfect day heh I'd never want to leave your arms!",
          "Want to go feed the ducks at the pond together?",
          "Hehe I'd love to cook a romantic dinner for you and feed you chocolate covered strawberries for dessert",
          "Wishing I could send you a big hug all the way from here!",
          "Romantic gondola ride?",
          "Thinking of you and sending positive vibes your way today.",
          "Netflix and cuddle all night?",
          "Have you ever gotten a romantic surprise gift from a girl before?",
          "Thinking happy thoughts and hoping your day is as amazing as you are!",
          "Even though we are not together I care about you deeply.",
        ],
        w = [
          "Ugh so I'm rethinking this whole life plan thing and want your genius angle!",
          "Im at a crossroads in my life right now. Your wisdom would mean a lot to me during this time.",
          "Im making a pivotal life decision and want your candid thoughts, but only when we can speak alone. Are you available?",
          "Im facing a pivotal point in my life. Your perspective would help guide me. When can we have an open and candid discussion?",
          "I need your advice on something Ive been struggling with. Are you free for a heart to heart?",
          "Im at a loss trying to handle something alone. Your honesty would help me gain clarity. When can we speak privately?",
          "Theres a personal matter I want your take on. Its serious and Id rather not get into details. Are you free to talk privately soon?",
          "I need your perspective on a difficult decision Im trying to make. When can we talk openly?",
          "I legitimately, no joke need your elite judgment!",
          "Im struggling with a major issue. Your wisdom and empathy could really help provide perspective. When can we chat privately?",
          "I trust you and would love your take on what Ive been dealing with lately. When are you free for a serious chat?",
          "Im at a crossroads in life. Your judgment would provide clarity. Are you open to an honest discussion soon?",
          "Theres something weighing on me that your wisdom could help with. Are you available for an honest heart to heart talk?",
          "Theres a lot on my mind Im trying to work through. Id appreciate being able to talk it all out with you sometime.",
          "Im at a crossroads in life. Your honesty would help me find clarity. When can we have a heartfelt discussion?",
          "Heh,funny story.. I have this crazy issue I'd love your hilarious take on soon because you're the best!",
          "so I may or may not be struggling with blah blah blah,got any stellar advice?",
          "Theres a sensitive topic I want to open up about. I trust you and value your perspective. Are you able to chat soon?",
          "Can we talk soon? I have a big decision to make and I value your input.",
          "Im rethinking life choices right now. Your thoughts would help tremendously. Are you free for a serious discussion?",
          "Im facing a difficult personal issue. Your advice would be invaluable. When are you free for a serious chat?",
          "There’s a sensitive matter I want to confide in you about. I trust your discretion. Are you open to an honest discussion?",
          "Im rethinking major things in my life and would appreciate your honesty and perspective on it all. Can we talk seriously when you have time?",
          "Theres something important on my mind I want your take on. Can we talk privately soon?",
          "I have a private issue on my mind that I want to be upfront with you about. Are you available for an important discussion?",
          "I’m sorry I’ve seemed preoccupied. I’m ready to open up about personal problems with your advice. Can we talk?",
          "Theres been something weighing on my mind lately. I could really use your thoughts and perspective.",
          "Im facing a big challenge alone right now. Your insights would provide needed clarity. Are you free for a serious heart to heart?",
          "Sorry Ive been distant. Im ready to open up about the problems Ive been facing. Can we talk alone when you have time?",
          "Sorry I havent seemed myself lately. I have a private matter on my mind that Id like to open up to you about when we can talk alone.",
          "Im struggling with a personal issue. Your advice would help tremendously. Are you free to chat?",
          "hey,so I kinda need your opinion on something important when you have some downtime!",
          "I have something important I want to talk to you about. Do you have some time to chat?",
          "I could use your empathy and guidance regarding a private matter. Are you open to talking confidentially?",
          "Im rethinking major choices and want your candid thoughts. Can we speak one-on-one when you have time?",
          "I’m rethinking life choices right now. Your honesty would mean so much. Can we speak confidentially soon?",
          "Theres been something weighing on my mind lately. I could really use your thoughts and perspective.",
          "Uggghhh this issue's got me wrecked! could you help?",
          "I need some clarity and outside perspective on a issue I cant seem to resolve. Your thoughts would help tremendously.",
          "Ughhh major confusion going on over here! maybe you know how to help me out?!",
          "This problem has me mad stressed! Your words of wisdom would be everything rn!",
          "Theres a lot I want to get off my chest. I could really use your listening ear and shoulder to lean on. Can we talk alone soon?",
          "Sorry Ive seemed distracted. Im dealing with something major and want your insights. Can we talk privately?",
          "Sorry I seem preoccupied. Im working through something difficult, and your advice would help. Can we connect?",
          "Ok so funny story but like not haha... it's pretty serious tbh! Chat in private soon?",
          "Im struggling internally with a major life decision. Your insights would mean so much. Can we connect privately soon?",
          "Im making a big life decision and want your take, but only privately. When can we speak confidentially?",
          "Im going through something right now that I cant stop thinking about. I could really use a listening ear and shoulder to lean on.",
          "I have an important decision to make and want your judgment, but only when we can speak privately. Can we talk candidly soon?",
          "Ohhh I can't stop overthinking this thing,your epic listening skills would be so clutch right now!",
          "Im ready to open up about something Ive kept private that I think youll have an insightful perspective on. When can we talk?",
          "Im at a loss trying to handle something on my own. I could really benefit from your wisdom and life experience if you have time to talk.",
          "I’m facing a big challenge and want your insights, but only one-on-one. Are you available for a candid heart to heart?",
          "There’s something important weighing on me. I trust you and value your perspective. Can we talk privately?",
          "Im in need of someone wise and caring to lean on right now. Are you open to having a heartfelt discussion with me sometime?",
          "hmm I'm so lost trying to deal on my own!",
          "Im reevaluating things in my life right now and want your perspective. Can we talk openly and honestly about it soon?",
          "Im facing a big challenge in life right now. Your wisdom would mean so much. Are you available to connect?",
          "Im struggling with a personal problem and could really use your support and advice. Are you available for a heartfelt discussion soon?",
          "I'm struggling rn ngl... really need someone compassionate to talk to,you around?",
          "So I legit have something crazy I wanna tell you about,you free anytime soonish?",
          "Whoops sorry for being spacey heh,I've just had personal stuff going on! Chat soon?",
          "I need your advice on something Ive been struggling with. Are you free for a heart to heart?",
          "Theres a sensitive subject Im ready to open up about that I think youll have an interesting take on. When works to connect?",
          "Im struggling with a major personal problem. Your empathy and insights are needed. Are you available for a heartfelt talk?",
          "Sorry if Ive seemed distracted lately. I have a lot going on personally. Id love to open up to you about it soon.",
          "I trust and value you. Theres been something weighing heavily on me that Id like to confide in you about when we can speak privately.",
          "I have something important I want to talk to you about. Do you have some time to chat?",
        ],
        p = [
          "Hi! Dear!",
          "Darling?",
          "babe",
          "Honey are you here?",
          "Hello!",
          "Hello",
          "Hey",
          "How are you",
          "Do you want to talk",
          "Hey!! Darling!!",
          "Honey",
          "Hey honey",
          "Hey dear",
          "Could we talk please?",
          "Do you want to spend some time together?",
          "Are you here",
          "hun",
          "Dear",
          "Hi dear",
          "Hello dear",
          "Hello dear!",
          "What are you doing now?",
          "Hello dear Could we talk?",
          "How's your day going so far dear?",
          "Hello dear",
          "Could we talk dear?",
          "Dear what are you doing now?",
          "Hello could we talk?",
          "Heeey",
          "Could we chat now? I'd love to hear from you while I'm free dear, could we use this time?",
          "Hello, could we talk now?",
          "Hi!!! Myjchina",
          "Hello Myjchina",
          "Myjchina let's talk a bit?",
          "What are you doing now dear?",
          "Dear",
          "Dear! hello",
          "Could we talk dear Myjchina",
          "Darling, hello",
          "Myjchina could we talk?",
          "I'm here waiting for your message dear, are you available to talk now?",
          "What are you doing now baby",
          "what are you doing now baby?",
          "Could I get your attention baby",
          "Honey, hello!",
          "What are you doing now?",
          "Dear hello",
          "How's your mood",
          "What are you doing now?",
          "Hello dear how are you?",
          "Could we talk?",
          "Hello dear",
          "Myjchina let's talk dear",
          "How's your mood today Myjchina",
          "Hello Myjchina",
          "Myjchina could we talkk now?",
          "What are you doing now?",
          "Hi!",
          "What makes you feel special dear?",
          "How are you",
          "Whatchu doin",
          "Hey thereeeeeeeeeeeee",
          "Can we talk",
          "Hi!",
          "Hello dear",
          "Heyyyyyyyyyyy",
          "Hey dear",
          "Anything new?",
          "How's your day going",
          "Hello dear!",
          "Hi my dearest",
          "WHat are you doing now?",
          "Hey honey",
          "Dear hi!!",
          "Hi! could we talk?",
          "Hello darling!!!",
          "😍💕💕💓💋💋",
          "Hello dearest!!!",
          "Dear let's talk? :)",
          "What are you doing now? 🥰🥰☺☺💋💋💓💓",
          "What are you up to? :)",
          "Hello",
          "Could we talk now? are you available?",
          "Hi dear!",
          "Could we talk right now? or are you busy?",
          "What are you doing now? Dear?",
          "What is on your mind dear?",
          "Hello could we talk?",
          "What are you doing now?",
          "Could we talk?",
          "Hello dear",
          "Dear hello!!!",
          "What do you feel of being lonely? :)",
          "Dear 😊💕🤗",
          "Hello dear, could we talk?",
          "Hi! could we talk?",
          "Dearest hello",
          "Dear hello!",
          "Hello!!!  dear",
          "Hello! are you available to chat now?",
          "Are you available to talk a bit?",
          "Hello!",
          "Hello could we talk?",
          "Could we talk? Hello",
          "Hi!",
          "Hello dear",
          "Myjchina how are you?",
          "are you here dear?",
          "Are you available to chat?",
          "What are you doing now dear? could we talk?",
          "Hello dearest!!",
          "Hello!!!",
          "Myjchina let's talk!!!",
          "Hi are you here? do you see my letters and chats?",
          "dear",
          "Dear! How are you?",
          "Myjchina are you available now?",
          "Hello",
          "Could we talk Myjchina?",
          "Myjchina Hello",
          "What are you doing now dear? could we talk?",
          "What are you doing now dear?",
          "Hello! dear",
          "Myjchina Hello",
          "Hello dear, can we talk??? Myjchina",
          "Can't wait to hear from you",
          "Hello dear!",
          "Hello! let's talk now?",
          "Myjchina are you interested in me?",
          "What are you doing? Could we talk?",
          "Are you here? Myjchina",
          "Hi! Myjchina dear",
          "How are you dear?",
          "Could I hear from you dear?",
          "Honey? let's talk",
          "dear are you here?",
          "Hi! Myjchina",
          "are you here?",
          "heeey",
          "What are you doing now?",
          "Hi!!! Dear! could we talk??? I'm here waiting for you",
          "Dear! hi!!!",
          "Could we talk? Or you'd love to exchange letters?",
          "Myjchina , could we talk?",
          "Hello dear!!!!",
          "Hello!!!!",
          "Hi!",
          "Myjchina hello",
          "Myjchina",
          "What are you doing now? Hey, why can't we talk dear?",
          "hello Myjchina",
          "Let's talk?",
          "Hello!!!",
          "How are you doing? could we talk a bit?",
          "Where are you dear??? Let's talk",
          "Hello dear, are you here?",
          "Are you available to talk dear?",
          "Hello",
          "Hi!!!",
          "Hi! dear how are you?",
          "Hello! are you available?",
          "Are you here?",
          "What are you doing now?",
          "Are you getting my invitations dear?",
          "Are you ignoring me?",
          "Could we talk?",
          "Could we talk? dearest? :)",
          "Hello why do you ignore me?",
          "Darling",
          "Are you available to chat?",
          "Are you available?",
          "Could I hear from you?",
          "Hello!!!",
          "Can't wait to hear from you",
          "Dear can you see my invitations?",
          "Hello!!! I'm here to talk to you",
          "Hello! Could I bring you lots of happiness?",
          "Hello dear! I'm still here, and you?",
          "Hello!!! let's talk dear",
          "Hello!!! Can't we talk dear?",
          "What are you doing now?",
          "Could we talk?",
          "Hi!",
          "Hi! are you here?",
          "Hello!!!",
          "Hi! Why are you ignoring me dear?",
          "Hi! let's talk!",
          "Dear! Hello",
          "Hello! dear! I'm still here! and you? :(",
          "Could we talk now? ;)",
          "Hello dear, let's talk!!!",
          "Hello!",
          "Hey, could I have your attention?",
          "Hi! what are you doing now? could we talk???",
          "Hello!!!!",
          "Let's talk dear",
          "Dear are you here? could we talk?",
          "What are you doing now dear?",
          "Are you here? Could I have your attention?",
          "Hi dear!!! let's talk!",
          "What are you doing here? could we talk a bit now?",
          "Could we talk now? ;)",
          "Hello dear! Are you here?",
          "Hi! can we talk?",
          "Dear Hello let's talk!",
          "What are you doing now?",
          "Hello! Are you in chat? let's talk!",
          "Hello! what are you doing now?",
          "Are you in a good mood now?",
        ],
        f = [
          "Just checking in, did you receive my letter?",
          "Hey, did you have a chance to read my last message?",
          "Wanted to make sure you received my message, any thoughts?",
          "Hi there, following up on my letter from earlier.",
          "Checking in, any updates on our conversation?",
          "Just wanted to touch base, did you have any further thoughts?",
          "Hi, hope everything is going well?",
          "Hey, hope all is well.",
          "Do you have any Words for me?",
          "Just wanted to make sure my letter didn't get lost in your inbox, did you have a chance to read it?",
          "Hey, do youi see me?.",
          "Hi, hope you're doing well.",
          "Hey there, I'm checking in to see if you had a chance to review the thoughts I sent you.",
          "Hi, I hope you're having a good day.",
          "Hey, just wanted to make sure you received my last letter. Let me know if you have any questions.",
          "Hi there",
          "Just wanted to say hello",
          "Hey, hope everything is going well for you",
          "Hi, wanted to make sure you received my message.",
          "Did you receive it? My letter? Chat invitation?",
          "Hello dear let's talk in letters?",
          "Hey, hope all is well. You check my letters?",
          "Hi, Sending you more and more letters.",
          "Hey there, wanted to make sure my message didn't get lost in your inbox. Did you receive it?",
          "Hi, I hope this message finds you well. what about my letter for you? you have it?",
          "Hey, did you get a chance to look over the letter I sent over?",
          "I'd love to know your thoughts",
          "Do you like being ignored?",
          "I'm in letters waiting for your letter",
          "Hey there you available?",
          "What do you have to tell me on my last message?",
          "Hey, Do you have any news for me?",
          "Hi there, just wanted to touch base and see if you had any further thoughts on the the future.",
        ];
      function I(e) {
        return e[Math.floor(Math.random() * e.length)];
      }
      function v() {
        return "Emoji" === o ? 0 : Math.floor(5 * Math.random());
      }
      const b = (function (e) {
          return (
            console.log("Mode: " + e),
            "Hi/Hello" === e
              ? p[Math.floor(Math.random() * p.length)]
              : "Important" === e
              ? w[Math.floor(Math.random() * w.length)]
              : "Letters!" === e
              ? f[Math.floor(Math.random() * f.length)]
              : "Romance" === e
              ? g[Math.floor(Math.random() * g.length)]
              : "CameraON" === e
              ? c[Math.floor(Math.random() * c.length)]
              : "CameraOff" === e
              ? y[Math.floor(Math.random() * y.length)]
              : "ThirdPartyMessages" === e
              ? m[Math.floor(Math.random() * m.length)]
              : "UserInput" === e
              ? (console.log("User messages: ", a),
                a[Math.floor(Math.random() * a.length)])
              : d[Math.floor(Math.random() * d.length)]
          );
        })(e),
        k = (function (e) {
          switch (e) {
            case "Love":
            default:
              return i;
            case "Sad":
              return r;
            case "Angry":
              return s;
            case "Romantic":
              return l;
            case "Dating":
              return u;
            case "Serious":
              return h;
            case "Emoji":
              return [];
          }
        })(o),
        T = (function (e, o) {
          const t = v();
          return Array.from({ length: t }, () => I(o)).join("") + e;
        })(b, k),
        H = (function (e) {
          const o = v();
          return Array.from({ length: o }, () => I(e)).join("");
        })(k);

      let textArea = document.querySelector("#auto-invite-message");
      let startButton = document.querySelector("#start-auto-invite");
      let stopButton = document.querySelector("#stop-auto-invite");
      let favoriteCheckbox = document.querySelector("#autoInviteFavorite");
      let cameraSwitch = document.querySelector("#vid-switch");
      let favoriteCheckboxClicked = favoriteCheckbox
        ? favoriteCheckbox.checked
        : false;
      console.log("UI Checkbox = " + favoriteShouldClick); //favoriteShouldClick for extention it means "add"
      console.log("Site Checkbox = " + favoriteCheckboxClicked); //favoriteCheckboxClicked For the site it means "exclude"

      if (textArea && stopButton) {
        stopButton.click();
      }

      if (textArea && startButton) {
        console.log("reloadTime " + t);
        textArea.value = T + H;

        if (favoriteCheckbox) {
          if (favoriteShouldClick === favoriteCheckboxClicked) {
            favoriteCheckbox.click();
          }

          if ("CameraON" === e) {
            cameraSwitch.click();
          }
        }

        if (startButton.classList.contains("btn-primary")) {
          startButton.click();
        }
      }

      clearTimeout(n);
      n = setTimeout(() => {
        console.log("reloadTimeout " + n);
        window.location.href = "https://www.dream-singles.com/members/chat/";
      }, 60 * t * 1000);
    },
    args: [mode, selectedEmoji, reloadTime, userMessages, favoriteShouldClick],
  });
}
chrome.runtime.onConnect.addListener(function (e) {
  "popupChat" === e.name &&
    ((popupChat = e),
    popupChat.onDisconnect.addListener(function () {
      popupChat = null;
    }));
}),
  chrome.runtime.onMessage.addListener(function (e, o, t) {
    "START_SCRIPT" === e.command
      ? ((countdownValue1 = 60 * reloadTime), startCountdown1())
      : "STOP_SCRIPT" === e.command && clearInterval(countdown1);
  }),
  chrome.alarms.onAlarm.addListener(function (e) {
    "fillTextAreaAndClick" === e.name &&
      (fillTextAreaAndClick(), checkElement());
  });
let userMessages = [];
function start1() {
  chrome.storage.local.get(
    ["selectedMode", "selectedEmoji", "ChattextField"],
    function (e) {
      (userMessages = e.ChattextField || []),
        console.log("User messages from storage: ", userMessages),
        (mode = e.selectedMode),
        (selectedEmoji = e.selectedEmoji);
      checkSite1(() => {
        (isScriptRunning = true),
          chrome.storage.local.set({ isScriptRunning: isScriptRunning }),
          clearInterval(countdown1),
          (countdownValue1 = 60 * reloadTime),
          startCountdown1(),
          chrome.alarms.create("fillTextAreaAndClick", { when: Date.now() });
      });
    }
  );
}
function stop1() {
  (isScriptRunning = false),
    chrome.storage.local.set({ isScriptRunning: isScriptRunning }),
    chrome.alarms.clear("fillTextAreaAndClick"),
    clearInterval(countdown1),
    (tabId1 = null);
}
chrome.tabs.onUpdated.addListener(function (tabIdChat, changeInfo, tab) {
  if (
    isScriptRunning &&
    changeInfo.status === "complete" &&
    tab.url.startsWith("https://www.dream-singles.com/members/chat/")
  ) {
    setTimeout(() => {
      start1();
    }, 5000);
  } else if (
    isScriptRunning &&
    tab.url === "https://www.dream-singles.com/login" &&
    tabIdChat === tabId1
  ) {
    setTimeout(() => {
      chrome.tabs.update(tabId1, {
        url: "https://www.dream-singles.com/members/chat/",
      });
    }, 60000);
  } else if (
    isScriptRunning &&
    changeInfo.status === "complete" &&
    tabIdChat === tabId1
  ) {
    setTimeout(() => {
      start1();
    }, 5000);
  }
});

let intervalId = null,
  timerId = null,
  messagingPageTabId = -1,
  fastMode = 0;
function checkErrorsAndReload1() {
  chrome.scripting.executeScript({
    target: { tabId: messagingPageTabId },
    function: () => {
      let e = 0,
        o = 0,
        t = !1,
        a = !1,
        n = "",
        i = null,
        r = document.getElementById("spam"),
        s = document.querySelector(".alert-danger"),
        l = document.querySelector("title"),
        u = document.querySelector("title"),
        h = !1;
      i = setInterval(() => {
        let i = document.querySelector(".progress-bar");
        r && "Searching" === r.value
          ? (e++,
            console.log(
              "Checking if sending is going",
              e,
              "time based on button"
            ))
          : ((e = 0), console.log("its all ok with checking based on button")),
          null != i &&
            (i.style.width === n
              ? (o++,
                console.log(
                  "Checking if sending is going",
                  o,
                  "time based on progress bar"
                ))
              : ((o = 0),
                (n = i.style.width),
                console.log("its all ok with checking based on progress bar"))),
          l && l.textContent.includes("An Error Occurred: Too Many Requests")
            ? ((a = !0), console.log("An Error Too Many Request Occurred"))
            : ((a = !1),
              console.log(
                "Looks like everything is ok, we have no too many Requests error"
              )),
          (u &&
            u.textContent.includes(
              "Dream Singles is the Premier International Dating Site With The Most Beautiful Women Abroad"
            )) ||
          (u && u.textContent.includes("Member Home"))
            ? ((h = !0), console.log("Connection failed. Try to relogin."))
            : (h = !1),
          s && s.textContent.includes("An Error has Occurred!")
            ? ((t = !0), console.log("An Error Occurred Server closed"))
            : ((t = !1), console.log("Server is OK")),
          (e >= 3 || o >= 3 || t || a || h) &&
            (console.log("Got an error. Realoading the page!"),
            (window.location.href =
              "https://www.dream-singles.com/members/messaging/bot/send"));
      }, 9e4);
    },
  });
}
let currentCategoryIndex = 0;
function clickButton() {
  const e = [
    "onlineOnly",
    "offlineOnly",
    "favorites",
    "admirers",
    "contacts",
    "newGuys",
  ];
  chrome.storage.local.get(["userSelection"], function (o) {
    if (o.userSelection) {
      let t = o.userSelection,
        a = e.filter((e) => t[e]);
      if (a.length > 0) {
        let e = a[currentCategoryIndex % a.length];
        currentCategoryIndex++,
          chrome.scripting.executeScript({
            target: { tabId: messagingPageTabId },
            function: (e) => {
              console.log("buttonclickSlow");
              const o = document.getElementById("inputLastActivity");
              null != o
                ? ((o.options[0].defaultSelected = !1),
                  (o.options[1].defaultSelected = !0))
                : console.log(
                    "cannot change last activity opt... Try to relogin. Skipping"
                  );
              const t = document.querySelector(".btn-success");
              if (t) {
                const o = document.getElementById(e);
                o && ((o.checked = !0), t.click());
              }
            },
            args: [e],
          });
      }
    }
  });
}
function clickButtonFast() {
  const e = [
    "onlineOnly",
    "offlineOnly",
    "favorites",
    "admirers",
    "contacts",
    "newGuys",
  ];
  chrome.storage.local.get(["userSelection"], function (o) {
    if (o.userSelection) {
      let t = o.userSelection,
        a = e.filter((e) => t[e]);
      if (a.length > 0) {
        let e = a[currentCategoryIndex % a.length];
        currentCategoryIndex++,
          chrome.scripting.executeScript({
            target: { tabId: messagingPageTabId },
            function: (e) => {
              console.log("buttonclickFast");
              const o = document.getElementById("inputLastActivity");
              null != o
                ? ((o.options[0].defaultSelected = !1),
                  (o.options[1].defaultSelected = !0))
                : console.log(
                    "cannot change last activity opt... Try to relogin. Skipping"
                  );
              var t = document.querySelector(
                  ".text-uppercase.pt-2.notranslate"
                ),
                a = document.createElement("button");
              (a.id = "spam"), (a.innerHTML = ""), t.appendChild(a);
              const n = document.getElementById("spam");
              if (n) {
                const o = document.getElementById(e);
                o && ((o.checked = !0), n.click(), t.removeChild(a));
              }
            },
            args: [e],
          });
      }
    }
  });
}
function openMessagingPage() {
  chrome.tabs.query(
    { url: "https://www.dream-singles.com/members/messaging/bot/send" },
    (e) => {
      e.length > 0
        ? chrome.tabs.update(e[0].id, { pinned: true, active: false }, (e) => {
            (messagingPageTabId = e.id),
              chrome.storage.local.get(["userSelection"], function (e) {
                if (e.userSelection) {
                  let o = e.userSelection.fastMode;
                  intervalId =
                    1 == o
                      ? setInterval(clickButtonFast, 100)
                      : setInterval(clickButton, 1e4);
                }
              });
          })
        : console.log("hz che delaet");
    }
  );
}
let ttsQueue = [];
let isSpeaking = false;
let userName = "";
async function getAnyDreamTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        pinned: true,
        url: "https://www.dream-singles.com/members/",
      },
      function (tabs) {
        const excludedPatterns = [
          "https://www.dream-singles.com/members/messaging/bot/*",
          "https://www.dream-singles.com/members/chat/*",
        ];

        const filteredTabs = tabs.filter((tab) => {
          return !excludedPatterns.some((pattern) =>
            new RegExp(pattern.replace(/\*/g, ".*")).test(tab.url)
          );
        });

        if (filteredTabs.length === 0) {
          chrome.tabs.create(
            {
              url: "https://www.dream-singles.com/members/",
              pinned: true,
              active: false,
            },
            function (newTab) {
              chrome.tabs.update(newTab.id, { pinned: true, active: false });
              tabIdNotifications = newTab.id;
              console.log("Created new tab with ID:", tabIdNotifications);
              extractUserName(tabIdNotifications).then(() =>
                resolve(tabIdNotifications)
              );
            }
          );
        } else {
          tabIdNotifications = filteredTabs[0].id;
          if (!filteredTabs[0].pinned) {
            chrome.tabs.update(tabIdNotifications, {
              pinned: true,
              active: false,
            });
          }
          chrome.tabs.reload(tabIdNotifications, {}, () => {
            console.log("Updated existing tab with ID:", tabIdNotifications);
            extractUserName(tabIdNotifications).then(() =>
              resolve(tabIdNotifications)
            );
          });
        }
      }
    );
  });
}
async function extractUserName(NameTab) {
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const tab = await chrome.tabs.get(NameTab).catch(() => null);
      if (!tab) {
        console.log("Tab does not exist, skipping extraction");
        return null;
      }

      const result = await chrome.scripting.executeScript({
        target: { tabId: NameTab },
        func: () => {
          const welcomeElement = document.querySelector(
            "h1.text-left.inline-block"
          );
          if (welcomeElement) {
            const welcomeText = welcomeElement.textContent.trim();
            const match = welcomeText.match(/Welcome, (.+)!/);
            return match ? match[1] : null;
          }
          return null;
        },
      });

      if (result && result[0] && result[0].result) {
        userName = result[0].result;
        await chrome.storage.local.set({ userName: userName });
        console.log("Extracted user name:", userName);
        return userName;
      }
    } catch (error) {
      console.error("Error extracting user name:", error);
      if (error.message.includes("Frame with ID 0 was removed")) {
        console.log("Tab was closed, skipping extraction");
        return null;
      }
      // if (error.message === "Frame with ID 0 is showing error page") {
      //   console.info("in 5 secs retrying");
      //   setTimeout(() => {
      //     chrome.runtime.sendMessage({ type: "closeAndRetry" });
      //   }, 5000);
      // }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("Failed to extract user name after", maxAttempts, "attempts");
  await chrome.storage.local.set({ userName: "" });
  return null;
}
async function closeAndRetry() {
  if (tabIdNotifications) {
    await chrome.tabs.remove(tabIdNotifications);
    tabIdNotifications = null;
    await getAnyDreamTab();
  } else {
    await getAnyDreamTab();
  }
}

async function connectWebSocket() {
  try {
    //await getAnyDreamTab();
    let { userName } = await chrome.storage.local.get("userName");
    userName = userName || "";
    if (!tabIdNotifications) {
      await getAnyDreamTab();
    }
    await chrome.scripting.executeScript({
      target: { tabId: tabIdNotifications },
      func: (userName) => {
        console.log(userName);
        let ws;
        let reconnectInterval;
        let chatInvitesInterval;

        const initializeWebSocket = () => {
          if (ws) {
            ws.close();
          }

          ws = new WebSocket("wss://ws.dream-singles.com/ws");

          const sendMessage = (ws, message) => {
            const maxRetries = 10;
            const retryDelay = 500;

            const trySendMessage = (retryCount) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
              } else if (retryCount < maxRetries) {
                setTimeout(() => {
                  trySendMessage(retryCount + 1);
                  console.log(
                    `Retrying to send message after ${retryDelay} ms`
                  );
                }, retryDelay);
              } else {
                console.error(
                  `Failed to send message after ${maxRetries} retries`
                );
                chrome.runtime.sendMessage({ type: "closeAndRetry" });
              }
            };

            trySendMessage(0);
          };

          ws.addEventListener("open", async () => {
            console.log("Connection established!");
            try {
              let response = await fetch("/members/jwtToken");
              if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
              let token = await response.text();
              sendMessage(ws, {
                type: "auth",
                connection: "invite",
                subscribe_to: ["auth-response", "chat-invites-response"],
                payload: token,
              });
            } catch (error) {
              console.error("Error fetching JWT token:", error);
            }
          });

          ws.addEventListener("message", (event) => {
            let data = JSON.parse(event.data);
            switch (data.type) {
              case "auth-response":
                if (data.success) {
                  console.log("Authentication successful");
                  if (chatInvitesInterval) {
                    clearInterval(chatInvitesInterval);
                  }
                  chatInvitesInterval = setInterval(() => {
                    sendMessage(ws, { type: "chat-invites" });
                  }, 6000);
                } else {
                  console.error("Authentication failed");
                }
                break;
              case "chat-invites-response":
                let invites = data.payload;
                let items = invites.map((invite) => ({
                  title: invite.user.displayname || "Unknown User",
                  message: `ID: ${invite.user.id}, `,
                }));
                console.log("Current chat invites:", invites);
                let ttstextChat = `You have chat invites from: ${invites
                  .map((invite) => invite.user.displayname || "Unknown User")
                  .join(", & ")}`;
                chrome.runtime.sendMessage({
                  type: "playTTS",
                  text: ttstextChat,
                });
                chrome.runtime.sendMessage({
                  type: "notificationChat",
                  title: `${userName}, New Chat Invite`,
                  message: `You have new chat invites: ${invites.length}`,
                  items: items,
                });
                break;
              default:
                console.log("Received message:", data);
            }
          });

          ws.addEventListener("close", () => {
            console.log("Connection closed");
          });

          ws.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
          });
        };

        initializeWebSocket();

        if (reconnectInterval) {
          clearInterval(reconnectInterval);
        }
        reconnectInterval = setInterval(() => {
          console.log("Reconnecting WebSocket...");
          //initializeWebSocket(); //cause problms with name in a while
          chrome.runtime.sendMessage({ type: "closeAndRetry" });
        }, 30000);
      },
      args: [userName],
    });
    console.log("WebSocket script executed");
  } catch (error) {
    console.error("Error: ", error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "closeAndRetry") {
    closeAndRetry();
  }
});
async function checkLetters() {
  try {
    let { userName } = await chrome.storage.local.get("userName");
    userName = userName || "";
    if (!tabIdNotifications) {
      await getAnyDreamTab();
    }

    await chrome.scripting.executeScript({
      target: { tabId: tabIdNotifications },
      func: (userName) => {
        const fetchAndUpdate = async () => {
          try {
            let previousCount = localStorage.getItem("previousCount");
            previousCount = previousCount ? parseInt(previousCount) : null;

            let ulElement = document.querySelector("ul.nohide");

            if (ulElement) {
              let myMessagesLink = ulElement.querySelector(
                'a[href*="/messaging/inbox"]'
              );
              if (myMessagesLink) {
                let myMessagesSpan = myMessagesLink.querySelector(".new-count");
                if (myMessagesSpan) {
                  let newCountText = myMessagesSpan.textContent.trim();
                  let newCount = parseInt(newCountText);

                  if (!isNaN(newCount)) {
                    if (previousCount === null || newCount > previousCount) {
                      console.log(`Letters: ${newCount}`);

                      let ttstextLetters = `You have ${newCount} new letters`;
                      chrome.runtime.sendMessage({
                        type: "playTTS",
                        text: ttstextLetters,
                      });
                      chrome.runtime.sendMessage({
                        type: "notificationLetters",
                        title: `${userName}, New Letters`,
                        message: `You have new letters: ${newCount}`,
                      });
                    } else {
                      console.log(`Letters: ${newCount}`);
                    }

                    localStorage.setItem("previousCount", newCount);
                  } else {
                    console.log("New value parsing error");
                  }
                } else {
                  console.log("You don't have any new letters");
                  localStorage.setItem("previousCount", "0");
                }
              } else {
                console.log("You don't have any new letters.");
              }
            } else {
              console.log("The list of ul with class 'nohide' was not found");
            }
          } catch (error) {
            console.error("Error fetching new message:", error);
          }
        };

        fetchAndUpdate();
      },
      args: [userName],
    });
    console.log("Check letters script executed");
  } catch (error) {
    console.error("Error executing check letters script:", error);
  }
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === tabIdNotifications && changeInfo.status === "complete") {
    if (tab.url === "https://www.dream-singles.com/login") {
      setTimeout(() => {
        chrome.tabs.update(tabId, {
          url: "https://www.dream-singles.com/members/",
        });
      }, 60000);
    } else {
      setTimeout(async () => {
        try {
          await connectWebSocket();
          checkLetters();
        } catch (error) {
          console.error("Error launching scripts: ", error);
        }
      }, 0);
    }
  }
});

chrome.tabs.onUpdated.addListener((e, o, t) => {
  e === messagingPageTabId &&
    "complete" === o.status &&
    t.url.startsWith(
      "https://www.dream-singles.com/members/messaging/bot/send"
    ) &&
    chrome.storage.local.get(["userSelection"], function (e) {
      if (e.userSelection) {
        1 == e.userSelection.fastMode ? clickButtonFast() : clickButton();
      }
    });
}),
  chrome.tabs.onRemoved.addListener((e) => {
    messagingPageTabId === e &&
      (clearInterval(intervalId),
      (intervalId = null),
      clearInterval(timerId),
      (timerId = null),
      (messagingPageTabId = -1));
  }),
  chrome.runtime.onMessage.addListener((e, o, t) => {
    chrome.storage.local.get(
      ["enableSounds", "chatNotificationId", "lettersNotificationId"],
      (result) => {
        if (result.enableSounds) {
          const createNotification = (
            type,
            notificationOptions,
            storageKey
          ) => {
            if (result[storageKey]) {
              chrome.notifications.clear(result[storageKey]);
            }

            chrome.notifications.create(
              notificationOptions,
              (notificationId) => {
                let updateData = {};
                updateData[storageKey] = notificationId;
                chrome.storage.local.set(updateData);

                chrome.notifications.onClicked.addListener((clickedId) => {
                  if (clickedId === notificationId) {
                    focusBrowserWindow();
                  }
                });
              }
            );
          };

          if (e.type === "notificationChat") {
            createNotification(
              "chat",
              {
                type: "list",
                iconUrl: "Images/icon.png",
                title: e.title,
                message: e.message,
                silent: false,
                priority: 2,
                items: e.items,
                requireInteraction: true,
              },
              "chatNotificationId"
            );
          } else if (e.type === "notificationLetters") {
            createNotification(
              "letters",
              {
                type: "basic",
                iconUrl: "Images/icon.png",
                title: e.title,
                message: e.message,
                silent: false,
                priority: 2,
                requireInteraction: true,
              },
              "lettersNotificationId"
            );
          }
        }
      }
    );
  });

function focusBrowserWindow() {
  chrome.windows.getCurrent({ populate: true }, (window) => {
    chrome.windows.update(window.id, { focused: true });
    chrome.tabs.query({ active: true, windowId: window.id }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      }
    });
  });
}

chrome.notifications.onClicked.addListener((notificationId) => {
  focusBrowserWindow();
});

function processTTSQueue() {
  if (ttsQueue.length > 0) {
    if (isSpeaking) {
      chrome.tts.stop();
      isSpeaking = false;
    }
    isSpeaking = true;
    const text = ttsQueue.shift();
    chrome.tts.speak(text, {
      voiceName: "Google UK English Male",
      lang: "en-GB",
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8,
      onEvent: function (event) {
        if (event.type === "end" || event.type === "error") {
          isSpeaking = false;
          processTTSQueue();
        }
        if (event.type === "error") {
          console.error("Error during TTS: " + event.errorMessage);
        }
      },
    });
  }
}

function playTTS(text) {
  const messageWithName = userName ? `${userName}, ${text}` : text;
  ttsQueue.push(messageWithName);
  processTTSQueue();
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "playTTS") {
    playTTS(message.text);
  }
});
