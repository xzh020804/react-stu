import { addHospitalSet } from '@/api/hospital/hospitalSet'
import { Button, Card, Form, Input, message, Space } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddOrUpdate() {
  const [form] =Form.useForm()
  const navigate = useNavigate()
  const onFinish = async() => {
    let data = form.getFieldsValue()
    try{
      await addHospitalSet(data)
      message.success('添加成功')
      navigate('/syt/hospital/hospitalSet')
    }catch(e){
      message.error('添加失败')
    }
    

  }
  return (
      <Card>
          <Form
              form={form}
              name="basic"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
              onFinish={onFinish}

          >
              <Form.Item
                  label="医院名称"
                  name="hosname"
                  rules={[{ required: true, message: '请输入医院名称!' }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  label="医院编号"
                  name="hoscode"
                  rules={[{ required: true, message: '请输入医院编号!' }]}
              >
                  <Input />
              </Form.Item>
              <Form.Item
                  label="api基础路径"
                  name="apiUrl"
                  rules={[{ required: true, message: '请输入api基础路径!' }]}
              >
                  <Input />
              </Form.Item>
              <Form.Item
                  label="联系人姓名"
                  name="contactsName"
                  rules={[{ required: true, message: '请输入联系人姓名!' }]}
              >
                  <Input />
              </Form.Item>
              <Form.Item
                  label="联系人手机"
                  name="contactsPhone"
                  rules={[{ required: true, message: '请输入联系人手机!' }]}
              >
                  <Input />
              </Form.Item>


              <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                  <Space>
                      <Button type="primary" htmlType="submit">
                          保存
                      </Button>
                      <Button>返回</Button>
                  </Space>
              </Form.Item>
          </Form>
      </Card>
  )
}
