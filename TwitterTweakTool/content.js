function removeAllPromotionTweet() {
  let targets = document.evaluate(
    "//article[child::div//*[name()='svg']/*[name()='g']/*[contains(@d, 'M19.498')]]",
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var i = 0;
  while (true) {
    let element = targets.snapshotItem(i++);
    if (element == undefined) {
      break;
    }
    //element.style.display="none";
    element.style.opacity = 0.1;
  }
}

let currentUrl = "";
function forceNewestTweetApply() {
  let nowUrl = location.href;
  if (nowUrl == currentUrl) {
    return;
  }
  if (
    nowUrl != "https://twitter.com/home" &&
    nowUrl != "https://mobile.twitter.com/home"
  ) {
    currentUrl = nowUrl;
    return;
  }
  let followTab = document
    .evaluate(
      "//div[@role='tablist']/div[@role='presentation']/a/div/div/div",
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )
    .snapshotItem(1);
  if (followTab) {
    let tabColor = window
      .getComputedStyle(followTab)
      .getPropertyValue("background-color");
    // 二個目のが選択されているのなら rgba(0, 0, 0, 0) ではないので 0, 0, 0 はみつからないはず
    if (tabColor.indexOf("0, 0, 0") < 0) {
      return;
    }
    followTab.click();
    currentUrl = nowUrl;
  }
}

function ClickMorePostContent() {
  // この xpath はかなり怪しいので順次直さないと多分だめ。
  let targetElement = document.evaluate("//div[@data-testid='cellInnerDiv']//div[@role='button' and descendant::span[contains(text(),'ポストをさらに表示')]]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)?.snapshotItem(0);
  if (targetElement) {
    console.log("TwitterTweakTool: click element:", targetElement);
    targetElement.click();
  }
}

let observer = new MutationObserver((e) => {
  removeAllPromotionTweet();
  forceNewestTweetApply();
  ClickMorePostContent();
});

setTimeout(() => {
  observer.observe(document.body, { childList: true, subtree: true });
  removeAllPromotionTweet();
}, 2000);

// keydown でトリガーして keyup で遷移しないと遷移した直後に keydown が発生して1ページめくられてしまう(´・ω・`)
var NEXT_HREF = undefined;
document.body.addEventListener("keyup", (event) => {
  if (!NEXT_HREF) {
    return;
  }
  let tmpHref = NEXT_HREF;
  NEXT_HREF = undefined;
  if (event?.key == "ArrowRight") {
    tmpHref.scrollIntoView(true);
  }
  if (event?.key == "ArrowLeft") {
    tmpHref.scrollIntoView(false);
  }
  tmpHref.click();
});

function CheckAndSetNextPhotoHref() {
  // 次の画像が無くて(次の画像へのボタンが表示されていないという確認)
  if (
    document
      .evaluate(
        "//div[@aria-labelledby='modal-header']//div[@data-testid='Carousel-NavRight']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      )
      .snapshotItem(0)
  ) {
    return;
  }
  // 画像へのリンクのリストを取り出して
  let imageUrlXPATH =
    "//div[@aria-label]/div/div//article[@role='article']//a[contains(@href,'/photo/')]";
  let imageUrlSnapShots = document.evaluate(
    imageUrlXPATH,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var nextPhotoElement;
  // それらのリンクの中には今表示しているURLの物があるはずで、その次の物が目指すElementのはず
  let currentUrl = location.href;
  if (currentUrl) {
    for (var i = 0; i < imageUrlSnapShots.snapshotLength; i = i + 1) {
      let href = imageUrlSnapShots.snapshotItem(i);
      if (href === undefined) {
        break;
      }
      let hrefString = href.href;
      if (currentUrl.indexOf(hrefString) >= 0) {
        nextPhotoElement = imageUrlSnapShots.snapshotItem(i + 1);
        break;
      }
    }
  }
  if (!nextPhotoElement) {
    return;
  }
  NEXT_HREF = nextPhotoElement;
}
function CheckAndSetPreviousPhotoHref() {
  // 前の画像が無くて
  if (
    document
      .evaluate(
        "//div[@aria-labelledby='modal-header']//div[@data-testid='Carousel-NavLeft']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      )
      .snapshotItem(0)
  ) {
    return;
  }
  // 画像へのリンクのリストを取り出して
  let imageUrlXPATH =
    "//div[@aria-label]/div/div//article[@role='article']//a[contains(@href,'/photo/')]";
  let imageUrlSnapShots = document.evaluate(
    imageUrlXPATH,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var previousElement;
  // それらのリンクの中には今表示しているURLの物があるはずで、その前の物が目指すElementのはず
  let currentUrl = location.href;
  if (currentUrl) {
    for (var i = imageUrlSnapShots.snapshotLength - 1; i >= 1; i = i - 1) {
      let href = imageUrlSnapShots.snapshotItem(i);
      if (href === undefined) {
        break;
      }
      let hrefString = href.href;
      if (currentUrl.indexOf(hrefString) >= 0) {
        nextPhotoElement = imageUrlSnapShots.snapshotItem(i + 1);
        previousElement = imageUrlSnapShots.snapshotItem(i - 1);
        break;
      }
    }
  }
  if (!previousElement) {
    return;
  }
  NEXT_HREF = previousElement;
}

document.body.addEventListener("keydown", (event) => {
  // → キーか ← キーが押されて
  //console.log("keydown", event?.key);
  if (event?.key != "ArrowRight" && event?.key != "ArrowLeft") {
    return;
  }
  // 画像を開いているなら
  if (!location.href?.match(/\/status\/[0-9]+\/photo\//)) {
    return;
  }
  if (event?.key == "ArrowRight") {
    CheckAndSetNextPhotoHref();
  }
  if (event?.key == "ArrowLeft") {
    CheckAndSetPreviousPhotoHref();
  }
});
