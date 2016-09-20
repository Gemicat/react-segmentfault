import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import $ from "jquery";
import Back from '../Back/Back.jsx'

export default class Question extends React.Component{
    constructor() {
        super();
        this.state = {
            loading: true,
            Qdata: {
                question: {
                    title: '',
                    question: '',
                    count: '',
                    authorTime: ''
                },
                comment: []
            }
        }
    }
    
    // 组件渲染完成执行获取当前新闻
    componentWillMount() {
        let id = this.props.params.questionId;
        $.ajax({
            url: 'http://127.0.0.1:3000/question',
            type: 'get',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(res) {
                if (res) {
                    this.setState({
                        Qdata:res,
                        loading:false
                    })
                }
            }.bind(this)
        });
    }

    render() {
        let data = this.state.Qdata;
        
        // 评论列表遍历
        let _list = data.comment.map(function(item, index) {
            return (
                <div className="com-list fmt" key={index}>
                    <div className="com-content" dangerouslySetInnerHTML={{__html: item.answer}}>
                    </div>
                    <div className="comUser">
                        <div className="comUserLeft">
                            {item.time}
                        </div>
                        <div className="comUserRight">
                            <img src={item.avatar}/>
                            <div>
                                <span className="comNmae">{item.name}</span>
                                <span>{item.rank}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
        
        // 渲染
        return (
            <div className="main question">
                <div className="questionTop">
                    <p className="question-title">
                        {data.question.title}
                    </p>
                    <p className="question-user">
                        {data.question.authorTime}
                    </p>
                </div>
                <div className="question-main fmt" dangerouslySetInnerHTML={{__html:data.question.question}}>
                </div>
                <h2 className="com-title">评论列表</h2>
                {_list}
                <Back/>
            </div>
        );
    }
}