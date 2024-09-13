const radioButton = document.getElementById("enableRadio");
const genreMenu = document.querySelector(".genre-menu");
const genreItems = document.querySelectorAll(".genre-item");

function toggleMenu() {
  const isOpen = genreMenu.style.display === "block";
  genreMenu.style.display = isOpen ? "none" : "block";
  radioButton.classList.toggle("active", !isOpen);

  if (!isOpen) {
    positionMenuItems();
  }
}

function positionMenuItems() {
  const radius = 80;
  genreItems.forEach((item, index) => {
    const angle = (index / (genreItems.length - 1)) * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    item.style.left = `${152 + x}px`;
    item.style.top = `${100 - y}px`;
  });
}

radioButton.addEventListener("click", toggleMenu);

document.addEventListener("click", (event) => {
  if (!genreMenu.contains(event.target) && event.target !== radioButton) {
    genreMenu.style.display = "none";
    radioButton.classList.remove("active");
  }
});

function getRandomLink(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function openRandomLink(list) {
  const randomLink = getRandomLink(list);
  window.open(randomLink, "_blank");
}

genreItems.forEach((item) => {
  item.addEventListener("click", () => {
    console.log(`Выбран жанр: ${item.textContent}`);
    switch (item.id) {
      case "rockButton":
        openRandomLink(rockList);
        break;
      case "popButton":
        openRandomLink(popList);
        break;
      case "jazzButton":
        openRandomLink(jazzList);
        break;
      case "clasicButton":
        openRandomLink(clasicList);
        break;
      case "bluesButton":
        openRandomLink(bluesList);
        break;
      case "hiphopButton":
        openRandomLink(hiphopList);
        break;
    }
    toggleMenu();
  });
});

let rockList = [
  "https://music.youtube.com/watch?v=tHOK87ozcho&list=PL6OSYNU8SJq0KOw4-J6zNPsGTceEGXqD9",
  "https://music.youtube.com/watch?v=ikFFVfObwss&list=PLsKQAkUM8-3m5EwT0zR_CDYxlFeNbcc9P",
  "https://music.youtube.com/watch?v=SrGSt5eDt9o&list=PLsKQAkUM8-3kbLOUMhy_am1o4ueIaoGIo",
  "https://music.youtube.com/watch?v=170sceOWWXc&list=PLsKQAkUM8-3kU8xFm7zXFPhqaHSxpKd-j",
  "https://music.youtube.com/watch?v=egMWlD3fLJ8&list=PLsKQAkUM8-3kEo2CpET7u083gQiFAe7kd",
  "https://music.youtube.com/watch?v=IZWC468pf_w&list=PLsKQAkUM8-3k9nP1reGYwENiQs6eAieKg",
  "https://music.youtube.com/watch?v=d11xns8lE4w&list=PLsKQAkUM8-3nutZ58VEEAgU7rj4ARV0Z4",
  "https://music.youtube.com/watch?v=ZEMBDKMtHqM&list=PLsKQAkUM8-3m6UjBgHKIH2lyGxrXDcGEu",
  "https://music.youtube.com/watch?v=Smp6AepJIhM&list=PLsKQAkUM8-3n43YkVwdPDEjp2aonLo5tj",
  "https://music.youtube.com/watch?v=d-XkRQe4-5E&list=PLsKQAkUM8-3mH1E5LxX1HqXoOkbSD132E",
  "https://music.youtube.com/watch?v=fZZHbVXPlF0&list=PLsKQAkUM8-3nBvOABmjgU9Zq2LtGu5xA4",
  "https://music.youtube.com/watch?v=s0KYobrv-NM&list=PLsKQAkUM8-3lbg5rx8aMBCtgSG6xOC_m0",
];

let jazzList = [
  "https://music.youtube.com/watch?v=ZZcuSBouhVA&list=PL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=kWJCIGtRGHQ&list=RDAMPLPL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=sU-_MLxHpmY&list=RDATgy",
  "https://music.youtube.com/watch?v=QRsI6nwAwio&list=RDAMPLPL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=aBOv6lhLxbA&list=RDAMPLPL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=frYLvC0mM50&list=RDAMPLPL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=nJ-i3i2B9O0&list=RDAMPLPL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=Zq3HDQr7xWw&list=RDAMPLPL8F6B0753B2CCA128",
  "https://music.youtube.com/watch?v=t8orrJsbabY&list=RDAMPLPL8F6B0753B2CCA128",
];

let popList = [
  "https://music.youtube.com/watch?v=XXYlFuWEuKI&list=PLsKQAkUM8-3n6AZ2oN9xn4r36dCI6FADk",
  "https://music.youtube.com/watch?v=zuaBRqUBhyw&list=PLsKQAkUM8-3nluxjXzHy1dNZTNPOYKRws",
  "https://music.youtube.com/watch?v=oLeROuCMwj8&list=PLsKQAkUM8-3mQq1ztY8_rHsblDAUN0L9-",
  "https://music.youtube.com/watch?v=cnRB2CgUpSw&list=PLsKQAkUM8-3njci3UMMkV82pAJwm9qkjy",
  "https://music.youtube.com/watch?v=C4qJ4y-rDgs&list=PLsKQAkUM8-3mM8XsmTFZVJDoLQfKt1qRs",
  "https://music.youtube.com/watch?v=Bn4a3xDQJYY&list=PLsKQAkUM8-3lwC4y8evJ6CBuyxvf1ZArK",
  "https://music.youtube.com/watch?v=GB33bhXS3RU&list=PLsKQAkUM8-3k2Veojv6TsEbbYIJUzoIfK",
  "https://music.youtube.com/watch?v=hfaRSiuaXUk&list=PLsKQAkUM8-3kVjtp_jQ3HfWNuHxfg_kBw",
  "https://music.youtube.com/watch?v=eBodSrMv-tk&list=PLsKQAkUM8-3lm4SBgFY3LgA-L8s1FmjyK",
  "https://music.youtube.com/watch?v=XPDp2l2tX-o&list=PLsKQAkUM8-3n6ZVJBkU_y_wr90o2-vM8b",
  "https://music.youtube.com/watch?v=EX20caoPdwU&list=PLsKQAkUM8-3ndtmaCOhcmJMcbH_eoFbBA",
  "https://music.youtube.com/watch?v=UyebyTbqFMY&list=PLsKQAkUM8-3nqSSFT_u9WTMgkFD0xZakx",
  "https://music.youtube.com/watch?v=F3T7n2DaKvc&list=PLsKQAkUM8-3m4KN76dtBVahyN63m-e3Hb",
];

let bluesList = [
  "https://music.youtube.com/watch?v=u9sq3ME0JHQ&list=PLsKQAkUM8-3nFqeqGi6ezfHVBQ7SwEGEl",
  "https://music.youtube.com/watch?v=VOA_9M5ezkk&list=PLsKQAkUM8-3l7Vgj-E8NkAo0RAdpbJ5xw",
  "https://music.youtube.com/watch?v=QS33LNHXpXM&list=RDAMPLPLsKQAkUM8-3l7Vgj-E8NkAo0RAdpbJ5xw",
  "https://music.youtube.com/watch?v=diXGcCGzb9c&list=RDAMPLPLsKQAkUM8-3l7Vgj-E8NkAo0RAdpbJ5xw",
  "https://music.youtube.com/watch?v=rQPdqw1xQHk&list=RDAMPLPLsKQAkUM8-3nFqeqGi6ezfHVBQ7SwEGEl",
  "https://music.youtube.com/watch?v=tcHBRMg2JN4&list=RDAMPLPLsKQAkUM8-3nFqeqGi6ezfHVBQ7SwEGEl",
];

let hiphopList = [
  "https://music.youtube.com/watch?v=_VXUiAJi5KY&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=-PAudyxJvX0&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=xIQpLlYC8xA&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=UTgvEg78TZ8&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=dcp4iB7ePQo&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=vdvNDZxG6oE&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=7RtvxKtXBao&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=638qufyPYJg&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=FMUcfbpcIeg&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=Psk3DdgziFU&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=TAfCf8mynr8&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
  "https://music.youtube.com/watch?v=k0LcQk3PYHA&list=RDAMPLPLmXxqSJJq-yXvmRMuHu7vd2XdJEUgsr33",
];

let clasicList = [
  "https://music.youtube.com/watch?v=P2l0lbn5TVg&list=PL2788304DC59DBEB4",
  "https://music.youtube.com/watch?v=2HoB8RqB2ek&list=RDAMPLPL2788304DC59DBEB4",
  "https://music.youtube.com/watch?v=gIosI9SQfNY&list=RDAMPLPL2788304DC59DBEB4",
  "https://music.youtube.com/watch?v=zYTBRRLu1Fk&list=RDAMPLPL2788304DC59DBEB4",
  "https://music.youtube.com/watch?v=drEBY-fNzd4&list=RDAMPLPL2788304DC59DBEB4",
];
