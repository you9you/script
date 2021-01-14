// ==UserScript==
// @name         evalutePaper
// @namespace    https://github.com/you9you
// @version      0.1
// @description  自动答题
// @author       you9you
// @match        *://aq.fhmooc.com/evalutePaper/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    let courseId = 'qkcfawcsxyrom0zrwghhwq';

    let main = () => {
        $.when(getStuPaper(courseId)).done(function(ret){
            let paperId = ret['paperId'];
            let paperStuId = ret['paperStuId'];
            let stuPaperQuesList = ret['stuPaperQuesList'];
            
            // 题目列表
            stuPaperQuesList.forEach(function(item, index){
                // 题目信息
                let quesId = item['quesId'];
                $.when(getQuestionInfo(quesId)).done(function(ret){
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
                    saveStuQuesAnswer(paperStuId, paperId, quesId, answer);
                });
            });
            
        })
        console.log('done');
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
    
    // button运行(用户接口), 可能需要刷新才显示
    window.onload = function(){
        let time = new Date().getTime();
        eval("window.main_" + time + "=main");
        
        $('div.submit-exam-con').append('<button onclick="main_' + time + '()" class="ant-btn ant-btn-primary ant-btn-block">Run</button>');
    };
    
})();
