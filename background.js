importScripts("ExtPay.js");
const extpay = ExtPay("dreamauto");
let tabId;
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
      const i = ["❤️", "🧡"],
        r = ["🥺"],
        s = ["🤖", "💔"],
        l = ["💓", "💟", "❤️"],
        u = ["😇", "🥳", "😛"],
        h = ["😞"];
      let d = [
          "What's the most thoughtful gift you've ever received? What made it so meaningful?",
          "Tell me about your most fun trip ever.",
        ],
        c = [
          "I would say let's play hide-and-seek on video chat but with all this dust, you'd easily track my footprints! Darn!",
        ],
        y = [
          "It's a date! Can't wait to see your face on my screen tonight. Now to pick out the perfect outfit...😍",
        ],
        m = [
          "WILL OUR LIPS MEET IN THAT SWEET KISS? ",
          "WILL YOU LET ME HUG YOU THE FIRST TIME WE MEET?",
        ],
        g = [
          "Thinking happy thoughts and hoping your day is as amazing as you are!",
          "Even though we are not together I care about you deeply.",
        ],
        w = [
          "I trust and value you. Theres been something weighing heavily on me that Id like to confide in you about when we can speak privately.",
          "I have something important I want to talk to you about. Do you have some time to chat?",
        ],
        p = ["Are you in a good mood now?"],
        f = [
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
let lastTelegramMessage = "";
let lastTelegramMessageTime = 0;
const TELEGRAM_MESSAGE_COOLDOWN = 30000;

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

            let response = await fetch("https://www.dream-singles.com/members");
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);

            let text = await response.text();
            let doc = new DOMParser().parseFromString(text, "text/html");

            let ulElement = doc.querySelector("ul.nohide");

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
                console.log("You don't have any new letters");
              }
            } else {
              console.log("The list of ul with class 'nohide' was not found");
            }
          } catch (error) {
            console.error("Error fetching new count element:", error);
            if (error.message === "Failed to fetch") {
              console.info("Retrying to fetch");
              fetchAndUpdate();
            }
          }
        };

        fetchAndUpdate();
        setInterval(fetchAndUpdate, 8000);
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
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "testTelegramNotification") {
      sendTelegramMessage(
        message.botToken,
        message.chatId,
        "Notifications for Telegram are set up"
      ).then(sendResponse);
      return true;
    } else if (message.action === "updateNotificationState") {
      chrome.storage.local.set({
        updateNotificationState: message.enableTelegram,
      });
    }
  });
chrome.runtime.onMessage.addListener((e, o, t) => {
  chrome.storage.local.get(
    [
      "enableSounds",
      "chatNotificationId",
      "lettersNotificationId",
      "updateNotificationState",
      "botToken",
      "chatId",
    ],
    async (result) => {
      if (result.enableSounds) {
        const createNotification = async (
          type,
          notificationOptions,
          storageKey
        ) => {
          if (result[storageKey]) {
            chrome.notifications.clear(result[storageKey]);
          }

          chrome.notifications.create(notificationOptions, (notificationId) => {
            let updateData = {};
            updateData[storageKey] = notificationId;
            chrome.storage.local.set(updateData);

            chrome.notifications.onClicked.addListener((clickedId) => {
              if (clickedId === notificationId) {
                focusBrowserWindow();
              }
            });
          });

          if (
            result.updateNotificationState &&
            result.botToken &&
            result.chatId
          ) {
            let telegramMessage = `${notificationOptions.title}\n${notificationOptions.message}`;
            if (notificationOptions.items) {
              telegramMessage += "\n";
              notificationOptions.items.forEach((item) => {
                telegramMessage += `\n• ${item.title}: ${item.message}`;
              });
            }
            await sendTelegramMessage(
              result.botToken,
              result.chatId,
              telegramMessage
            );
          }
        };

        if (e.type === "notificationChat") {
          await createNotification(
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
          await createNotification(
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
async function sendTelegramMessage(botToken, chatId, message) {
  const currentTime = Date.now();

  if (
    message === lastTelegramMessage &&
    currentTime - lastTelegramMessageTime < TELEGRAM_MESSAGE_COOLDOWN
  ) {
    console.log("Skipping Telegram message due to cooldown");
    return { success: false, error: "Message cooldown" };
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.ok) {
      console.log("Message sent to Telegram successfully");
      lastTelegramMessage = message;
      lastTelegramMessageTime = currentTime;
      return { success: true };
    } else {
      console.error("Failed to send message to Telegram:", data.description);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return { success: false, error: error.message };
  }
}
