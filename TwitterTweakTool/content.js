function removeAllPromotionTweet(){
  let targets = document.evaluate("//article[child::div//*[name()='svg']/*[name()='g']/*[contains(@d, 'M20.75')]]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var i = 0
  while(true){
    let element = targets.snapshotItem(i++);
    if(element == undefined){
      break;
    }
    //element.style.display="none";
    element.style.opacity=0.1;
  }
}

function forceNewestTweetApply(){
  let menuButton = document.evaluate("//div[@aria-label='トップツイートがオンになります']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)
  if (menuButton == null) { return; }
  menuButton.click()
  setTimeout(()=>{
    document.evaluate("//span[text()='最新ツイート表示に切り替える']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click()
  }, 500)
}

let observer = new MutationObserver(e => {
  removeAllPromotionTweet();
})

setTimeout(()=>{
  observer.observe(document.body, {childList: true, subtree: true});
  removeAllPromotionTweet();
}, 2000);

setTimeout(forceNewestTweetApply, 5000);

// keydown でトリガーして keyup で遷移しないと遷移した直後に keydown が発生して1ページめくられてしまう(´・ω・`)
var NEXT_HREF = undefined;
document.body.addEventListener('keyup', event => {
  if(!NEXT_HREF){ return; }
  let tmpHref = NEXT_HREF;
  NEXT_HREF = undefined;
  if(event?.key == "ArrowRight"){
    tmpHref.scrollIntoView(true);
  }
  if(event?.key == "ArrowLeft"){
    tmpHref.scrollIntoView(false);
  }
  tmpHref.click();
});

function CheckAndSetNextPhotoHref(){
  // 次の画像が無くて(次の画像へのボタンが表示されていないという確認)
  if(document.evaluate("//div[@aria-label and @role='button']//div[@dir='auto']/*[name()='svg']/*[name()='g']/*[contains(@d,'M19.707')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)){
    return;
  }
  // 画像へのリンクのリストを取り出して
  let imageUrlXPATH = "//div[@aria-label]/div/div//article[@role='article']//a[contains(@href,'/photo/')]"
  let imageUrlSnapShots = document.evaluate(imageUrlXPATH, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var nextPhotoElement;
  // それらのリンクの中には今表示しているURLの物があるはずで、その次の物が目指すElementのはず
  let currentUrl = location.href;
  if(currentUrl){
    for(var i = 0; i < imageUrlSnapShots.snapshotLength; i = i + 1){
      let href = imageUrlSnapShots.snapshotItem(i);
      if(href === undefined){ break; }
      let hrefString = href.href;
      if(currentUrl.indexOf(hrefString) >= 0){
        nextPhotoElement = imageUrlSnapShots.snapshotItem(i+1);
        break;
      }
    }
  }
  if(!nextPhotoElement){
    return;
  }
  NEXT_HREF = nextPhotoElement;
}
function CheckAndSetPreviousPhotoHref(){
  // 前の画像が無くて
  if(document.evaluate("//div[@aria-modal='true']//div[@aria-label and @role='button']/div[@dir='auto']/*[name()='svg']/*[name()='g']/*[contains(@d,'M20 11H7')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)){
    return;
  }
  // 画像へのリンクのリストを取り出して
  let imageUrlXPATH = "//div[@aria-label]/div/div//article[@role='article']//a[contains(@href,'/photo/')]"
  let imageUrlSnapShots = document.evaluate(imageUrlXPATH, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var previousElement;
  // それらのリンクの中には今表示しているURLの物があるはずで、その前の物が目指すElementのはず
  let currentUrl = location.href;
  if(currentUrl){
    for(var i = imageUrlSnapShots.snapshotLength - 1; i >= 1; i = i - 1){
      let href = imageUrlSnapShots.snapshotItem(i);
      if(href === undefined){ break; }
      let hrefString = href.href;
      if(currentUrl.indexOf(hrefString) >= 0){
        nextPhotoElement = imageUrlSnapShots.snapshotItem(i+1);
        previousElement = imageUrlSnapShots.snapshotItem(i-1);
        break;
      }
    }
  }
  if(!previousElement){
    return;
  }
  NEXT_HREF = previousElement;
}

document.body.addEventListener('keydown', event => {
  // → キーか ← キーが押されて
  //console.log("keydown", event?.key);
  if(event?.key != "ArrowRight" && event?.key != "ArrowLeft"){
    return;
  }
  // 画像を開いているなら
  if(!location.href?.match(/\/status\/[0-9]+\/photo\//)){
    return;
  }
  if(event?.key == "ArrowRight"){
    CheckAndSetNextPhotoHref();
  }
  if(event?.key == "ArrowLeft"){
    CheckAndSetPreviousPhotoHref();
  }
});
