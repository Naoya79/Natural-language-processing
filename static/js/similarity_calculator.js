$(function () {
  // 「All check ON/OFF」のチェックボックスで全ての品詞のフィルターを操作する
  $("#check").click(function () {
    if($("#check").prop("checked")){
      $('[name="filter"]').prop("checked", true);  // フィルター全てにチェックをつける
    }else {
      $('[name="filter"]').prop("checked", false);  // フィルター全てでチェックを外す
    }
  });

  // リセットボタンで結果の表示を消す
  $("#reset").click(function () {
    $("#searchtext").empty();
    $("#resulttext").empty();
  })

  // ボタンをクリックした場合の処理
  $(".button").click(function () {
    var text = $("#input_text").val();  // 解析する文字列
    var valList = [];
    // チェックした品詞のvalue値を取得
    $('[name="filter"]:checked').each(function(index,element){
      valList.push( $(element).val() );
    });
    var valStr = valList.join('|');
    var descData = JSON.stringify( { "text": text, "filter": valStr } );  // サーバに渡すデータ
    //console.log(descData);

    $.ajax({
      type: 'POST',
      url: '/similarity_calculator',
      data: descData,
      contentType: 'application/json',
      success: function (data) {  // サーバから帰ってきたデータの処理

        try {
          var wordList = JSON.parse(data).ResultSet.uniq_result.word_list.word;
          console.log(wordList);
        } catch(e) {
          $("#resulttext").empty();
          console.log(e.message);
          return false;
        }

        $("#searchtext").append('<li>'+text+'</li>');  // 解析する文字列をページに追加

        $(".row").each(function(index, element){
          console.log(index);
        });

        // HTMLに表示する表の用意
        var table = document.createElement('table');
        table.id = 'resulttable';
        var tableTop = document.createElement('tr');

        /* 原型の列 */
        var baseform = document.createElement('th');
        baseform.textContent = '単語';
        tableTop.appendChild(baseform);

        /* 出現数の列 */
        var count = document.createElement('th');
        count.textContent = '総数';
        tableTop.appendChild(count);

        table.appendChild(tableTop);

        // 解析結果の各形態素に対して、HTMLの表の要素作成
        for (var i = 0; i < wordList.length; i++) {
            var tableVal = document.createElement('tr');
            tableVal.className = 'row row_' + i;
            var feature = wordList[i].feature.split(',');

            /* 原形のセル */
            var baseform = document.createElement('td');
            baseform.className = 'baseform_col';
            baseform.textContent = feature[5];
            // baseform.textContent = wordList[i].baseform;
            tableVal.appendChild(baseform);

            /* 出現数のセル */
            var count = document.createElement('td');
            count.className = 'count_col';
            count.textContent = wordList[i].count;
            tableVal.appendChild(count);


            table.appendChild(tableVal)
        }

        $("#resulttext").empty();  // HTMLに出力する前に、表示を削除
        $("#resulttext").append(table);  // HTMLに表を追加する
      }
    });
  });
});
