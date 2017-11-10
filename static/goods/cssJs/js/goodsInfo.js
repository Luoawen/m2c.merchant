$(function () {
  $.ajax({
    url: getApiUrl() + 'm2c.scm/goods/app/detail',
    data: {
      goodsId: getQueryString('goodsId')
    },
    type: 'get',
    success: function (data) {
      var htm = []
      // 商品主图
      for (var i = 0; i < data.content.goodsMainImages.length; i++) {
        var j = i
        j++
        htm.push('<div class="swiper-slide p'+ j +'"><img src="' + data.content.goodsMainImages[i] + '"/></div>')
      }
      $('.swiper-wrapper').html(htm.join(''))
      // 商品名称
      $('.tit0').text(data.content.goodsName)
      // 商品副标题
      $('.tit1').text(data.content.goodsSubTitle)
      // 商品价格
      $('.tit2').text('￥' + (data.content.goodsSKUs[0].photographPrice / 100))

      if (data.content.fullCuts == '') {
        $('.good_bs02').hide()
      } else {
        htm = []
        // 满减促销
        for (var i = 0; i < data.content.fullCuts.length; i++) {
          for (var j = 0; j < data.content.fullCuts[i].itemNames.length; j++) {
            htm.push('<div class="tit3"><span>满减</span>' + data.content.fullCuts[i].itemNames[j].itemName + '</div>')
          }
        }
        $('#cuts').html(htm.join(''))
      }
      htm = []
      // 商品保障
      for (var i = 0; i < data.content.goodsGuarantee.length; i++) {
        htm.push('<i class="icoCommodityAdmit"></i><span class="tit6">' + data.content.goodsGuarantee[i].guaranteeName + '</span>')
      }
      $('.good_bs04').html(htm.join(''))
      // 商品评价
      if (data.content.goodsComment.commentTotal == 0) {
        $('#comment').hide()
      } else {
        $('#commentTotal').text('(' + data.content.goodsComment.commentTotal + ')')
        htm = []
        htm.push('<img src="' + data.content.goodsComment.buyerIcon + '"/>')
        $('#icon').html(htm.join(''))
        $('#userName').text(getName(data.content.goodsComment.buyerName))
        $('#sku').text(data.content.goodsComment.skuName + 'x' + data.content.goodsComment.goodsNum)
        $('#content').text(data.content.goodsComment.commentContent)
        htm = []
        htm.push('<span class="good_e">商品评价</span>')
        for (var i = 0; i < data.content.goodsComment.starLevel; i++) {
          htm.push('<i class="xing"></i>')
        }
        $('#level').html(htm.join(''))
      }
      $('.good_bs08').html(data.content.desc)
    }
  })
  $.ajax({
    url: getApiUrl() + 'm2c.scm/goods/app/guess',
    data: {
      positionType: 3
    },
    type: 'get',
    success: function (data) {
      console.log(data.content.length)
      var ulWidth = data.content.length * 2.2 + 'rem'
      $('.ul').css({'width': ulWidth})
      // 猜你喜欢
      var htm = []
      for (var i = 0; i < data.content.length; i++) {
        htm.push('<div class="imgtit"><img src="' + data.content[i].goodsImageUrl + '"/><div class="wordsbase_ib tit9">' +
          data.content[i].goodsName + '</div><div class="tit10">￥' + data.content[i].goodsPrice / 100 + '</div></div>')
      }
      $('#guess').html(htm.join(''))
    }
  })
  var type = getQueryString('type')
  if (type == 0) { // 分享出来的url
    $('.foot_fx').hide()
    $('.foot_t').show()
  }
  if (type == 1) { // app访问的url
    $('.foot_t').hide()
    $('.foot_fx').show()
  }
})
function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

function getApiUrl () {
  var apiUrl = ''
  var href = window.location.href
  if (href.includes('m2c2017dev')) { // 开发环境
    apiUrl = 'http://api.m2c2017dev.com:80/'
  } else if (href.includes('m2c2017test')) { // 测试环境
    apiUrl = 'http://api.m2c2017test.com:80/'
  } else if (href.includes('m2c2017local')) { // 本地环境
    apiUrl = 'http://api.m2c2017local.com:80/'
  } else if (href.includes('localhost')) { // 本地环境
    apiUrl = 'http://api.m2c2017local.com:80/'
  } else { // 演示环境
    apiUrl = 'http://api.m2c2017.com:80/'
  }
  return apiUrl
}

function getName (name) {
  if (name != '' && name != null && name != undefined) {
    var str = name.split('')
    if (str.length >= 2) {
      str.splice(1, str.length - 2, '***')
    } else {
      str.splice(1, str.length - 1, '***')
    }
    return str.join('')
  }
}
