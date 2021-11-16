# swiftsap

#### 项目介绍
SwiftSAP SAP 单据微信、手机审批项目 请登录 http://www.swiftsap.com 测试运行
具体请联系13764089092 / wp217@126.com

#### 软件架构
软件架构说明

Web Server		存储Request 信息及用户信息					
		接收WX及Web端取Request的请求					
		处理WX及Web端Action，并反馈到SAP（审批/拒绝/…）					
		Web Server端出错Request的展示及处理					
							
							
SAP Server		推送Request到Web Server					
		接收Web Server的Action					
		SAP端出错Request的展示及处理					
		数据翻译，在配置中实现，包括category					
							
WX		展示Request					
		反馈Request审批状态					


#### 安装教程

1. 下载ABAPGit（ https://raw.githubusercontent.com/abapGit/build/master/zabapgit.abap ） 编译运行ABAPGit
2. 用ABAPGit上传SAP SwiftSAP配置文件
3. 配置应用
4. 测试运行标准采购订单

#### 使用说明

1. xxxx
2. xxxx
3. xxxx

#### 参与贡献

