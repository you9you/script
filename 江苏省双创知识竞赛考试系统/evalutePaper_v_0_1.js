// ==UserScript==
// @name         evalutePaper
// @namespace    https://github.com/you9you
// @version      0.1
// @description  自动答题
// @author       you9you
// @match        *://218.94.132.148/wap/*
// @match        *://218.94.132.148:81/wap/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let main = (paperId) => {
        $.when(getQuestionInfo(paperId)).done(function(ret){
            let response = ret['response'];
            let titleItems = response['titleItems'];
            
            // 整合题目列表
            let stuList = [];
            response['titleItems'].forEach(function(group, index){
                group['questionItems'].forEach(function(item, index){
                    stuList.push(item);
                });
            });
            console.log(stuList);
            
            
            // 处理题目
            let answerItems = [];
            stuList.forEach(function(item, index){
                let id = index + 1;
                
                // 保存进度
                answerItems.push({
                    questionId: item['id'], 
                    content: item['correct'], 
                    contentArray: item['correctArray'], 
                    completed: true, 
                    itemOrder: id
                });
                
            });
            
            // 提交记录
            submitAnswer(getRndInteger(60, 180), paperId, answerItems);
            
        });
        console.log('done');
    };
    
    
    // 当前题目信息
    let getQuestionInfo = (id) => {
        return $.ajax({
            url: '/exam/api/student/exam/paper/select/' + id,
            type: 'post',
            dataType: 'json'
        });
    };
    
    
    // 提交进度
    let submitAnswer = (doTime, id, answerItems) => {
        return $.ajax({
            url: "/exam/api/student/exampaper/answer/answerSubmit",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                doTime: doTime,
                id: id,
                questionId: null,
                answerItems: answerItems
            }),
            dataType: 'json'
        });
    };
    
    // 随机数
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    
    // button运行(用户接口), 可能需要刷新才显示
    window.onload = function(){
        let time = new Date().getTime();
        eval("window.main_" + time + "=main");
        
        let html = '';
        //html += '<input type="text" id="url_' + time + '">';
        //html += '<button onclick="main_' + time + '($(\'input#url_' + time + '\').val())">Run</button>';
        html += '<button onclick="for(let i=41;i<80;i++)main_' + time + '(i)">Run</button>';
        
        $("body").before(html);
        
        // 滚动
        $('html').animate({scrollTop: "0"});
    };
    
})();
