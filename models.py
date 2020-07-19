import json
import requests
import urllib.parse
import xmltodict

import config

APPID = config.APPID  # アプリケーションID（環境変数から読み取る）

def segmenter(data):
    # クエリストリングの作成
    filter = data["filter"]  # 出力する品詞番号
    results = data["results"]  # 解析か集計
    textData = data["text"]  # 形態素解析する文字列
    sentence = urllib.parse.quote(textData)

    # XMLを取得しJSONに変換
    # APIのレスポンスとして形態素解析結果のXMLを受け取る
    res = yahooapima(filter, results, sentence)
    dict = xmltodict.parse(res.text)  # レスポンスのXMLを辞書型に変更
    jsonData = json.dumps(dict)  # 辞書型からjson形式に変更
    return jsonData


def similarity_calculator(data):
    # クエリストリングの作成
    filter = data["filter"]  # 出力する品詞番号
    results = "uniq"  # 集計
    sentence = urllib.parse.quote(data["text"])  # 形態素解析する文字列

    # XMLを取得しJSONに変換
    # APIのレスポンスとして形態素解析結果のXMLを受け取る
    res = yahooapima(filter, results, sentence)
    dict = xmltodict.parse(res.text)  # レスポンスのXMLを辞書型に変更
    jsonData = json.dumps(dict)  # 辞書型からjson形式に変更
    return jsonData

def parser(data):
    query = data["text"]  # 解析する文字列
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Yahoo AppID: {}".format(APPID),
    }
    param_dic = {
        "id": "1234-1",
        "jsonrpc": "2.0",
        "method": "jlp.daservice.parse",
        "params": {"q": query},
    }
    URL = "https://jlp.yahooapis.jp/DAService/V2/parse"
    res = requests.post(URL, headers=headers, json=param_dic)
    try:
        jsonData = json.dumps(res.json())
    except:
        jsonData = "{}"
    return jsonData

def extract_evaluation(data) :
    query = data["text"]  # 解析する文字列
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Yahoo AppID: {}".format(APPID),
    }
    param_dic = {
        "id": "1234-1",
        "jsonrpc": "2.0",
        "method": "jlp.daservice.parse",
        "params": {"q": query},
    }
    URL = "https://jlp.yahooapis.jp/DAService/V2/parse"
    res = requests.post(URL, headers=headers, json=param_dic)
    try:
        jsonData = json.dumps(res.json())
    except:
        jsonData = "{}"
    return jsonData


def yahooapima(filter, results, sentence):
    qs = 'appid=' + APPID + '&response=surface,reading,pos,baseform,feature&filter=' + \
        filter + '&results=' + results + '&sentence=' + sentence
    # クエリストリングを辞書型に変換
    qs_d = urllib.parse.parse_qs(qs)
    # url
    url = 'https://jlp.yahooapis.jp/MAService/V1/parse'
    # リクエスト
    res = requests.post(url, data=qs_d)
    return res
