// ==UserScript==
// @name         runmojie
// @version      0.1
// @description  跑图脚本
// @author       kevin feng

// @match        http://ah0.wapgame.top/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

const fishScript = [
  {
    conditionText: '鱼钩上已经没有鱼饵',
    target: '返回场景'
  },
  '查看',
  '钓鱼',
  '约亚河畔',
  '中央广场',
  '集市(拍卖)',
  '返回场景',
]

const shoppingScript = [
  {
    conditionText: '用于钓鱼的鱼饵',
    target: '确定购买'
  },
  {
    conditionText: '购买道具',
    target: '鱼饵'
  },
  {
    conditionText: '零零散散摆放',
    target: '道具'
  },
  '杂货铺(道具)',
  '集市(拍卖)',
  '中央广场',
  '返回场景',
]

const scripts = {
  fishScript,
  shoppingScript,
}

const randomRange = (min, max) => Math.floor(Math.random() * (max - min)) + min

const changeScriptCondition = [
  {
    conditionText: '你背包里面没有鱼饵',
    script: 'shoppingScript'
  },
  {
    conditionText: '你获得了鱼饵',
    script: 'fishScript'
  }
]

const isScriptStopFn = () => {
  const isScriptStop = localStorage.getItem('isScriptStop') // 1-是 0-否
  return isScriptStop == 1
}

const changeScript = () => {
  if (isScriptStopFn()) return
  const list = changeScriptCondition
  for (let i = 0; i < list.length; i++) {
    const { conditionText, script } = list[i];
    const aArr = Array.from(document.querySelectorAll('a'))
    const bodyArr = Array.from(document.querySelectorAll('body'))
    const conditionTextTarget = bodyArr.find(i => i.innerText?.indexOf(conditionText) > -1)
    const clickTarget = aArr.find(i => i.innerText?.indexOf(conditionText) > -1)
    if (conditionTextTarget || clickTarget) {
      localStorage.setItem('runScript', script)
      return true
      break
    }
  }
}

const checkScript = () => {
  if (isScriptStopFn()) return

  let conditionText, target
  changeScript() // 检查执行脚本
  const runScript = localStorage.getItem('runScript') || 'fishScript'
  const list = scripts[runScript]
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (typeof item !== 'string') {
      conditionText = item.conditionText
      target = item.target
    } else {
      conditionText = item
      target = item
    }

    const isHandle = clickHandle(conditionText, target)
    if (isHandle) {
      break
    }
  }
}

const clickHandle = (conditionText, target) => {
  const aArr = Array.from(document.querySelectorAll('a'))
  const buttonArr = Array.from(document.querySelectorAll('button'))
  const inputArr = Array.from(document.querySelectorAll('input'))
  const aClickTarget = aArr.find(i => i.innerText?.indexOf(target) > -1)
  const buttonClickTarget = buttonArr.find(i => i.innerText?.indexOf(target) > -1)
  const inputClickTarget = inputArr.find(i => i.value?.indexOf(target) > -1)

  const bodyArr = Array.from(document.querySelectorAll('body'))
  const conditionTextTarget = bodyArr.find(i => i.innerText?.indexOf(conditionText) > -1)

  if (conditionTextTarget && aClickTarget?.href) {
    location.href = aClickTarget?.href
    return true
  } else if (conditionTextTarget && buttonClickTarget) {
    buttonClickTarget.click()
    return true
  } else if (conditionTextTarget && inputClickTarget) {
    inputClickTarget.click()
    return true
  }
  return false
}

const btnClick = (conditionText, target) => {
  let isScriptStop = localStorage.getItem('isScriptStop')
  isScriptStop = isScriptStop == 0 ? 1 : 0
  localStorage.setItem('isScriptStop', isScriptStop)
  if (isScriptStop == 0) {
    checkScript()
  }
}

// 执行
const timer = setInterval(() => {
  const scriptBtn = $('#scriptBtn').get(0)
  if (!scriptBtn) {
    $('body').append($(`<button style="position: fixed; top: 0; right: 0;" id="scriptBtn">脚本</button>`).click(btnClick));
  } else {
    checkScript()
    clearInterval(timer)
  }
}, randomRange(1000, 1600))
