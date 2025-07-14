import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleCreateInvoice = async (values) => {
    try {
      await axios.post('/api/invoices', values);
      fetchInvoices();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => console.log('Edit:', record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Create Invoice
      </Button>

      <Table dataSource={invoices} columns={columns} rowKey="_id" />

      <Modal
        title="Create New Invoice"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateInvoice}>
          <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="customer" label="Customer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="sent">Sent</Option>
              <Option value="paid">Paid</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Invoices;
