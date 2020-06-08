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
  tmpHref.click();
});

function CheckAndSetNextPhotoHref(){
  // 次の画像が無くて
  if(document.evaluate("//div[@aria-label and @role='button']//div[@dir='auto']/*[name()='svg']/*[name()='g']/*[contains(@d,'M19.707')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)){
    return;
  }
  // 次のtweetがあって
  let nextPhotoElement = document.evaluate("//div[@aria-label]/div[@style]/div[@style]/div[not(@class) and descendant::article//a[contains(@href,'/status/') and contains(@href,'/photo/')] and preceding-sibling::div[descendant::a[contains(@href,'/retweets')]]][1]//a[contains(@href,'/status/') and contains(@href,'/photo/1')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
  if(!nextPhotoElement){
    return;
  }
  console.log("ArrowRight hit and displaying photo and no next photo.", nextPhotoElement);
  NEXT_HREF = nextPhotoElement;
}
function CheckAndSetPreviousPhotoHref(){
  // 前の画像が無くて
  if(document.evaluate("//div[@aria-modal='true']//div[@aria-label and @role='button']/div[@dir='auto']/*[name()='svg']/*[name()='g']/*[contains(@d,'M20 11H7')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0)){
    return;
  }
  // 前のtweetがあって
  let previousResult = document.evaluate("//div[@aria-label]/div[@style]/div[@style]/div[not(@class) and descendant::article//a[contains(@href,'/status/') and contains(@href,'/photo/')] and following-sibling::div[descendant::a[contains(@href,'/retweets')]]]//a[contains(@href,'/status/') and contains(@href,'/photo/')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(!previousResult){
    return;
  }
  let count = previousResult.snapshotLength;
  if(count <= 0){
    return;
  }
  let previousElement = previousResult.snapshotItem(count - 1);
  if(!previousElement){
    return;
  }
  console.log("ArrowRight hit and displaying photo and no previous photo.", previousElement);
  NEXT_HREF = previousElement;
}

document.body.addEventListener('keydown', event => {
  // → キーか ← キーが押されて
  console.log("keydown", event?.key);
  if(event?.key != "ArrowRight" && event?.key != "ArrowLeft"){
    return;
  }
  // 画像を開いているなら
  if(!location.href?.match(/\/status\/[0-9]+\/photo\//)){
    return;
  }
  if(event?.key == "ArrowRight"){
    console.log("check next");
    CheckAndSetNextPhotoHref();
  }
  if(event?.key == "ArrowLeft"){
    console.log("check previous");
    CheckAndSetPreviousPhotoHref();
  }
});
