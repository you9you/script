// ==UserScript==
// @name         evalutePaper
// @namespace    https://github.com/you9you
// @version      0.2
// @description  自动答题
// @author       you9you
// @match        *://aq.fhmooc.com/evalutePaper/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    let courseId = 'qkcfawcsxyrom0zrwghhwq';
    
    let main = () => {
        let ajaxList_getQuestionInfo = [];
        let ajaxList_saveStuQuesAnswer = [];
        
        $.when(getStuPaper(courseId)).done(function(ret){
            let paperId = ret['paperId'];
            let paperStuId = ret['paperStuId'];
            let stuPaperQuesList = ret['stuPaperQuesList'];
            
            // 题目列表
            stuPaperQuesList.forEach(function(item, index){
                // 题目id
                let quesId = item['quesId'];
                
                ajaxList_getQuestionInfo.push(getQuestionInfo(quesId));
            });
            
            // 题目列表加载完成
            $.when.apply($, ajaxList_getQuestionInfo).done(function(ret){
                Array.from(arguments).forEach(function(item, index){
                    ret = item[0];
                    
                    let quesId = ret['quesInfo'][0]['questionId'];
                    let answers = ret['quesInfo'][0]['answers'];
                    let answer = '';
                    
                    answers.forEach(function(item, index){
                        if(index == 0){
                            answer += item;
                        }else{
                            answer += '；' + item;
                        }
                    });
                    
                    // 保存进度
                    ajaxList_saveStuQuesAnswer.push(saveStuQuesAnswer(paperStuId, paperId, quesId, answer));
                });
                
                // 保存进度完成
                $.when.apply($,ajaxList_saveStuQuesAnswer).then(function(){
                    submit(paperStuId, paperId);
                    window.location.href = "http://aq.fhmooc.com/assessDetail/" + courseId;
                    console.log('done');
                });
            });
        });
    };
    
    
    // 题目信息
    let getQuestionInfo = (quesId) => {
        return $.ajax({
            url: "/api/portal/PaperStuByQuesType/getQuestionInfo",
            type: 'post',
            data: {
                quesId: quesId
            },
            dataType: 'json'
        });
    };
    
    // 测试题目信息
    let getStuPaper = (courseId) => {
        return $.ajax({
            url: "/api/design/PaperStudent/getStuPaper",
            type: 'post',
            data: {
                courseId: courseId
            },
            dataType: 'json'
        });
    };
    
    // 保存进度
    let saveStuQuesAnswer = (paperStuId, paperId, quesId, answer) => {
        return $.ajax({
            url: "/api/design/PaperStudent/saveStuQuesAnswer",
            type: 'post',
            data: {
                paperStuId: paperStuId,
                paperId: paperId,
                quesId: quesId,
                answerJson: '{"quesId":"' + quesId + '","answer":"' + answer + '"}'
            },
            dataType: 'json'
        });
    };
    
    // 提交
    let submit = (paperStuId, paperId) => {
        return $.ajax({
            url: "/api/design/PaperStudent/submitStuPaper",
            type: 'post',
            data: {
                paperStuId: paperStuId,
                paperId: paperId
            },
            dataType: 'json'
        });
    };
    
    // button运行(用户接口), 可能需要刷新才显示
    window.onload = function(){
        let time = new Date().getTime();
        eval("window.main_" + time + "=main");
        
        $('div.submit-exam-con').append('<button onclick="main_' + time + '()" class="ant-btn ant-btn-primary ant-btn-block">Run</button>');
    };
    
})();
