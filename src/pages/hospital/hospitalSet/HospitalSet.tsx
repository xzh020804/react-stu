import { deleteHospitalSetById, getHospitalSetList, removeBatch } from '@/api/hospital/hospitalSet'
import { IHospitalSetItem, IHospitalSetList } from '@/api/hospital/model/hospitalSetTypes'
import{EditOutlined,DeleteOutlined,SearchOutlined,ExclamationCircleFilled} from '@ant-design/icons'
import { Button, Card, Form, Input, Space, Table, Modal, message } from 'antd'

import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function HospitalSet() {
  const navigate = useNavigate()
  const columns:ColumnsType<IHospitalSetItem> = [
    {
      title:'序号',
      align:'center',
      width:60,
      render(value:any,row:any,index:number){
        return (current - 1) * pageSize + index + 1

      }
    },
    {
      title:'医院名称',
      dataIndex:'hosname'
    },
    {
      title:'医院编号',
      dataIndex:'hoscode'
    },
    {
      title:'api基础路径',
      dataIndex:'apiUrl'
    },
    {
      title:'签名',
      dataIndex:'signKey'
    },
    {
      title:'联系人名称',
      dataIndex:'contactsName'
    },
    {
      title:'联系人手机',
      dataIndex:'contactsPhone'
    },
    {
      title:'操作',
      width:120,
      fixed:'right',
      render(row:any){
        return (
          <Space>
            <Button type='primary' icon={<EditOutlined />} onClick={() => navigate('/syt/hospital/hospitalSet/edit/' + row.id)}></Button>
            <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => deleteById(row.id) }></Button>
          </Space>
        )
      }
    }
  ]
  //声明状态
  let[current,setCurrent] = useState<number>(1)
  let[pageSize,setPageSize] = useState<number>(3)
  let[total,setTotal] = useState<number>()
  let[hospitalList,setHospitalList] = useState<IHospitalSetList>([])
  let[hosname,setHosname] = useState<string>()
  let[hoscode,setHoscode] = useState<string>()
  let[loading,setLoading] = useState<boolean>(false)
  let[selectedKeys,setSelectedKeys] = useState<React.Key[]>([])
  const[form] = Form.useForm()
  const { confirm } = Modal;

  const deleteById = (id:string) =>{
    confirm({
      title: '删除当前记录',
      icon: <ExclamationCircleFilled />,
      content: '确认要删除吗',
      async onOk() {
        await deleteHospitalSetById(id)
        message.success('删除成功')
        _getHospitalSetList()
      },
      onCancel() {
        console.log('Cancel');
      },
    });


  }
  const search = () =>{
    let{hosname,hoscode} = form.getFieldsValue()
    setHoscode(hoscode)
    setHosname(hosname)
    setCurrent(1)
  }
  const clear = () =>{
    form.resetFields()
    setCurrent(1)
    setHoscode('')
    setHosname('')
  }
  async function _getHospitalSetList() {
    setLoading(true)
    let{records,total} = await getHospitalSetList(current,pageSize,hosname,hoscode)
    setHospitalList(records)
    setTotal(total)
    setLoading(false)
    
  }
  useEffect(() =>{
    _getHospitalSetList()

  },[current,pageSize,hoscode,hosname])
  return (
    <Card>
      <Form 
        layout='inline'
        form={form}
        onFinish={search}
      >
        <Form.Item name="hosname">
          <Input placeholder='医院名称'></Input>
        </Form.Item>
        <Form.Item name="hoscode">
          <Input placeholder='医院编号'></Input>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' icon={<SearchOutlined />} htmlType='submit'>
              查询
            </Button>
            <Button onClick={clear}>
              清空
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Space className='mt'>
        <Button type='primary' onClick={() => navigate('/syt/hospital/hospitalSet/add')}>添加</Button>
        <Button disabled={selectedKeys.length === 0} onClick={
          () =>{
            confirm({
              title: '删除当前记录',
              icon: <ExclamationCircleFilled />,
              content: '确认要删除勾选记录吗',
              async onOk() {
                await removeBatch(selectedKeys)
                message.success('批量删除成功')
                setSelectedKeys([])
                _getHospitalSetList()
              },
              onCancel() {
                console.log('Cancel');
              },
            });

          }
        }>批量删除</Button>
      </Space>
      <Table
        loading={loading}
        rowKey={'id'}
        className='mt'
        scroll={{
          x:2000
        }}
        rowSelection={{
          onChange(selectedKeys:React.Key[]){
            setSelectedKeys(selectedKeys)
          }
        }}
        columns={columns}
        dataSource={hospitalList}
        pagination={{
          current,
          pageSize,
          total,
          showQuickJumper:true,
          showSizeChanger:true,
          pageSizeOptions:[3,5,10,20],
          onChange:(page:number, pageSize:number)=>{
            setCurrent(page);
            setPageSize(pageSize)
          }
        }}
      ></Table>
    </Card>
  )
}
