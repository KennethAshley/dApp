import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { withRouter } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import TopBar from './TopBar';
import Trades from './Trade/Trades';
import Wallet from './Wallet';
import OrdersPositionsFills from './OrdersPositionsFills/Index';

import '../../less/SimExchange.less';
import OrderBook from './OrderBook/Orders';
import TradeHistory from './TradeHistory/Trades';
import TradeChart from './TradeChart/Chart';

class SimExchange extends Component {
  componentDidMount() {
    if (!this.props.contracts) {
      const network = this.props.web3.web3Instance.version.network;

      this.props.getContracts(network === 'truffle');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.contracts && !this.props.contract) {
      let filteredContracts = _.filter(this.props.contracts, contract => {
        return (
          contract.isSettled === false &&
          moment.unix(contract.EXPIRATION).isAfter(moment())
        );
      });

      this.props.selectContract(filteredContracts[0]);
    }
  }

  render() {
    const { contract, contracts } = this.props;

    if (!this.props.shouldRender) {
      return (
        <div
          className="text-center"
          style={{ fontSize: '18px', padding: '4em' }}
        >
          <strong>Coming soon...</strong>
        </div>
      );
    }

    return (
      <div style={{ padding: '15px' }} id="sim-exchange">
        <Row
          type="flex"
          justify="space-between"
          className="sim-ex-container contract-container"
        >
          <TopBar
            contract={contract}
            contracts={contracts}
            onSelectContract={this.props.selectContract}
            getContracts={this.props.getContracts}
          />
        </Row>
        <Row type="flex" justify="space-between">
          <Col lg={6} xl={5}>
            <div className="column-container">
              <Wallet {...this.props} />
              <Trades {...this.props} />
            </div>
          </Col>
          <Col lg={5} xl={5}>
            <div className="column-container">
              <OrderBook {...this.props} />
            </div>
          </Col>
          <Col lg={7} xl={9}>
            <div className="column-container">
              <TradeChart {...this.props} />
              <OrdersPositionsFills {...this.props} />
            </div>
          </Col>
          <Col lg={6} xl={5}>
            <div className="column-container" style={{ paddingRight: '0' }}>
              <TradeHistory {...this.props} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(SimExchange);
