$(function() {
  // 「解析」のボタンをクリックした場合の処理
  $(".button").click(function() {
    var inputText = $("#input_text").val(); // 解析する文字列
    // サーバに渡すデータ
    var jsonData = JSON.stringify({
      "text": inputText
    });

    $.ajax({
      type: 'POST',
      url: '/extract_evaluation',
      data: jsonData,
      contentType: 'application/json',
      success: function(data) { // サーバから帰ってきたデータの処理

        /** ==============================================================
          JSON解析，データ取得
        ============================================================== **/
        try {
          var chunkList = JSON.parse(data).result.chunks; // chunkList:文節配列
        } catch (e) {
          $("#resulttext").empty();
          console.log(e.message);
          return false;
        }
        console.log(chunkList);


        /** ==============================================================
          形容詞or形容動詞の探索
        ============================================================== **/
        var resultList = []; // 結果配列

        for (var chunk of chunkList) { // 各文節で探索
          var result = {}; // 結果を格納する変数
          for (var token of chunk.tokens) { // 各単語で形容(動)詞の探索
            if (token[3] === "形容詞" || token[3] === "形容動詞") {
              result["evaluationStr"] = token[0]; // 評価の文字列
              result["evaluationId"] = chunk.id; // 評価が入っている文節id
              resultList.push(result);
            }
          }
        }
        // console.log(resultList);


        /** ==============================================================
          評価の対象の探索
        ============================================================== **/
        for (var result of resultList) { // 各評価で探索
          var targetStrList = []; // 評価の対象の配列
          var targetIdList = []; // 評価の対象の文節id

          for (var chunk of chunkList) { // 各文節で探索

            if (result.evaluationId === chunk.head) { // 評価の対象を判定
              var targetStr = "";

              for (var token of chunk.tokens) { // 各単語で名詞の探索
                if (token[3] === "名詞") {
                  targetStr += token[0];
                }
              }
              targetStrList.push(targetStr); // 対象の文字列を追加
              targetIdList.push(chunk.id); // 対象のidを追加
            }

          }
          result["targetStr"] = targetStrList;
          result["targetId"] = targetIdList;
        }
        console.log(resultList);


        /** ==============================================================
          表作成
        ============================================================== **/
        // HTMLに表示する表の用意
        var table = document.createElement('table');
        var tableTop = document.createElement('tr');

        /* 対象の列 */
        var target_col = document.createElement('th');
        target_col.textContent = '対象';
        tableTop.appendChild(target_col);

        /* 評価の列 */
        var evaluation_col = document.createElement('th');
        evaluation_col.textContent = '評価';
        tableTop.appendChild(evaluation_col);

        table.appendChild(tableTop);

        // 解析結果の評価・対象のセットに対して、HTMLの表の要素作成
        for (var result of resultList) { // 各評価ごとに処理
          for (var targetStr of result.targetStr) { // 各対象ごとに行を作成
            if (targetStr === "") {
              continue;
            }
            var tableVal = document.createElement('tr');

            /* 対象のセル */
            var target_cell = document.createElement('td');
            target_cell.textContent = targetStr; // 対象の文字列を格納
            tableVal.appendChild(target_cell);

            /* 評価のセル */
            var evaluation_cell = document.createElement('td');
            evaluation_cell.textContent = result.evaluationStr; // 評価の文字列を格納
            tableVal.appendChild(evaluation_cell);

            /* テーブルの要素を大元のテーブルに追加 */
            table.appendChild(tableVal)
          }
        }

        $("#resulttext").empty(); // HTMLに出力する前に、表示を削除
        $("#resulttext").append(table); // HTMLに表を追加する


        /** ==============================================================
          force layout 描画
        ============================================================== **/
        $("svg").empty();
        var width = 400;
        var height = 400;
        var nodes = []
        var links = []

        for (var chunk of chunkList) {
          /* nodeの定義 */
          var clause = "";
          for (var token of chunk.tokens) {
            clause += token[0];  // 単語を足し合わせる
          }
          var node = {
            id: chunk.id,
            label: clause,
          };
          nodes.push(node);

          /* node同士の紐付けの設定 */
          if (chunk.head === -1) continue;
          var link = {
            source: chunk.id,
            target: chunk.head
          }
          links.push(link);
        }

        // forceLayoutの設定
        var force = d3.layout.force()
          .nodes(nodes)
          .links(links)
          .size([width, height])
          .distance(140) // node同士の距離
          .friction(0.9)
          .charge(-100) // 推進力
          .gravity(0.1) // 引力
          .start();

        // svg領域の作成
        var svg = d3.select("body")
          .append("svg")
          .attr({
            width: width,
            height: height
          });

        // link線の描画
        var link = svg.selectAll("line")
          .data(links)
          .enter()
          .append("line")
          .style({
            stroke: "#ccc",
            "stroke-width": 1
          });

        // nodesの描画
        var node = svg.selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .call(force.drag);

        // nodeのラベル周りの設定
        var label = svg.selectAll('text')
          .data(nodes)
          .enter()
          .append('text')
          .attr({
            "text-anchor": "middle",
            "font-size": "14px"
          })
          .text(function(data) {
            return data.label;
          })
          .call(force.drag);

        // tickイベント
        force.on("tick", function() {
          link.attr({
            x1: function(data) {
              return data.source.x;
            },
            y1: function(data) {
              return data.source.y;
            },
            x2: function(data) {
              return data.target.x;
            },
            y2: function(data) {
              return data.target.y;
            }
          });
          node.attr({
            cx: function(data) {
              return data.x;
            },
            cy: function(data) {
              return data.y;
            }
          });
          // label追随
          label.attr({
            x: function(data) {
              return data.x;
            },
            y: function(data) {
              return data.y;
            }
          });
        });
      }
    }); // End ajax

  }); // End button func

});
