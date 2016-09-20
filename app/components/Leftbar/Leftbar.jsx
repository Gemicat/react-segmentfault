import React from 'react';
import { Router, Route, Link,IndexLink , hashHistory, IndexRoute } from 'react-router';
import leftBarConfig from  '../../config/leftbar.config.js';

export default class LeftBar extends React.Component{
    
    constructor() {
        super();
        this.state = {
            leftBarConfig: []
        }
    }

    componentWillMount() {
        this.setState({
            leftBarConfig: leftBarConfig
        })
    }

    render() {
        let _list = this.state.leftBarConfig.map(function(item, index) {
            return (
                <li key={item}>
                    <Link to={`/tag/${item}`}>
                        {item}
                    </Link>
                </li>
            );
        });

        return (
            <aside className="leftBar">
                <ul>
                    <li><IndexLink to="/" key="99999">首页</IndexLink></li>
                    {_list}
                </ul>
            </aside>
        );
    }
}