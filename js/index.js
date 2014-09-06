$(function() {
  
  /*
   * 画面表示時イベント
   */
  $.getJSON('./js/data.json', function(data) {
    MakePanesAndTabs(data.Items);
    MakeColorPanel(data.Items);
  });
  
  /*
   * スライダー動作設定
   */
  $('#slider-range-min').slider({
    range: 'min'
    , min: 0.0
    , max: 1.0
    , step: 0.1
    , value: 1.0
    , slide: function(event, ui) {
      var hex = $('body').find('.hex');
      var rgba = $('body').find('.rgba');
      
      for (var i = 0; i < rgba.length; i++) {
        var color = GetColorFromRgba($(rgba[i]).text());
        color['a'] = ui.value;

        var rgbaValue = FormatToRgba(color);
        $(rgba[i]).css('background-color', rgbaValue).find('.color-code').text(rgbaValue);

        var hexValue = ConvertToHexColor(color);
        $(hex[i]).css('background-color', hexValue).find('.color-code').text(hexValue);
      }
    }
  });
  
  /*
   * 色ブロッククリック時イベント
   */
  $(document).on('click', '.box', function() {
    $('.ui-widget-header')
      .css('background', 'none')
      .css('background-color', $(this).css('background-color'));
  });
  
  /*
   * タブクリック時イベント
   */
  $(document).on('click', '#color-tabs a', function(e) {
    e.preventDefault();
    
    // タブ追加ボタンか否か
    if ($(this).parent().attr('id') == 'addtab') {
      AddTab();
    } else {
      $(this).tab('show');
    }
  });
  
  /*
   * タブ削除ボタンクリック時イベント
   */
  $(document).on('click', '.close-tab', function(e) {
    RemoveTab($(this).parent().parent().attr('id'));
  });
  
  /*
   * カラーコードクリック時イベント
   */
  $(document).on('click', '.hex .color-code', function(e) {
    var parentClass = $(this).parent().attr('class').split(' ')[3];
    var div = $('<div>').addClass('input-prepend input-append');
    var a = $('<span>').addClass('add-on').text('#');
    var t = $('<input>').addClass('input-medium').attr('type', 'text').attr('placeholder', 'type and return...');
    var b = $('<button>').addClass('btn change-btn').text('Change');
    $('.' + parentClass).append(div.append(a).append(t).append(b)).find('.color-code').remove();
    t.focus();
  });
  
  /*
   * カラーコード確定時イベント
   */
  $(document).on('click', '.change-btn', function(e) {
    var color = $(this).prev().val();
    var box = $(this).parent().parent();
    box.append($('<span>').addClass('color-code').text('#' + color)).find('.input-append').remove();
    if (ChangeColor(box.attr('class').split(' ')[3], color) == false) {
      alert('背景色の変更に失敗しました！');
    }
  });
  
});
