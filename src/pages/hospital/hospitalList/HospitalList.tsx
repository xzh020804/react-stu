import { Card, Form, Select,Input, Button, Space, Table, Image,   } from 'antd'
import{SearchOutlined} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { changeStatus, getHospitalList } from '@/api/hospital/hospitalList'
import { IDistrictList, IHospitalItem, IHospitalList } from '@/api/hospital/model/hospitalListTypes'

import { useNavigate } from 'react-router-dom'

const {Option} = Select
export default function HospitalList() {
  const navigate = useNavigate()
  const [form]= Form.useForm()
  const columns:ColumnsType<IHospitalItem> =[
    {
      title:'序号',
      render(value:any,row:any,index:number){
        return (current - 1) * pageSize + index + 1
      }
    },
    {
      title:'医院logo',
      render(row:IHospitalItem){
        return(
          <Image width={100} src={'data:image/jpg;base64,' + row.logoData}/>
        )
      }
    },
    {
      title:'医院名称',
      dataIndex:'hosname'
    },
    {
      title:'等级',
      render(row:IHospitalItem){
        return row.param.hostypeString
    }
    },
    {
      title:'详细地址',
      render(row:IHospitalItem){
        return row.param.fullAddress
    }
    },
    {
      title:'状态',
      render(row:IHospitalItem){
        return row.status ? '已上线' : '未上线'
    }
    },
    {
      title:'创建时间',
      dataIndex:'createTime'
    },
    {
      title:'操作',
      render(row:IHospitalItem){
        return (
            <Space>
                <Button type='primary' onClick={() => navigate('/syt/hospital/hospitalList/show/' + row.id)}>查看</Button>
                <Button type='primary' onClick={() => navigate('/syt/hospital/hospitalList/schedule/' + row.hoscode)}>排班</Button>
                <Button type='primary' onClick={() => updateStatus(row.id,row.status === 1 ? 0 : 1 )}>{row.status ? '下线' : '上线'}</Button>
            </Space>
        )
    }
    }
  ]
  let [provinceList, setProvinceList] = useState<IDistrictList>([])
    let [cityList, setCityList] = useState<IDistrictList>([])
    let [dictList, setDictList] = useState<IDistrictList>([])
    // 医院类型
    let [typeList, setTypeList] = useState<IDistrictList>([])
    // 医院列表分页数据
    let [hospitalList, setHospitalList] = useState<IHospitalList>([]);
    let [current, setCurrent] = useState<number>(1);
    let [pageSize, setPageSize] = useState<number>(3);
    let [total, setTotal] = useState<number>(10);

    let [loading, setLoading] = useState<boolean>(false);

    const _getHospitalList = async ()=>{
    setLoading(true)
    let {content,totalElements} = await getHospitalList({page:current,limit:pageSize})
    setHospitalList(content)
    setTotal(totalElements)
    setLoading(false)
   }

   const updateStatus = async(id:string,status:number)=>{
    await changeStatus(id,status)
    _getHospitalList()
   }

useEffect(() => {
  _getHospitalList()
  
}, [pageSize,current])
  return (
    <Card>
      <Form layout='inline' form={form}>
                <Form.Item name='provinceCode'>
                    <Select
                        className='mb'
                        placeholder='请选择省'
                        style={{ width: 180 }}
                    >
                        {provinceList.map(province => (
                            <Option value={province.value} key={province.id}>{province.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='cityCode'>
                    <Select
                        placeholder='请选择市'
                        style={{ width: 180 }}
                    >
                        {cityList.map(city => (
                            <Option key={city.id} value={city.value}>{city.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='districtCode'>
                    <Select placeholder='请选择区' style={{ width: 180 }}>
                        {dictList.map(dict => (
                            <Option key={dict.id} value={dict.value}>{dict.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='hosname'>
                    <Input placeholder='医院名称' />
                </Form.Item>
                <Form.Item name='hoscode'>
                    <Input placeholder='医院编号' />
                </Form.Item>
                <Form.Item name='hostype'>
                    <Select placeholder='医院类型' style={{ width: 180 }}>
                        {typeList.map(type => (
                            <Option key={type.id} value={type.value}>{type.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='status'>
                    <Select placeholder='医院状态' style={{ width: 180 }}>
                        <Option value={0}>未上线</Option>
                        <Option value={1}>已上线</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit' icon={<SearchOutlined/>}>查询</Button>
                        <Button disabled>清空</Button>
                    </Space>
                </Form.Item>
            </Form>
      <Table
        className='mt'
        rowKey={'id'}
        columns={columns}
        dataSource={hospitalList}
        loading={loading}
        pagination={{
            current,
            pageSize,
            total,
            onChange(page:number, pageSize:number){
                setCurrent(page);
                setPageSize(pageSize);
            }
        }}
      ></Table>
    </Card>
  )
}
