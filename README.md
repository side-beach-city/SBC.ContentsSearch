# SBC.ContentsSearch
SBC.コンテンツサーチツール(Google Apps Script用)

最新リリースはGithubのリンク欄から見られます。

## 開発方法

`clasp`を使用しています。あらかじめ以下のコマンドを実行し、`clasp`をインストールしてください(Windowsの場合)

```powershell
winget install OpenJS.NodeJS # NodeJSをインストール済みであれば実行不要
npm install @google/clasp -g
npm install
```

現状は高見の環境で動くように設定しています。`clasp`のpush先などは適宜調整してください。

### `clasp push`

HTMLのコンパイル(CSSとJSの組み込み)が必要になるため。直接コマンドは呼び出さないようにしてください。

その代わり`./push.ps1`ファイルを実行します。

## ご自身のポッドキャストなどのサーチツールに使いたい

`src`配下のファイルにRSSなどの読み込み処理が入っています。変更して使用してください。

なお、タイトルから概要文を切り出す正規表現はindex.jsの冒頭にありますので必要に応じて変更してください。
