/**************************************************
 *
 * 共通
 *
 **************************************************/

/*
 * タブペイン、カラータブを生成する
 */
function MakePanesAndTabs(data) {
  var tabPanes = $('#tab-panes');
  var colorTabs = $('#color-tabs');
  
  for (var i = 0; i < data.length; i++) {
    var tabPane = GetNewPane(data[i].Name);
    var colorTab = GetNewTab(data[i].Name);
    
    if (i == 0) {
      tabPane.addClass('active');
      colorTab.addClass('active');
    }
    
    tabPanes.append(tabPane);
    colorTabs.append(colorTab);
  }
}

/*
 * 新しいタブペインを取得する
 */
function GetNewPane(paneName) {
  return $('<div>').addClass('tab-pane').attr('id', paneName);
}

/*
 * 新しいカラータブを取得する
 */
function GetNewTab(tabName) {
  var closeBtn = $('<span>').addClass('close-tab').append($('<i>').addClass('icon-remove'));
  var link = $('<a>').attr('href', '#' + tabName).text(tabName).append(closeBtn);
  return $('<li>').attr('id', 'tab-' + tabName).append(link);
}

/*
 * カラーパネルを生成する
 */
function MakeColorPanel(data) {
  for (var i = 0; i < data.length; i++) {
    var colors = data[i].Colors;
    
    for (var j = 0; j < colors.length; j++) {
      // 16進数色をRGBA色に変換
      var rgba = FormatToRgba(ConvertToRgbaColor(colors[j], 1.0));
      if (rgba == false) {
        // 未指定の色値は無視
        continue;
      }
      
      $('#' + data[i].Name)
        .append($('<div>')
          .addClass('row')
          .append(GetNewColorArea('hex', i, j, '#' + colors[j]))
          .append(GetNewColorArea('rgba', i, j, rgba)));
    }
  }
}

/*
 * 新しいカラーパネルを取得する
 */
function GetNewColorArea(type, tabCount, index, color) {
  return $('<div>')
            .addClass('span6 box ' + type)
            .addClass(type + tabCount + '-' + index)
            .css('background-color', color)
            .append($('<span>').text(color).addClass('color-code'));
}

/*
 * 新しいタブを追加する
 */
function AddTab() {
  var tabCount = $('#color-tabs').find('li').length - 1;
  var name = 'newtab-' + tabCount;
  var tabPane = GetNewPane(name);
  var colorTab = GetNewTab(name);
  $('#tab-panes').append(tabPane);
  $('#color-tabs').append(colorTab);
  
  AddPanel(name, tabCount);
}

/*
 * 新しいパネルを追加する
 */
function AddPanel(paneId, tabCount) {
  for (var i = 0; i < 10; i++) {
      $('#' + paneId)
        .append($('<div>')
          .addClass('row')
          .append(GetNewColorArea('hex', tabCount, i, '#ffffff'))
          .append(GetNewColorArea('rgba', tabCount, i, 'rgba(255, 255, 255, 1.0)')));
  }
}

/*
 * タブを削除する
 */
function RemoveTab(tabId) {
  console.log(tabId);
  $('#' + tabId).remove();
  $('#tab-' + tabId).remove();
}

/*
 * ボックスの背景色を変更する
 */
function ChangeColor(hexBox, color) {
  if ($('.tab-pane').find('.' + hexBox).length == 0) {
    return false;
  }
  $('.' + hexBox).css('background-color', '#' + color);
  
  // RGBAボックスを変更
  var rgbaBox = '.' + hexBox.replace('hex', 'rgba');
  if ($('.tab-pane').find(rgbaBox).length == 0) {
    return false;
  }
  
  // 透明度の抽出
  var alpha = $(rgbaBox).css('background-color').split(',')[3];
  alpha = alpha == undefined ? 1.0 : NumRound(alpha.split(')')[0].trim());
  
  // RGBA色値に変換
  var rgba = FormatToRgba(ConvertToRgbaColor(color, alpha));
  if (rgba == false) {
    return false;
  }
  $(rgbaBox).css('background-color', rgba).find('.color-code').text(rgba);
  
  return true;
}

/**************************************************
 *
 * 16進数色に関する関数
 *
 **************************************************/

/*
 * 16進数をrgba値に整形する
 */
function ConvertToRgbaColor(hex, alpha) {
  var color = {};
  if (hex.length == 3) {
    // #nnn の場合
    color['r'] = SubstringColor(hex, 0, 1, true);
    color['g'] = SubstringColor(hex, 1, 2, true);
    color['b'] = SubstringColor(hex, 2, 3, true);
  } else if (hex.length == 6) {
    // #nnnnnn の場合
    color['r'] = SubstringColor(hex, 0, 2, true);
    color['g'] = SubstringColor(hex, 2, 4, true);
    color['b'] = SubstringColor(hex, 4, 6, true);
  } else {
    return false;
  }
  color['a'] = alpha;
  return color;
}

/*
 * 16進数の各色を取り出す
 */
function SubstringColor(hex, from, to, conv) {
  if (hex == '') {
    return false;
  }
  var s = hex.substring(from, to);
  if (s.length == 1) {
    s = s + s;
  } else if (2 < s.length) {
    return false;
  }
  return conv == true ? parseInt(s, 16) : s;
}

function NumRound(val) {
  return Math.round(parseFloat(val) * 10) / 10;
}

/**************************************************
 *
 * RGBAに関する関数
 *
 **************************************************/

/*
 * rgba形式に整形する
 */
function FormatToRgba(color) {
  if (color == '') {
    return false;
  } else {
    return 'rgba(' + color['r'] + ', ' + color['g'] + ', ' + color['b'] + ', ' + color['a'].toFixed(1) + ')';
  }
}

/*
 * rgba値から各色値を取得する
 */
function GetColorFromRgba(rgba) {
  var x = rgba.replace('rgba(', '').replace(')', '').split(',');
  var color = {'r': x[0], 'g': x[1], 'b': x[2], 'a': x[3]};
  return color;
}

/*
 * rgba値を16進数に形式変換する
 */
function ConvertToHexColor(color) {
  var decR = ConvertToHex(color['r'], color['a']);
  var decG = ConvertToHex(color['g'], color['a']);
  var decB = ConvertToHex(color['b'], color['a']);
  return '#' + decR + decG + decB;
}

/*
 * rgba値から16進数値に変換する
 */
function ConvertToHex(dec, alpha) {
  var def = parseInt(dec);
  var i = def + (255 - def) * (1 - alpha);
  var hex = Math.round(i).toString(16);
  return ('0' + hex).slice(-2);
}
