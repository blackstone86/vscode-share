// 引入样式
require('../style.css');
// 引入angular库
var angular = require('angular');
// 引入react库
var React = require('../node_modules/react/lib/ReactWithAddons');
// 引入ReactDOM
var ReactDOM = require('react-dom');
// 引入events库
var EventEmitter = require('events');
// 引入lodash库
var _ = require('lodash');
// 引入vue库
var Vue = require('vue');
// 列表模拟数据
var listData = require('../listData').result.content;
// 公共方法
var Util = {
    /**
     * 获取元素
     * @param  {String} id 元素id值
     * @return {Object}    指定元素
     */
    get: function(id){
        return $('#'+id)[0] || null;
    }
    /**
     * 拷贝对象
     * @param  {Object} obj 待拷贝对象
     * @return {Object}     对象拷贝
     */
    ,copy: function(obj){
        var ret = new Object();
        for(var p in obj){
            ret[p]=obj[p];
        }
        return ret;
    }
};
/**
 * angular 列表实现
 * 渲染时间 165ms
 */
var app = angular.module("app", []);
// 列表指令
app.directive('list', ['$timeout', function(timeout) {
    return {
        restrict: 'AE'
        ,transclude: true
        ,replace: true
        ,templateUrl: '/templates/list.html'
        // ,scope: {
        //     config: '='
        // }
        ,link: function(scope, $el, attr) {
            // 配置选项
            var listDefCon = {
                // 组件唯一标识
                key: ''
                // 列表项类型
                ,itemType: 'thread'
                // 没有数据提示文案
                ,noDataTip: '暂无数据'
                // 列表项配置
                ,itemConf:{
                    // 是否有顺序列
                    hasSequence: 0
                    // 是否可选
                    ,select: 1
                    // 单选框列的默认宽度
                    ,selectWidth: "5%"
                }
                // 列宽度
                ,columsWidth: []
            };
            // 扩展配置
            var conf = angular.extend(listDefCon, scope.config);
            // 元素自身
            var me = $el[0];
            // Dom缓存
            var doms = {};
            // 帖子类型
            var threadType = '';
            /**
             * 设置数据
             */
            function setData(){
                if(conf){
                    if(conf.itemConf){
                        conf.itemConf.hasSequence = conf.hasSequence;
                    }
                    scope.config = conf;
                }
            }
            /**
             * 设置Html
             */
            function setHtml(){
                if(conf && conf.key){
                    $el.attr('id', conf.key);
                }
            }
            /**
             * 设置公开方法
             */
            function setPublicFunction(){
                if(me){
                    // 设置数据
                    me.setData = function(data){
                        timeout(function(){
                            scope.dat = [];
                            if(angular.isArray(data) && data.length){
                                var _data = data.slice();
                                var itemConf = Util.copy(conf.itemConf);
                                if(angular.isArray(conf.columsWidth) && conf.columsWidth.length){
                                    itemConf.columsWidth = conf.columsWidth;
                                }
                                for (var i = _data.length - 1; i >= 0; i--) {
                                    var listItem = _data[i];
                                    if(listItem){
                                        listItem.itemConf = itemConf;
                                    }
                                }
                                scope.dat = _data;
                            }
                        });
                    }
                    // 配置 type 帖子类型
                    me.config = function(config){
                        if(config){
                            angular.extend(conf, config);
                            setData();
                            setHtml();
                        }
                    }
                }
            }
            /**
             * 设置scope方法
             */
            function setScopeFunction(){
                /**
                 * 渲染列表
                 */
                scope.render = function(){
                    // 加载数据
                    me.setData(listData);
                }
                /**
                 * 移除列表
                 */
                scope.remove = function(){
                    me.setData();
                }
            }
            /**
             * 初始化
             */
            (function(){
                setData();
                setHtml();
                setPublicFunction();
                setScopeFunction();
            })();
        }
    };
}]);
// 列表项指令
app.directive('listItem', ['$timeout',  function(timeout) {
    return {
        restrict: 'AE'
        ,transclude: true
        ,replace: true
        ,scope: {
            config: '='
            ,source: '='
        }
        ,templateUrl: '/templates/listItem.html'
        ,link: function(scope, $el, attr) {
            // 没有排序项的默认列宽
            var columsWidthNoSequence = [100, 23, 8, 5, 5, 5, 5, 11, 18, 15];
            // 带排序项的默认列宽
            var columsWidthWithSequence = [100 , 23, 7, 5, 5, 5, 6, 9, 15, 5, 15];
            // 配置选项
            var threadDefCon = {
                // 列宽度
                columsWidth: columsWidthNoSequence.slice()
                // 是否有顺序列
                ,hasSequence: 0
                // 是否可选
                ,select: 1
                // 单选框列的默认宽度
                ,selectWidth: "5%"
                // 列配置
                ,colums:[
                    // 头部
                    {
                        name: 'head'
                        ,key:[
                            // 文章类型
                            {
                                name: 'type'
                                ,key: 'type'
                            }
                            // 用户名
                            ,{
                                name: 'creator'
                                ,key: 'from.nickName'
                            }
                            // 创建时间
                            ,{
                                name: 'time'
                                ,key: 'created'
                            }
                            // 用户Id
                            ,{
                                name: 'uid'
                                ,key: 'from.uid'
                            }
                            // 用户mId
                            ,{
                                name: 'mid'
                                ,key: 'from.mid'
                            }
                            // 是否官方帖
                            ,{
                                name:'isPublishByBg'
                                ,key:'isPublishByBg'
                            }
                        ]
                    }
                    // 帖子内容
                    ,{
                        name: 'content'
                        ,key: [
                            // 文章缩略图
                            {
                                name:'img'
                                ,key:'from.icon'
                                ,def: 'user-icon.jpg'
                            }
                            // 文章标题
                            ,{
                                name:'title'
                                ,key:'title'
                            }
                            // 文章类型
                            ,{
                                name:'type'
                                ,key:'type'
                            }
                            // 文章内容
                            ,{
                                name:'cnt'
                                ,key:'content'
                            }
                        ]
                    }
                    // 板块
                    ,{
                        name: 'info'
                        ,key: 'info.name'
                    }
                    // 浏览数
                    ,{
                        name: 'views'
                        ,key: 'pv_count'
                    }
                    // 评论数
                    ,{
                        name: 'comments'
                        ,key: [
                            {
                                name: 'mainthread'
                                ,key: 'comment_count'
                            }
                            ,{
                                name: 'subthread'
                                ,key: 'subThreads.docTotal'
                            }
                            ,{
                                name: 'type'
                                ,key: 'type'
                            }
                        ]
                    } 
                    // 点赞数
                    ,{
                        name: 'praises'
                        ,key: 'praise_count'
                    }
                    // 分享数
                    ,{
                        name: 'shares'
                        ,key: 'share_count'
                    }
                    // 状态数
                    ,{
                        name: 'status'
                        ,key: [
                            // 顶 文章置顶
                            {
                                name:'top'
                                ,key:'top'
                            }
                            // 荐
                            ,{
                                name:'new_recommend'
                                ,key:'new_recommend'
                            }
                            // 精
                            ,{
                                name:'recommend'
                                ,key:'recommend'
                            }
                            // 显 显示隐藏
                            ,{
                                name:'status'
                                ,key:'status'
                            }
                            // 帖子Id
                            ,{
                                name: 'id'
                                ,key: '_id'
                            }
                            // 板块Id
                            ,{
                                name: 'infoId'
                                ,key: 'info._id'
                            }
                            // uid
                            ,{
                                name: 'uid'
                                ,key: 'from.uid'
                            }
                            // 是否后台发布的帖子
                            ,{
                                name: 'isPublishByBg'
                                ,key: 'isPublishByBg'
                            }
                            // 文章类型
                            ,{
                                name: 'type'
                                ,key: 'type'
                            }
                        ]
                    }
                    // 标签
                    ,{
                        name: 'tag'
                        ,key: 'tag.*.title'
                    }
                    // 顺序
                    ,{
                        name: 'order_idx'
                        ,key: [
                            // 排序字段
                            {
                                name:'sortIndex'
                                ,key:'top_order_idx'
                            }
                            // 帖子Id
                            ,{
                                name: 'id'
                                ,key: '_id'
                            }
                        ]
                    }
                    // 操作
                    ,{
                        name: 'ctl'
                        ,key: [
                            // 文章类型
                            {
                                name:'isPublishByBg'
                                ,key:'isPublishByBg'
                            }
                            // 帖子ent_code
                            ,{
                                name: 'ent_code'
                                ,key: 'ent_code'
                            }
                            // 帖子Id
                            ,{
                                name: 'id'
                                ,key: '_id'
                            }
                            // 文章类型
                            ,{
                                name:'type'
                                ,key:'type'
                            }
                            // 文章标题
                            ,{
                                name:'title'
                                ,key:'title'
                            }
                            // 板块Id
                            ,{
                                name:'infoId'
                                ,key: 'info._id'
                            }
                        ]
                    }
                ]
            };
            // 活动状态配置
            var event_statusConf = {
                name: 'event_status'
                ,key: [
                    {
                        name: 'eventStartTime'
                        ,key: 'event.eventStartTime'
                    }
                    ,{
                        name: 'eventEndTime'
                        ,key: 'event.eventEndTime'
                    }
                ]
            };
            // 按需设置列表宽度的配置项
            scope.config = setDefColumsWidth(scope.config);
            // 扩展配置
            var conf = angular.extend(threadDefCon, scope.config);
            // 元素自身
            var me = $el[0];
            /**
             * 设置默认列宽度
             * @param  {Object} config 配置项
             * @return {Object}        按需设置列表宽度的配置项
             */
            function setDefColumsWidth(config){
                if(config){
                    if(!angular.isArray(config.columsWidth)){
                        if(config.hasSequence){
                            config.columsWidth = columsWidthWithSequence.slice();
                        }else{
                            config.columsWidth = columsWidthNoSequence.slice();
                        }
                    }
                }
                return config;
            }
            /**
             * 装饰数据
             * @param {Object} data 待处理的数据对象
             */
            function decorateData(data){
                function getKeyDat(key, colum){
                    if(data){
                        var arr = key.split('.');
                        var dat = data;
                        var isArray = false;
                        for (var i = 0; i < arr.length; i++) {
                            item = arr[i];
                            if(item === '*'){
                                isArray = true;
                                continue;
                            }
                            if(isArray){
                                var ret = [];
                                for (var j = dat.length - 1; j >= 0; j--) {
                                    var im = dat[j];
                                    if(im){
                                        if(im[item]){
                                            ret.push(im[item]);
                                        }else if(colum && colum.def){
                                            ret.push(colum.def);
                                        }else{
                                            ret.push(null);
                                        }
                                    }
                                }
                                dat = ret;
                                return dat || null;
                            }else{
                                dat = dat[item];
                                if(dat === undefined || dat === null || dat === ''){
                                    if(colum && colum.def){
                                        return colum.def;
                                    }else{
                                        return null;
                                    }
                                }
                            }
                        }
                    }
                    return dat;
                }
                function setItemDat(colum, item){
                    if(colum){
                        var isMix = !!item;
                        var key = isMix ? item.key : colum.key;
                        if(key){
                            if(isMix){
                                if(!colum.dat){
                                    colum.dat = {};
                                }
                                colum.dat[item.name] = getKeyDat(key, item);
                            }else{
                                colum.dat = getKeyDat(key, colum);
                            }
                        }else{
                            colum.dat = null;
                        }
                    }
                }
                if(data && conf && angular.isArray(conf.colums) && conf.colums.length){
                    var colums = conf.colums.slice();
                    for (var i = colums.length - 1; i >= 0; i--) {
                        var colum = colums[i];
                        var width = conf.columsWidth[i];
                        if(colum){
                            if(typeof width !== undefined){
                                if(typeof width === 'number'){
                                    colum.width = parseInt(Math.abs(width)) + '%';
                                }else if(typeof width === 'string'){
                                    colum.width = width;
                                }
                            }
                            if(angular.isArray(colum.key) && colum.key.length > 0){
                                for (var j = colum.key.length - 1; j >= 0; j--) {
                                    var item = colum.key[j];
                                    setItemDat(colum, item);
                                }
                            }else{
                                setItemDat(colum);
                            }
                        }
                    }
                    return colums;
                }
                return null;
            }
            /**
             * 设置数据
             */
            function setData(){
                // 没有顺序列
                var _conf = Util.copy(conf);
                if(_conf && !_conf.hasSequence && angular.isArray(_conf.colums) && _conf.colums.length){
                    _conf.colums.splice(_conf.colums.length - 2,1);
                }
                // 活动帖配置
                var isEventThread = scope.config.threadType === 'event';
                if(isEventThread){
                    _conf.colums[_conf.colums.length - 2] = event_statusConf;
                }
                scope.conf = _conf;
                // 整合数据
                if(scope.source){
                    var dat = decorateData(scope.source);
                    // 活动帖装饰数据
                    if(isEventThread){
                        var today = new Date();
                        var ret = '';
                        if(new Date(dat[9].dat.eventStartTime) > today){
                            ret = "未开始";
                        }else if(new Date(dat[9].dat.eventEndTime) < today){
                            ret = "已结束";
                        }else{
                            ret = "进行中";
                        }
                        dat[9].dat = ret;
                    }
                    if(dat){
                        scope.dat = {
                            hd: dat[0]
                            ,bd: dat.slice(1)
                        };
                    }
                }
            }
            /**
             * 设置公开方法
             */
            function setPublicFunction(){
                /**
                 * 设置配置
                 * @param  {Object} config 配置对象
                 */
                me.config = function(config){
                    // 按需设置列表宽度的配置项
                    config = setDefColumsWidth(config);
                    angular.extend(conf, config);
                    setData(type);
                    setScopeFunction();
                }
            }
            /**
             * 初始化
             */
            (function(){
                setData();
                setPublicFunction();
            })();
        }
    }
}]);

/**
 * angular内嵌react 列表实现
 * 渲染时间 106ms
 */
app.directive("listReact", function() {
    return {
        restrict: 'E',
        scope: true,
        template: '<div></div>',
        link: function(scope, $el, attrs) {
            ReactDOM.render(<List/>, $el[0]);
        }
    }
});
// 列表组件
var List = React.createClass({
    // 渲染列表
    render: function() {
        return (
            <div className="M-List">
                <ul>
                    <li>
                        <button onClick={this.show}>渲染列表</button>&nbsp;
                        <button onClick={this.hide}>移除列表</button>
                    </li>
                    {this.state.dat.map((item) => (
                        <li key={item._id}>
                            <ListItem source={item} config={item.itemConf}></ListItem>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    // 初始化状态
    ,getInitialState: function() {
        return {
            dat: []
        }
    }
    // 渲染前事件
    ,componentWillMount: function(){
        // 配置选项
        var listDefCon = {
            // 组件唯一标识
            key: ''
            // 列表项类型
            ,itemType: 'thread'
            // 没有数据提示文案
            ,noDataTip: '暂无数据'
            // 列表项配置
            ,itemConf:{
                // 是否有顺序列
                hasSequence: 0
                // 是否可选
                ,select: 1
                // 单选框列的默认宽度
                ,selectWidth: "5%"
            }
            // 列宽度
            ,columsWidth: []
        };
        // 扩展配置
        this.conf = listDefCon;
    }
    /**
     * 设置数据
     * @param {Array} data 数据源
     */
    ,setData: function(data){
        var dat = [];
        var conf = this.conf;
        if(angular.isArray(data) && data.length){
            var _data = data.slice();
            var itemConf = Util.copy(conf.itemConf);
            if(angular.isArray(conf.columsWidth) && conf.columsWidth.length){
                itemConf.columsWidth = conf.columsWidth;
            }
            for (var i = _data.length - 1; i >= 0; i--) {
                var listItem = _data[i];
                if(listItem){
                    listItem.itemConf = itemConf;
                }
            }
            dat = _data;
        }
        this.setState({
            dat: dat
        });
    }
    /**
     * 显示列表
     */
    ,show: function(){
        this.setData(listData);
    }
    /**
     * 隐藏列表
     */
    ,hide: function(){
        this.setData();
    }
});
// 列表项组件
var ListItem = React.createClass({
    render: function() {
        return (
            <div className="M-Thread">
                <table>
                    <thead>
                        <tr>
                            <th colSpan={this.state.conf.colums.length}>
                                <i className="type">
                                    <span>
                                        {(() => {
                                            switch (this.state.dat.hd.dat.type) {
                                              case 1: return "文章";
                                              case 2: return "话题";
                                              case 3: return "照片墙";
                                            }
                                        })()}
                                    </span>
                                </i>
                                <i>
                                    {this.state.dat.hd.dat.creator}
                                    {!this.state.dat.hd.dat.isPublishByBg&&this.state.dat.hd.dat.mid&&<span>({this.state.dat.hd.dat.mid})</span>}
                                </i>
                                <i>{this.state.dat.hd.dat.time}</i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {this.state.conf.select&&<td width={this.state.conf.selectWidth}><input type='checkbox'/></td>}
                            {this.state.dat.bd.map((c) => (
                                <td key={c.name} width={c.width}>
                                    {(() => {
                                        switch (c.name) {
                                            case 'content':
                                                return (
                                                    <div className="content">
                                                        <div className="img">
                                                            <img src="imgs/avatar4.png" alt=""/>
                                                        </div>
                                                        <span className="cnt">
                                                            {c.dat.title&&<span className="title">{c.dat.title}</span>}
                                                            <p>{c.dat.cnt}></p>
                                                        </span>
                                                    </div>
                                                );
                                            case 'ctl':
                                                return (
                                                    <ul className="ctl">
                                                        {(!c.dat.isPublishByBg && (c.dat.type === 2 || c.dat.type === 3))||<li>编辑</li>}
                                                        <li>报表</li>
                                                        <li>链接</li>
                                                        <li>评论</li>
                                                        <li>删除</li>
                                                    </ul>
                                                );
                                            case 'tag':
                                                return (
                                                    <ul>
                                                        {c.dat.map((tag) => (
                                                            tag && <li key={tag.id}><i className="colorblock on">{tag}</i></li>
                                                        ))}
                                                    </ul>
                                                );
                                            case 'status':
                                                return (
                                                    <ul>
                                                        <li><i className={c.dat.top===1?'colorblock on':'colorblock'}>顶</i></li>
                                                        <li><i className={c.dat.new_recommend===1?'colorblock on':'colorblock'}>荐</i></li>
                                                        {!c.dat.isPublishByBg&&c.dat.type===1&&<li><i className={c.dat.recommend===1?'colorblock on':'colorblock'}>精</i></li>}
                                                        <li><i className={c.dat.status===1?'colorblock on':'colorblock'}>显</i></li>
                                                    </ul>
                                                );
                                            case 'event_status':
                                                return (
                                                    <ul>
                                                        <li>
                                                            <i className="colorblock on">{c.dat}</i>
                                                        </li>
                                                    </ul>  
                                                );
                                            case 'order_idx':
                                                return (
                                                    <div className="sequence">
                                                        <input type="number" min="0" max="9999"/>
                                                    </div>
                                                );
                                            case 'comments':
                                                return (
                                                    <span>
                                                        {c.dat.type===1&&<span>{c.dat.mainthread}</span>}
                                                        {c.dat.type!==1&&<span>{c.dat.subthread}</span>}
                                                    </span>
                                                );
                                            default:
                                                return (
                                                    <span>{c.dat}</span>
                                                );
                                        }
                                    })()}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    // 渲染前事件
    ,componentWillMount: function(){
        // 没有排序项的默认列宽
        var columsWidthNoSequence = [100, 23, 8, 5, 5, 5, 5, 11, 18, 15];
        // 带排序项的默认列宽
        var columsWidthWithSequence = [100 , 23, 7, 5, 5, 5, 6, 9, 15, 5, 15];
        // 配置选项
        var threadDefCon = {
            // 列宽度
            columsWidth: columsWidthNoSequence.slice()
            // 是否有顺序列
            ,hasSequence: 0
            // 是否可选
            ,select: 1
            // 单选框列的默认宽度
            ,selectWidth: "5%"
            // 列配置
            ,colums:[
                // 头部
                {
                    name: 'head'
                    ,key:[
                        // 文章类型
                        {
                            name: 'type'
                            ,key: 'type'
                        }
                        // 用户名
                        ,{
                            name: 'creator'
                            ,key: 'from.nickName'
                        }
                        // 创建时间
                        ,{
                            name: 'time'
                            ,key: 'created'
                        }
                        // 用户Id
                        ,{
                            name: 'uid'
                            ,key: 'from.uid'
                        }
                        // 用户mId
                        ,{
                            name: 'mid'
                            ,key: 'from.mid'
                        }
                        // 是否官方帖
                        ,{
                            name:'isPublishByBg'
                            ,key:'isPublishByBg'
                        }
                    ]
                }
                // 帖子内容
                ,{
                    name: 'content'
                    ,key: [
                        // 文章缩略图
                        {
                            name:'img'
                            ,key:'from.icon'
                            ,def: 'user-icon.jpg'
                        }
                        // 文章标题
                        ,{
                            name:'title'
                            ,key:'title'
                        }
                        // 文章类型
                        ,{
                            name:'type'
                            ,key:'type'
                        }
                        // 文章内容
                        ,{
                            name:'cnt'
                            ,key:'content'
                        }
                    ]
                }
                // 板块
                ,{
                    name: 'info'
                    ,key: 'info.name'
                }
                // 浏览数
                ,{
                    name: 'views'
                    ,key: 'pv_count'
                }
                // 评论数
                ,{
                    name: 'comments'
                    ,key: [
                        {
                            name: 'mainthread'
                            ,key: 'comment_count'
                        }
                        ,{
                            name: 'subthread'
                            ,key: 'subThreads.docTotal'
                        }
                        ,{
                            name: 'type'
                            ,key: 'type'
                        }
                    ]
                } 
                // 点赞数
                ,{
                    name: 'praises'
                    ,key: 'praise_count'
                }
                // 分享数
                ,{
                    name: 'shares'
                    ,key: 'share_count'
                }
                // 状态数
                ,{
                    name: 'status'
                    ,key: [
                        // 顶 文章置顶
                        {
                            name:'top'
                            ,key:'top'
                        }
                        // 荐
                        ,{
                            name:'new_recommend'
                            ,key:'new_recommend'
                        }
                        // 精
                        ,{
                            name:'recommend'
                            ,key:'recommend'
                        }
                        // 显 显示隐藏
                        ,{
                            name:'status'
                            ,key:'status'
                        }
                        // 帖子Id
                        ,{
                            name: 'id'
                            ,key: '_id'
                        }
                        // 板块Id
                        ,{
                            name: 'infoId'
                            ,key: 'info._id'
                        }
                        // uid
                        ,{
                            name: 'uid'
                            ,key: 'from.uid'
                        }
                        // 是否后台发布的帖子
                        ,{
                            name: 'isPublishByBg'
                            ,key: 'isPublishByBg'
                        }
                        // 文章类型
                        ,{
                            name: 'type'
                            ,key: 'type'
                        }
                    ]
                }
                // 标签
                ,{
                    name: 'tag'
                    ,key: 'tag.*.title'
                }
                // 顺序
                ,{
                    name: 'order_idx'
                    ,key: [
                        // 排序字段
                        {
                            name:'sortIndex'
                            ,key:'top_order_idx'
                        }
                        // 帖子Id
                        ,{
                            name: 'id'
                            ,key: '_id'
                        }
                    ]
                }
                // 操作
                ,{
                    name: 'ctl'
                    ,key: [
                        // 文章类型
                        {
                            name:'isPublishByBg'
                            ,key:'isPublishByBg'
                        }
                        // 帖子ent_code
                        ,{
                            name: 'ent_code'
                            ,key: 'ent_code'
                        }
                        // 帖子Id
                        ,{
                            name: 'id'
                            ,key: '_id'
                        }
                        // 文章类型
                        ,{
                            name:'type'
                            ,key:'type'
                        }
                        // 文章标题
                        ,{
                            name:'title'
                            ,key:'title'
                        }
                        // 板块Id
                        ,{
                            name:'infoId'
                            ,key: 'info._id'
                        }
                    ]
                }
            ]
        };
        // 活动状态配置
        var event_statusConf = {
            name: 'event_status'
            ,key: [
                {
                    name: 'eventStartTime'
                    ,key: 'event.eventStartTime'
                }
                ,{
                    name: 'eventEndTime'
                    ,key: 'event.eventEndTime'
                }
            ]
        };
        // 按需设置列表宽度的配置项
        this.config = this.setDefColumsWidth(this.props.config, columsWidthNoSequence, columsWidthWithSequence);
        // 扩展配置
        this.conf = angular.extend(threadDefCon, this.config);
        // 设置数据
        this.setData();
    }
    /**
     * 设置默认列宽度
     * @param  {Object} config                  配置项
     * @param  {Array}  columsWidthNoSequence   没有排序项的默认列宽
     * @param  {Array}  columsWidthWithSequence 带排序项的默认列宽
     * @return {Object}                         按需设置列表宽度的配置项
     */
    ,setDefColumsWidth: function(config, columsWidthNoSequence, columsWidthWithSequence){
        if(config){
            if(!angular.isArray(config.columsWidth)){
                if(config.hasSequence){
                    config.columsWidth = columsWidthWithSequence.slice();
                }else{
                    config.columsWidth = columsWidthNoSequence.slice();
                }
            }
        }
        return config;
    }
    /**
     * 装饰数据
     * @param {Object} data 待处理的数据对象
     */
    ,decorateData: function(data){
        function getKeyDat(key, colum){
            if(data){
                var arr = key.split('.');
                var dat = data;
                var isArray = false;
                for (var i = 0; i < arr.length; i++) {
                    item = arr[i];
                    if(item === '*'){
                        isArray = true;
                        continue;
                    }
                    if(isArray){
                        var ret = [];
                        for (var j = dat.length - 1; j >= 0; j--) {
                            var im = dat[j];
                            if(im){
                                if(im[item]){
                                    ret.push(im[item]);
                                }else if(colum && colum.def){
                                    ret.push(colum.def);
                                }else{
                                    ret.push(null);
                                }
                            }
                        }
                        dat = ret;
                        return dat || null;
                    }else{
                        dat = dat[item];
                        if(dat === undefined || dat === null || dat === ''){
                            if(colum && colum.def){
                                return colum.def;
                            }else{
                                return null;
                            }
                        }
                    }
                }
            }
            return dat;
        }
        function setItemDat(colum, item){
            if(colum){
                var isMix = !!item;
                var key = isMix ? item.key : colum.key;
                if(key){
                    if(isMix){
                        if(!colum.dat){
                            colum.dat = {};
                        }
                        colum.dat[item.name] = getKeyDat(key, item);
                    }else{
                        colum.dat = getKeyDat(key, colum);
                    }
                }else{
                    colum.dat = null;
                }
            }
        }
        if(data && this.conf && angular.isArray(this.conf.colums) && this.conf.colums.length){
            var colums = this.conf.colums.slice();
            for (var i = colums.length - 1; i >= 0; i--) {
                var colum = colums[i];
                var width = this.conf.columsWidth[i];
                if(colum){
                    if(typeof width !== undefined){
                        if(typeof width === 'number'){
                            colum.width = parseInt(Math.abs(width)) + '%';
                        }else if(typeof width === 'string'){
                            colum.width = width;
                        }
                    }
                    if(angular.isArray(colum.key) && colum.key.length > 0){
                        for (var j = colum.key.length - 1; j >= 0; j--) {
                            var item = colum.key[j];
                            setItemDat(colum, item);
                        }
                    }else{
                        setItemDat(colum);
                    }
                }
            }
            return colums;
        }
        return null;
    }
    /**
     * 设置数据
     */
    ,setData: function(){
        // 没有顺序列
        var _conf = Util.copy(this.conf);
        if(_conf && !_conf.hasSequence && angular.isArray(_conf.colums) && _conf.colums.length){
            _conf.colums.splice(_conf.colums.length - 2,1);
        }
        // 活动帖配置
        var isEventThread = this.config.threadType === 'event';
        if(isEventThread){
            _conf.colums[_conf.colums.length - 2] = event_statusConf;
        }
        this.conf = _conf;
        var dat = {};
        // 整合数据
        if(this.props.source){
            dat = this.decorateData(this.props.source);
            // 活动帖装饰数据
            if(isEventThread){
                var today = new Date();
                var ret = '';
                if(new Date(dat[9].dat.eventStartTime) > today){
                    ret = "未开始";
                }else if(new Date(dat[9].dat.eventEndTime) < today){
                    ret = "已结束";
                }else{
                    ret = "进行中";
                }
                dat[9].dat = ret;
            }
            if(dat){
                dat = {
                    hd: dat[0]
                    ,bd: dat.slice(1)
                };
            }
        }
        var state = {
            dat: dat
            ,conf: this.conf
        };
        this.setState(state);
    }
});
/**
 * vue 列表实现
 * 渲染时间 197ms
 */
// 列表项指令
var VueListItem = Vue.extend({
     template: `
         <div class="M-Thread">
            <table>
                <thead>
                    <tr>
                        <th :colspan="conf.colums.length">
                            <i class="type">
                                <span v-if="dat.hd.dat.type===1">文章</span>
                                <span v-if="dat.hd.dat.type===2">话题</span>
                                <span v-if="dat.hd.dat.type===3">照片墙</span>
                            </i>
                            <i>
                                {{dat.hd.dat.creator}}
                                <span v-if="!dat.hd.dat.isPublishByBg&&dat.hd.dat.mid">
                                    ({{dat.hd.dat.mid}})
                                </span>
                            </i>
                            <i>{{dat.hd.dat.time}}</i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-if="conf.select" :width="conf.selectWidth">
                            <input type="checkbox">
                        </td>
                        <td v-for="c in dat.bd" :width="c.width">
                            <div v-if="c.name==='content'" class="content">
                                <div class="img">
                                    <img src="imgs/avatar4.png" alt="">
                                </div>
                                <span class="cnt">
                                    <span v-if="c.dat.title" class="title">
                                        {{c.dat.title}}
                                    </span>
                                    <p>{{c.dat.cnt}}</p>
                                </span>
                            </div>
                            <ul v-if="c.name==='ctl'" class="ctl">
                                <li v-show="c.dat.isPublishByBg || (c.dat.type !== 2 && c.dat.type !== 3)">
                                    编辑
                                </li>
                                <li>报表</li>
                                <li>链接</li>
                                <li>评论</li>
                                <li>删除</li>
                            </ul>
                            <ul v-if="c.name==='tag'">
                                <li v-for="tag in c.dat" v-if="tag">
                                    <i class="colorblock on">{{tag}}</i>
                                </li>
                            </ul>
                            <ul v-if="c.name==='status'">
                                <li>
                                    <i class="colorblock" :class="{on: c.dat.top===1}">
                                        顶
                                    </i>
                                </li>
                                <li>
                                    <i class="colorblock" :class="{on: c.dat.new_recommend===1}">
                                        荐
                                    </i>
                                </li>
                                <li v-show="!c.dat.isPublishByBg&&c.dat.type===1">
                                    <i class="colorblock" :class="{on: c.dat.recommend===1}">
                                        精
                                    </i>
                                </li>
                                <li>
                                    <i class="colorblock" :class="{on: c.dat.status===1}">
                                        显
                                    </i>
                                </li>
                            </ul>
                            <ul v-if="c.name==='event_status'">
                                <li>
                                    <i class="colorblock on">
                                        {{c.dat}}
                                    </i>
                                </li>
                            </ul>
                            <div v-if="c.name==='order_idx'" class="sequence">
                                <input type="number"
                                       min="0" 
                                       max="9999">
                            </div>
                            <span v-if="c.name==='comments'">
                                <span v-if="c.dat.type===1">{{c.dat.mainthread}}</span>
                                <span v-if="c.dat.type!==1">{{c.dat.subthread}}</span>
                            </span>
                            <span v-if="'views praises shares'.indexOf(c.name)!==-1">
                                {{c.dat}}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
         </div>       
     `
     ,props: {
         config: {
             type: Object
             ,default: {}
         }
         ,source: {
             type: Object
             ,default: {}
         }
     }
     ,data: function() {
         return {
             dat: {
                hd: {}
                ,bd: []
             }
             ,conf: {}
         }
     }
     ,created: function() {
         // 没有排序项的默认列宽
         var columsWidthNoSequence = [100, 23, 8, 5, 5, 5, 5, 11, 18, 15];
         // 带排序项的默认列宽
         var columsWidthWithSequence = [100 , 23, 7, 5, 5, 5, 6, 9, 15, 5, 15];
         // 配置选项
         var threadDefCon = {
             // 列宽度
             columsWidth: columsWidthNoSequence.slice()
             // 是否有顺序列
             ,hasSequence: 0
             // 是否可选
             ,select: 1
             // 单选框列的默认宽度
             ,selectWidth: "5%"
             // 列配置
             ,colums:[
                 // 头部
                 {
                     name: 'head'
                     ,key:[
                         // 文章类型
                         {
                             name: 'type'
                             ,key: 'type'
                         }
                         // 用户名
                         ,{
                             name: 'creator'
                             ,key: 'from.nickName'
                         }
                         // 创建时间
                         ,{
                             name: 'time'
                             ,key: 'created'
                         }
                         // 用户Id
                         ,{
                             name: 'uid'
                             ,key: 'from.uid'
                         }
                         // 用户mId
                         ,{
                             name: 'mid'
                             ,key: 'from.mid'
                         }
                         // 是否官方帖
                         ,{
                             name:'isPublishByBg'
                             ,key:'isPublishByBg'
                         }
                     ]
                 }
                 // 帖子内容
                 ,{
                     name: 'content'
                     ,key: [
                         // 文章缩略图
                         {
                             name:'img'
                             ,key:'from.icon'
                             ,def: 'user-icon.jpg'
                         }
                         // 文章标题
                         ,{
                             name:'title'
                             ,key:'title'
                         }
                         // 文章类型
                         ,{
                             name:'type'
                             ,key:'type'
                         }
                         // 文章内容
                         ,{
                             name:'cnt'
                             ,key:'content'
                         }
                     ]
                 }
                 // 板块
                 ,{
                     name: 'info'
                     ,key: 'info.name'
                 }
                 // 浏览数
                 ,{
                     name: 'views'
                     ,key: 'pv_count'
                 }
                 // 评论数
                 ,{
                     name: 'comments'
                     ,key: [
                         {
                             name: 'mainthread'
                             ,key: 'comment_count'
                         }
                         ,{
                             name: 'subthread'
                             ,key: 'subThreads.docTotal'
                         }
                         ,{
                             name: 'type'
                             ,key: 'type'
                         }
                     ]
                 } 
                 // 点赞数
                 ,{
                     name: 'praises'
                     ,key: 'praise_count'
                 }
                 // 分享数
                 ,{
                     name: 'shares'
                     ,key: 'share_count'
                 }
                 // 状态数
                 ,{
                     name: 'status'
                     ,key: [
                         // 顶 文章置顶
                         {
                             name:'top'
                             ,key:'top'
                         }
                         // 荐
                         ,{
                             name:'new_recommend'
                             ,key:'new_recommend'
                         }
                         // 精
                         ,{
                             name:'recommend'
                             ,key:'recommend'
                         }
                         // 显 显示隐藏
                         ,{
                             name:'status'
                             ,key:'status'
                         }
                         // 帖子Id
                         ,{
                             name: 'id'
                             ,key: '_id'
                         }
                         // 板块Id
                         ,{
                             name: 'infoId'
                             ,key: 'info._id'
                         }
                         // uid
                         ,{
                             name: 'uid'
                             ,key: 'from.uid'
                         }
                         // 是否后台发布的帖子
                         ,{
                             name: 'isPublishByBg'
                             ,key: 'isPublishByBg'
                         }
                         // 文章类型
                         ,{
                             name: 'type'
                             ,key: 'type'
                         }
                     ]
                 }
                 // 标签
                 ,{
                     name: 'tag'
                     ,key: 'tag.*.title'
                 }
                 // 顺序
                 ,{
                     name: 'order_idx'
                     ,key: [
                         // 排序字段
                         {
                             name:'sortIndex'
                             ,key:'top_order_idx'
                         }
                         // 帖子Id
                         ,{
                             name: 'id'
                             ,key: '_id'
                         }
                     ]
                 }
                 // 操作
                 ,{
                     name: 'ctl'
                     ,key: [
                         // 文章类型
                         {
                             name:'isPublishByBg'
                             ,key:'isPublishByBg'
                         }
                         // 帖子ent_code
                         ,{
                             name: 'ent_code'
                             ,key: 'ent_code'
                         }
                         // 帖子Id
                         ,{
                             name: 'id'
                             ,key: '_id'
                         }
                         // 文章类型
                         ,{
                             name:'type'
                             ,key:'type'
                         }
                         // 文章标题
                         ,{
                             name:'title'
                             ,key:'title'
                         }
                         // 板块Id
                         ,{
                             name:'infoId'
                             ,key: 'info._id'
                         }
                     ]
                 }
             ]
         };
         // 活动状态配置
         var event_statusConf = {
             name: 'event_status'
             ,key: [
                 {
                     name: 'eventStartTime'
                     ,key: 'event.eventStartTime'
                 }
                 ,{
                     name: 'eventEndTime'
                     ,key: 'event.eventEndTime'
                 }
             ]
         };
         // 按需设置列表宽度的配置项
         this.config = this.setDefColumsWidth(this.config, columsWidthNoSequence, columsWidthWithSequence);
         // 扩展配置
         this.conf = angular.extend(threadDefCon, this.config);
         // 设置数据
         this.setData();
     }
     ,methods: {
         /**
          * 设置默认列宽度
          * @param  {Object} config                  配置项
          * @param  {Array}  columsWidthNoSequence   没有排序项的默认列宽
          * @param  {Array}  columsWidthWithSequence 带排序项的默认列宽
          * @return {Object}                         按需设置列表宽度的配置项
          */
         setDefColumsWidth: function(config, columsWidthNoSequence, columsWidthWithSequence){
             if(config){
                 if(!angular.isArray(config.columsWidth)){
                     if(config.hasSequence){
                         config.columsWidth = columsWidthWithSequence.slice();
                     }else{
                         config.columsWidth = columsWidthNoSequence.slice();
                     }
                 }
             }
             return config;
         }
         /**
          * 装饰数据
          * @param {Object} data 待处理的数据对象
          */
         ,decorateData: function(data){
             function getKeyDat(key, colum){
                 if(data){
                     var arr = key.split('.');
                     var dat = data;
                     var isArray = false;
                     for (var i = 0; i < arr.length; i++) {
                         item = arr[i];
                         if(item === '*'){
                             isArray = true;
                             continue;
                         }
                         if(isArray){
                             var ret = [];
                             for (var j = dat.length - 1; j >= 0; j--) {
                                 var im = dat[j];
                                 if(im){
                                     if(im[item]){
                                         ret.push(im[item]);
                                     }else if(colum && colum.def){
                                         ret.push(colum.def);
                                     }else{
                                         ret.push(null);
                                     }
                                 }
                             }
                             dat = ret;
                             return dat || null;
                         }else{
                             dat = dat[item];
                             if(dat === undefined || dat === null || dat === ''){
                                 if(colum && colum.def){
                                     return colum.def;
                                 }else{
                                     return null;
                                 }
                             }
                         }
                     }
                 }
                 return dat;
             }
             function setItemDat(colum, item){
                 if(colum){
                     var isMix = !!item;
                     var key = isMix ? item.key : colum.key;
                     if(key){
                         if(isMix){
                             if(!colum.dat){
                                 colum.dat = {};
                             }
                             colum.dat[item.name] = getKeyDat(key, item);
                         }else{
                             colum.dat = getKeyDat(key, colum);
                         }
                     }else{
                         colum.dat = null;
                     }
                 }
             }
             if(data && this.conf && angular.isArray(this.conf.colums) && this.conf.colums.length){
                 var colums = this.conf.colums.slice();
                 for (var i = colums.length - 1; i >= 0; i--) {
                     var colum = colums[i];
                     var width = this.conf.columsWidth[i];
                     if(colum){
                         if(typeof width !== undefined){
                             if(typeof width === 'number'){
                                 colum.width = parseInt(Math.abs(width)) + '%';
                             }else if(typeof width === 'string'){
                                 colum.width = width;
                             }
                         }
                         if(angular.isArray(colum.key) && colum.key.length > 0){
                             for (var j = colum.key.length - 1; j >= 0; j--) {
                                 var item = colum.key[j];
                                 setItemDat(colum, item);
                             }
                         }else{
                             setItemDat(colum);
                         }
                     }
                 }
                 return colums;
             }
             return null;
         }
         /**
          * 设置数据
          */
         ,setData: function(){
             // 没有顺序列
             var _conf = Util.copy(this.conf);
             if(_conf && !_conf.hasSequence && angular.isArray(_conf.colums) && _conf.colums.length){
                 _conf.colums.splice(_conf.colums.length - 2,1);
             }
             // 活动帖配置
             var isEventThread = this.config.threadType === 'event';
             if(isEventThread){
                 _conf.colums[_conf.colums.length - 2] = event_statusConf;
             }
             var dat = {};
             // 整合数据
             if(this.source){
                 dat = this.decorateData(this.source);
                 // 活动帖装饰数据
                 if(isEventThread){
                     var today = new Date();
                     var ret = '';
                     if(new Date(dat[9].dat.eventStartTime) > today){
                         ret = "未开始";
                     }else if(new Date(dat[9].dat.eventEndTime) < today){
                         ret = "已结束";
                     }else{
                         ret = "进行中";
                     }
                     dat[9].dat = ret;
                 }
                 if(dat){
                     dat = {
                         hd: dat[0]
                         ,bd: dat.slice(1)
                     };
                 }
             }
             this.dat = dat;
             this.conf = _conf;
         }
     }
});
// 列表指令
var VueList = Vue.extend({
    template: `
        <div class="M-List">
            <ul>
                <li>
                    <button @click.stop="render()">渲染列表</button>
                    <button @click.stop="remove()">移除列表</button>
                </li>
                <li v-for="item in data" track-by="$index">
                    <list-item :source="item" :config="item.itemConf"></list-item>
                </li>
            </ul>
        </div>
    `
    ,data: function() {
        return {
            data: []
        }
    }
    ,created: function() {
        // 配置选项
        var listDefCon = {
            // 组件唯一标识
            key: ''
            // 列表项类型
            ,itemType: 'thread'
            // 没有数据提示文案
            ,noDataTip: '暂无数据'
            // 列表项配置
            ,itemConf:{
                // 是否有顺序列
                hasSequence: 0
                // 是否可选
                ,select: 1
                // 单选框列的默认宽度
                ,selectWidth: "5%"
            }
            // 列宽度
            ,columsWidth: []
        };
        // 扩展配置
        this.conf = listDefCon;
    }
    ,methods: {
        render: function() {
            this.setData(listData);
        }
        ,remove: function(){
            this.setData();
        }
        ,setData: function(data){
            this.data = [];
            if(angular.isArray(data) && data.length){
                var _data = data.slice();
                var conf = this.conf;
                var itemConf = Util.copy(conf.itemConf);
                if(angular.isArray(conf.columsWidth) && conf.columsWidth.length){
                    itemConf.columsWidth = conf.columsWidth;
                }
                for (var i = _data.length - 1; i >= 0; i--) {
                    var listItem = _data[i];
                    if(listItem){
                        listItem.itemConf = itemConf;
                    }
                }
                this.data = _data;
            }
        }
    }
    ,components: {
        listItem: VueListItem
    }
});
// 注册
Vue.component('vue-list', VueList);
// 创建根实例
new Vue({
    el: '#vue'
});

var a = [1,2,,];


