import React from 'react';
import { Router, Route, Link, IndexLink, hashHistory, IndexRoute } from 'react-router';
import $ from 'jquery';

export default class List extends React.Component{
    constructor() {
        super();
        this.state = {
            page: 1,
            queList: [],
            loading: true,
            loadingMore: false,
            tag: ''
        };
        this.scrollUpdate = this._scrollUpdate.bind(this);
    }

    // 页面滚动加载
    _scrollUpdate(e) {
        let scrollTop = $(window).scrollTop();
        let scrollHeight = $(document).height();
        let windowHeight = $(window).height();
        let tag = '';
        let url = '';
        
        try{
            tag = this.props.params.id
        } catch(err) {
            console.log(err);
        }
        
        if (tag) {
            url = 'http://127.0.0.1:3000/tag';
        } else {
            url = 'http://127.0.0.1:3000';
        }

        if (scrollTop + windowHeight + 100 >= scrollHeight && this.state.loadingMore) {
            this.setState({
                loading: true,
                loadingMore: false
            });

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: {
                    page: this.state.page,
                    tag: tag
                },
                success: function(res) {
                    let listData = this.state.queList.concat(res);
                    this.setState({
                        queList: listData,
                        page: (this.state.page + 1),
                        loading: false,
                        loadingMore: true,
                        tag: tag
                    })
                }.bind(this)
            })
        }
    }

    componentDidUpdate(prevProps){
        var tag = this.props.params.id;
        var oldTag = prevProps.params.id;
        var firstPage = 1;
        if (tag !== oldTag){
            this.setState({
                quelist:[],
                loading:true,
                tag:tag,
                page:firstPage,
                loadingMore:false
            });
        this.updateState(firstPage,tag);
        }
    }
    
    // 组件渲染完成之后立即执行
    componentDidMount() {
        let tag = '';
        try{
            tag = this.props.params.id
        } catch(err) {
            console.log(err);
        }
        
        this.updateState(this.state.page, tag);
    }
    
    // 获取列表组件
    updateState(page, tag) {
        let url = '';
        if (tag) {
            url = 'http://127.0.0.1:3000/tag';
        } else {
            url = 'http://127.0.0.1:3000';
        }

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                page: page,
                tag: tag
            },
            success: function(res) {
                this.setState({
                    queList: res,
                    page: (this.state.page + 1),
                    loading: false,
                    loadingMore: true
                })
            }.bind(this)
        })
        window.addEventListener('scroll',this.scrollUpdate);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.scrollUpdate);
    }
    routerWillLeave(){
        window.removeEventListener('scroll', this.scrollUpdate);
    }

    render() {
        let _list = this.state.queList.map(function(item, index) {
            return (
                <li key={item.title.titleSrc + index}>
                    <div className="vote">
                        {item.votes}
                        <small>投票</small>
                    </div>
                    <div className="summary">
                        <Link className="summaryTitle" to={`/question/${item.title.titleSrc}`}>
                            {item.title.content}
                        </Link>
                        <p className="user-time">{item.author}{item.time}</p>
                    </div>
                    <div className="view-answers">
                        <strong>{item.answers}</strong>/{item.views}
                    </div>
                </li>
            )
        }.bind(this))

        let isNone = !!this.state.loading ? "block" : "none";
        return (
            <div className="main">
                <ul>
                    {_list}
                </ul>
                <div style={{display: isNone}}className='loading'>loading</div>
            </div>
        )

    }
}