$(function() {
  // 「解析」のボタンをクリックした場合の処理
  $(".button").click(function() {
    var input_text = $("#input_text").val(); // 解析する文字列
    var jsonData = JSON.stringify({
      "text": input_text
    }); // サーバに渡すデータ

    $.ajax({
      type: 'POST',
      url: '/parser',
      data: jsonData,
      contentType: 'application/json',
      success: function(data) { // サーバから帰ってきたデータの処理
        /** ==============================================================
          データ整形
        ============================================================== **/
        try {
          var chunks = JSON.parse(data).result.chunks; // 文節を取得
        } catch (e) {
          $("#resulttext").empty();
          console.log(e.message);
          return false;
        }

        var clauseList = []; // 整形された文節ごとの情報を格納するデータ

        for (var chunk of chunks) { // 文節ごとにデータを整形
          var src = "" // 修飾元
          var part = "" // 品詞の集合
          var head = chunk.head // 修飾先の文節番号(clauseのindex)
          for (var token of chunk.tokens) { // 文節内の各形態素を取得
            src += token[0] // 形態素の表記を追加
            part += token[3] + '.' // 品詞の追加
          }
          clauseList.push({
            'src': src,
            'part': part,
            'head': head
          });
        }

        /** ==============================================================
          表作成
        ============================================================== **/
        // HTMLに表示する表の用意
        var table = document.createElement('table');
        var tableTop = document.createElement('tr');

        /* 修飾元の列 */
        var src_col = document.createElement('th');
        src_col.textContent = '修飾元';
        tableTop.appendChild(src_col);

        /* 品詞の列 */
        var part_col = document.createElement('th');
        part_col.textContent = '品詞列';
        tableTop.appendChild(part_col);

        /* 修飾先の列 */
        var dest_col = document.createElement('th');
        dest_col.textContent = '修飾先';
        tableTop.appendChild(dest_col);

        table.appendChild(tableTop);

        // 解析結果の各形態素情報に対して、HTMLの表の要素作成
        for (var clause of clauseList) { // 各文節に対して行を作成
          var tableVal = document.createElement('tr');

          /* 修飾元のセル */
          var src_cell = document.createElement('td');
          src_cell.textContent = clause.src;
          tableVal.appendChild(src_cell);

          /* 品詞のセル */
          var part_cell = document.createElement('td');
          part_cell.textContent = clause.part;
          tableVal.appendChild(part_cell);

          /* 修飾先のセル */
          var dest_cell = document.createElement('td');
          try {
            if (clause.head == -1) {
              var clause_dest = "None.";
            } else {
              var clause_dest = clauseList[clause.head].src;
            }
          } catch (e) {
            $("#resulttext").empty();
            console.log(e.message);
            return false;
          }
          dest_cell.textContent = clause_dest;
          tableVal.appendChild(dest_cell);

          /* テーブルの要素を大元のテーブルに追加 */
          table.appendChild(tableVal)
        }

        $("#resulttext").empty(); // HTMLに出力する前に、表示を削除
        $("#resulttext").append(table); // HTMLに表を追加する
      }
    }); // End ajax

  }); // End button func

});
