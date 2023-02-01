TwitterTweakTool は、Twitter を少しだけ使いやすくする chrome extension です。

具体的には以下のような事をします。

1. 広告 Tweet を薄くすることで目立ちにくくします
2. https://twitter.com を開いた時に「おすすめ」状態になっていた場合には強制的に「フォロー中」状態に戻します
3. 複数の画像を連続した Tweet で投稿されているような場合に、個々の Tweet の最後の画像を表示している時にカーソルキーの「→」を押す事で次の Tweet の最初の画像が開くようにします

これらの機能は不定期に追加されます。
そのうちオプションで ON/OFF の設定をつけるかもしれません。

[chrome ウェブストアで公開しています](https://chrome.google.com/webstore/detail/twittertweaktool/lomiajbdeofimbjfahdjjlkedkfgnfpg)

## 免責事項(?)

このツールは Twitter の HTML の構造が変わると途端に動かなくなるような作り方がされています。
そして、Twitter は不定期に HTML の構造が変わるような変更がなされます。
そのため、時々動かなくなると思います。そのような時はのんびり待つか、github 側 で issue を立てるか、github 側 で pull request を出すなどしていただけますと幸いです。

## 履歴

Version 1.3.6

mobile.twitter.com にも対応するようにした。
個別の Tweet から twitter.com/home に戻った時などに、「フォロー中」に変更されない場合があったので「フォロー中」に変更する部分の検出頻度を変えた。
