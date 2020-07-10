## テキスト解析Webアプリ

Yahooのapiを利用し、入力した文字列に対して形態素解析した結果を出力するwebアプリ

### 機能

- [x] 文字列を形態素解析し、その結果を表示する機能
- [x] 文字列を形態素解析し、集計して頻度を表示する機能
- [x] 文字列の係り受け解析をAPIで実行し、修飾・被修飾の情報を表示する機能
- [ ] 類似度計算の実装（実装途中）
- [ ] 共起行列の実装（実装予定）

### 起動方法

pipenvを利用して環境を整え、サーバであるapp.pyを実行してください。

```Bash:環境構築とサーバ起動
$ pipenv install
$ pipenv run python app.py
```

indexページに、それぞれの機能が実装されたサイトのリンクを張っています。
- 形態素解析の結果を表示する`segmenter.html`
- 形態素解析の結果から類似度計算を行う`similarity_calculator.html`(現在実装途中)
- 係り受け解析の結果から修飾元・修飾先の情報を表示する`parser.html`
