import 'normalize.css';
import './public/css/index.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import Header from './components/Header/Header.jsx';
import List from './components/List/List.jsx';
import Question from './components/Question/Question.jsx';
import Leftbar from './components/Leftbar/Leftbar.jsx';

class Main extends React.Component{
    render(){
        return (
            <div id="wrap">
                <Header />
                {this.props.children}
                <Leftbar />
            </div>
        );
    }
}

const app = document.createElement('div');
document.body.appendChild(app);

ReactDOM.render(<Router history={hashHistory}>
    <Route path="/" component={Main}>
        <IndexRoute component={List}/>
        <Route path="/question/:questionId" component={Question}/>
        <Route path="/tag/:id" component={List}></Route>
    </Route>
</Router>, app);
