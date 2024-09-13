const openButton = document.getElementById("open-button"),
  clickButton = document.getElementById("click-button");
function saveUserSelection() {
  let e = {};
  [
    "onlineOnly",
    "offlineOnly",
    "admirers",
    "favorites",
    "contacts",
    "newGuys",
    "fastMode",
  ].forEach((t) => {
    let n = document.querySelector(`input[name='${t}']`);
    e[t] = n.checked;
  }),
    chrome.storage.local.set({ userSelection: e }, function () {
      console.log("User selection is saved.");
    });
}
function loadUserSelection() {
  chrome.storage.local.get(["userSelection"], function (e) {
    if (e.userSelection) {
      let t = e.userSelection;
      for (let e in t) {
        document.querySelector(`input[name='${e}']`).checked = t[e];
      }
    }
  });
}
document
  .querySelector("input[name='onlineOnly']")
  .addEventListener("change", saveUserSelection),
  document
    .querySelector("input[name='offlineOnly']")
    .addEventListener("change", saveUserSelection),
  document
    .querySelector("input[name='favorites']")
    .addEventListener("change", saveUserSelection),
  document
    .querySelector("input[name='admirers']")
    .addEventListener("change", saveUserSelection),
  document
    .querySelector("input[name='contacts']")
    .addEventListener("change", saveUserSelection),
  document
    .querySelector("input[name='newGuys']")
    .addEventListener("change", saveUserSelection),
  document
    .querySelector("input[name='fastMode']")
    .addEventListener("change", saveUserSelection),
  chrome.tabs.query(
    { url: "https://www.dream-singles.com/members/messaging/bot/send" },
    (e) => {
      e.length > 0 && clickButton.removeAttribute("disabled");
    }
  ),
  loadUserSelection(),
  chrome.storage.local.get(
    { openButtonState: !1, clickButtonState: !1 },
    (e) => {
      e.openButtonState,
        (openButton.innerText = "LetterBot"),
        e.clickButtonState
          ? (clickButton.innerText = "Stop")
          : (clickButton.innerText = "Start");
    }
  ),
  openButton.addEventListener("click", () => {
    "Open Tab" === openButton.innerText
      ? chrome.tabs.create(
          {
            url: "https://www.dream-singles.com/members/messaging/bot/send",
            active: true,
            pinned: true,
            index: 0,
          },
          (e) => {
            chrome.storage.local.set({ openButtonState: !0 }),
              (openButton.innerText = "LetterBot");
          }
        )
      : chrome.tabs.query(
          { url: "https://www.dream-singles.com/members/messaging/bot/send" },
          (e) => {
            e.length > 0
              ? chrome.tabs.update(e[0].id, { pinned: true, active: true })
              : chrome.tabs.create({
                  url: "https://www.dream-singles.com/members/messaging/bot/send",
                  active: true,
                  pinned: true,
                  index: 0,
                });
          }
        );
  }),
  clickButton.addEventListener("click", () => {
    "Start" === clickButton.innerText
      ? (chrome.storage.local.set({ clickButtonState: !0 }),
        (clickButton.innerText = "Stop"),
        chrome.runtime.sendMessage({ action: "startSender" }),
        chrome.tabs.query(
          { url: "https://www.dream-singles.com/members/messaging/bot/send" },
          (e) => {
            e.length > 0
              ? chrome.tabs.update(e[0].id, { pinned: true, active: false })
              : chrome.tabs.create({
                  url: "https://www.dream-singles.com/members/messaging/bot/send",
                  pinned: true,
                  active: false,
                  index: 0,
                });
          }
        ))
      : (chrome.storage.local.set({ clickButtonState: !1 }),
        (clickButton.innerText = "Start"),
        chrome.runtime.sendMessage({ action: "stopSender" }));
  }),
  chrome.storage.onChanged.addListener((e) => {
    e.openButtonState &&
      (e.openButtonState.newValue, (openButton.innerText = "LetterBot")),
      e.clickButtonState &&
        (e.clickButtonState.newValue
          ? (clickButton.innerText = "Stop")
          : (clickButton.innerText = "Start"));
  });
