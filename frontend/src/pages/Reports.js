import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Button, Table, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;
      const response = await axios.get('/api/reports', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      });
      setReportData(response.data);
    } catch (error) {
      message.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount?.toFixed(2) || '0.00'}`,
    },
  ];

  return (
    <div>
      <Card title="Financial Reports">
        <div style={{ marginBottom: 16 }}>
          <RangePicker 
            value={dateRange} 
            onChange={setDateRange} 
            style={{ marginRight: 8 }} 
          />
          <Button type="primary" onClick={fetchReportData} loading={loading}>
            Generate Report
          </Button>
        </div>

        <Table 
          dataSource={reportData} 
          columns={columns} 
          rowKey="type"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Reports;
