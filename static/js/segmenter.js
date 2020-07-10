$(function () {
  // 「All check ON/OFF」のチェックボックスで全ての品詞のフィルターを操作する
  $("#check").click(function () {
    if($("#check").prop("checked")){
      $('[name="filter"]').prop("checked", true);  // フィルター全てにチェックをつける
    }else {
      $('[name="filter"]').prop("checked", false);  // フィルター全てでチェックを外す
    }
  });

  // 「解析」または「集計」のボタンをクリックした場合の処理
  $(".button").click(function () {
    var results = this.value;  // ボタンのvalue。「解析」か「集計」
    var text = $("#input_text").val();  // 解析する文字列
    var valList = [];
    // チェックした品詞のvalue値を取得
    $('[name="filter"]:checked').each(function(index,element){
      valList.push( $(element).val() );
    });
    var valStr = valList.join('|');
    var descData = JSON.stringify( { "text": text, "filter": valStr, "results": results } );  // サーバに渡すデータ
    //console.log(descData);

    $.ajax({
      type: 'POST',
      url: '/segmenter',
      data: descData,
      contentType: 'application/json',
      success: function (data) {  // サーバから帰ってきたデータの処理
        // console.log(typeof data);

        var isUniq = false;
        if (results == 'uniq') isUniq = true;

        try {
          // 解析を実行した場合
          if (isUniq) var wordList = JSON.parse(data).ResultSet.uniq_result.word_list.word;
          // 集計を実行した場合
          else var wordList = JSON.parse(data).ResultSet.ma_result.word_list.word;
        } catch(e) {
          $("#resulttext").empty();
          console.log(e.message);
          return false;
        }
        // HTMLに表示する表の用意
        var table = document.createElement('table');
        var tableTop = document.createElement('tr');

        /* 表記の列 */
        var surface = document.createElement('th');
        surface.textContent = '表記';
        tableTop.appendChild(surface);

        /* 読みの列 */
        if (!isUniq) {
          var reading = document.createElement('th');
          reading.textContent = '読み';
          tableTop.appendChild(reading);
        }

        /* 品詞の列 */
        var pos = document.createElement('th');
        pos.textContent = '品詞';
        tableTop.appendChild(pos);

        /* 原型の列 */
        var baseform = document.createElement('th');
        baseform.textContent = '原形';
        tableTop.appendChild(baseform);

        /* 出現数の列 */
        if (isUniq) {
          var count = document.createElement('th');
          count.textContent = '出現数';
          tableTop.appendChild(count);
        }

        table.appendChild(tableTop);

        // 解析結果の各形態素に対して、HTMLの表の要素作成
        for (var i = 0; i < wordList.length; i++) {
            var tableVal = document.createElement('tr');
            var feature = wordList[i].feature.split(',');

            /* 表記のセル */
            var surface = document.createElement('td');
            surface.textContent = feature[3];
            // surface.textContent = wordList[i].surface;
            tableVal.appendChild(surface);

            /* 読みのセル */
            if (!isUniq) {
              var reading = document.createElement('td');
              reading.textContent = feature[4];
              // reading.textContent = wordList[i].reading;
              tableVal.appendChild(reading);
            }

            /* 品詞(/補足)のセル */
            var pos = document.createElement('td');
            var posVal = feature[0];
            if (!isUniq && feature[1] != '*' && feature[1] != posVal) posVal += '/' + feature[1];
            pos.textContent = posVal;
            // pos.textContent = wordList[i].pos;
            tableVal.appendChild(pos);

            /* 原形のセル */
            var baseform = document.createElement('td');
            baseform.textContent = feature[5];
            // baseform.textContent = wordList[i].baseform;
            tableVal.appendChild(baseform);

            /* 出現数のセル */
            if (isUniq) {
              var count = document.createElement('td');
              count.textContent = wordList[i].count;
              tableVal.appendChild(count);
            }

            table.appendChild(tableVal)
        }

        $("#resulttext").empty();  // HTMLに出力する前に、表示を削除
        $("#resulttext").append(table);  // HTMLに表を追加する
      }
    });
  });
});
