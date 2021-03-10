# ScreebLook

> 基于chrome extension开发的录屏插件


* background.js 91 getUserMedia报错NotAllowed 
  chrome的bug需要在detect.js中进行操作

* 在非https或localhost页面中调用mediaDevices.getUserMedia会undefined

* detect.js需要向background.js中发送一个信号，在detect.js加载完成后  brower icon变得可点击

* 扩展在chrome://页面无法使用 获取不到id 应增加判断 在这些页面上禁用。

* chrome.runtime.lastError 报错原因 sendMessage 没有sendResponse 或者background.js中sendMessage是向chrome://页面发送。


> 2021.3.10
  * 在非https页面上禁用拓展，但图标在http页面上显示仍然正常没有变成灰色。
  
  * 整理代码 
  