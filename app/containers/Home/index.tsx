import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import './index.css';
import {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
} from '../../actions/counter';
import { counterStateType } from '../../reducers/types';

function Home() {
  return (
    <div className="home">
      <Button type="primary" style={{ margin: 10 }}>
        Hello
      </Button>
      <Link to="/foo">Foo</Link>
    </div>
  );
}

function mapStateToProps(state: counterStateType) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      increment,
      decrement,
      incrementIfOdd,
      incrementAsync
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
