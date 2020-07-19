# テキスト解析Webアプリ

Yahooのapiを利用し、入力した文字列に対して形態素解析した結果を出力するwebアプリのプロジェクトです。  
Web開発の練習、APIを利用した開発の経験を目的に作成しました。  

## 機能

- 文字列を形態素解析し、その結果を表示する機能
- 文字列を形態素解析し、集計して頻度を表示する機能
- 文字列の係り受け解析をAPIで実行し、修飾・被修飾の情報を表示する機能
- 文字列の係り受け解析をAPIで実行し、評価と評価対象を抽出する機能

## 使用技術

- 仮想環境(pipenv)
- Webフレームワーク(Responder:Pythonライブラリ)
- WebAPI([Yahooのテキスト解析API](https://developer.yahoo.co.jp/webapi/jlp/ "Yahooのテキスト解析API"))
- 非同期通信(Ajax, jQuery:JavaScriptライブラリ)

## 利用方法

開発には仮想環境であるpipenvを使用しています。`pipenv install`を実行することでPipfileから開発時の環境を再現できます。

```Bash:pipenvのインストールと環境の再現
$ pip install pipenv
$ pipenv install
```

WebAPIを利用するために、YahooのアプリケーションIDが必要になります。お持ちでない方は、Yahoo公式[ご利用ガイド](https://developer.yahoo.co.jp/start/ "ご利用ガイド")を参考に作成してください。

アプリを動かすために、環境変数にアプリケーションIDを設定する必要があります。プロジェクトのルートディレクトリに`.env`ファイルを作成し、以下のようにアプリケーションIDを記述してください。

```
# .env ファイル
APPID = <自分のアプリケーションID>
```

環境が整えられたら、app.pyを実行してサーバを起動できます。

```Bash:簡易サーバ起動
$ pipenv run python app.py
Loading .env environment variables…
INFO:     Started server process [18730]
INFO:     Uvicorn running on http://127.0.0.1:8080 (Press CTRL+C to quit)
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

コマンドに表示されたリンク(http://127.0.0.1:8080) に移動するとindexページが表示されます。

![indexページ](https://user-images.githubusercontent.com/67271461/87156305-72fb3d80-c2f7-11ea-93f2-47ba2877cbcd.png)

indexページには、それぞれの機能が実装されたサイトのリンクを張っています。
- 形態素解析の結果を表示する`segmenter.html`
- 形態素解析の結果から類似度計算を行う`similarity_calculator.html`(現在実装途中)
- 係り受け解析の結果から修飾元・修飾先の情報を表示する`parser.html`
- 係り受け解析の結果から評価表現を抽出し表示する`extract_evaluation.html`

### 形態素解析の結果表示機能

segmenter.htmlでは、テキスト欄に文字列を入力し、\[解析\]ボタンを押すことで、テキストが形態素解析された結果が画面に表示されます。オプションで\[原形\]などのチェックボックスを設定すると、設定した品詞のみ表示されます。  
Ajax通信を行なっているのでページ遷移をせず結果が表示されます。

![形態素解析結果表示](https://user-images.githubusercontent.com/67271461/87157117-b0ac9600-c2f8-11ea-9634-509e4f5270d3.png)

\[集計\]ボタンを押すと、各単語の集計数が表示されます。
Ajax通信を行なっているのでページ遷移をせず結果が表示されます。

![形態素集計結果表示](https://user-images.githubusercontent.com/67271461/87158317-822fba80-c2fa-11ea-87f7-c18e4a7a5d09.png)

### 日本語係り受け解析の結果表示機能

parser.htmlでは、テキスト欄に文字列を入力し、\[解析\]ボタンを押すことで、テキストが係り受け解析され、修飾元と修飾先が画面に表示されます。  
こちらもAjax通信を行なっているのでページ遷移をせず結果が表示されます。

![係り受け解析結果表示](https://user-images.githubusercontent.com/67271461/87157657-88716700-c2f9-11ea-94f0-76c464223735.png)

### 評価表現と評価対象の表示機能

extract_evaluation.htmlでは、テキスト欄に文字列を入力し、\[解析\]ボタンを押すことで、テキストが係り受け解析され、その結果により評価と評価対象を抽出して画面に表示されます。  
評価である感情や意見は、形容詞と形容動詞として判定しています。評価の対象は、修飾先を評価とする文節の名詞を対象としています。  
グラフの描画には、javascriptライブラリのd3.jsを利用しています。



## TODO
- [ ] 形態素解析結果から類似度計算を行い、入力文字列間の関係性を数値化する機能の実装
- [ ] 形態素解析結果から共起行列を作成する機能の実装
- [ ] 係り受け解析結果から関係を抽出する機能の実装
