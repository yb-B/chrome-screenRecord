# ScreenLook

> 基于chrome extension开发的录屏插件

> note
* background.js 91 getUserMedia报错NotAllowed 
  chrome的bug需要在detect.js中进行操作

* 在非https或localhost页面中调用mediaDevices.getUserMedia会undefined


* 扩展在chrome://页面无法使用 获取不到id 应增加判断 在这些页面上禁用。

* chrome.runtime.lastError 报错原因 sendMessage 没有sendResponse 或者background.js中sendMessage是向chrome://页面发送。


> Now
  * 在非https页面上禁用拓展，但图标在http页面上显示仍然正常没有变成灰色。
  chrome.browerAction.disable() !!! 
  
  * 整理代码 

> 使用相关
  * chrome浏览器中直接将项目文件夹拖入即可，chrome会禁用未上架chrome 商城的.crx文件，没钱。

  * 点击图标开启录制，再次点击图标结束录制。
  
  * 仅可在https页面开启录制，在其他协议网页中打开无效。

  * stackoverflow网站中 虽然是https协议，但始终无法获取到麦克风权限。