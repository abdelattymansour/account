import React, { useContext } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {auth.user?.name}</h1>
      
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Invoices" value={0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Customers" value={0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Revenue" value={0} precision={2} prefix="$" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
