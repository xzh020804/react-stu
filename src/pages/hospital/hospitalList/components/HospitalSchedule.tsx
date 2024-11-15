import { Button, Card, Col, Pagination, Row, Table, Tag, Tree } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDepartmentList, getDoctorList, getScheduleList } from '@/api/hospital/hospitalList';
import { IBookingScheduleList, IDepartmentList, IDoctorItem, IDoctorList } from '@/api/hospital/model/hospitalListTypes';


let height = document.documentElement.clientHeight - 180
export default function HospitalSchedule() {
  let {hoscode} = useParams()
  const navigate = useNavigate()
  const columns:ColumnsType<IDoctorItem>=[
    {
      align:'center',
      width:100,
      title:'序号',
      render(value:any,row:any,index:number) {
        return index + 1
      }
    },
    {
      title:'职称',
      dataIndex:'title'
    },
    {
      width:120,
      title:'号源时间',
      dataIndex:'workDate'
    },
    {
      title:'总预约数	',
      dataIndex:'reservedNumber'
    },
    {
      title:'剩余预约数	',
      dataIndex:'availableNumber'
    },
    {
      title:'挂号费(元)	',
      dataIndex:'amount'
    },
    {
      title:'擅长技能',
      dataIndex:'skill'
    }
  ]
 
  let [departmentList,setDepartmentList] = useState<IDepartmentList>([])
  let [expandedKeys,setExpandedKeys] = useState<string[]>([])
  let [depcode,setDepcode] = useState<string>()
  let [depname,setDepname] = useState<string>()
  let [current,setCurrent] = useState<number>(1)
  let [pageSize,setPageSize] = useState<number>(3)
  let [hosname,setHosname] = useState<string>()
  let [total,setTotal] = useState<number>()
  let [workDate,setWorkDate] = useState<string>()
  let [bookingScheduleList,setBookingScheduleList] = useState<IBookingScheduleList>([])
  let [doctorList,setDoctorList] = useState<IDoctorList>([])
  const _getDepartmentList = async() =>{
    let departmentList = await getDepartmentList(hoscode as string)
    departmentList = departmentList.map(item => {
      item.disabled = true
      return item
    })
    let expandedKeys = departmentList.map( item => item.depcode)
    let depcode = (departmentList[0].children as IDepartmentList)[0].depcode
    let depname = (departmentList[0].children as IDepartmentList)[0].depname
    setDepcode(depcode)
    setDepname(depname)
    setExpandedKeys(expandedKeys)
    setDepartmentList(departmentList)
  }
  const _getScheduleList = async() =>{
    let {baseMap:{hosname},bookingScheduleList,total} =await getScheduleList(current,pageSize,hoscode as string,depcode as string)
    setHosname(hosname)
    setBookingScheduleList(bookingScheduleList)
    setTotal(total)
    let workDate = bookingScheduleList[0].workDate
    setWorkDate(workDate)
    
  }
  const _getDoctorList = async() => {
    let res = await getDoctorList(hoscode as string,depcode as string,workDate as string)
    setDoctorList(res)
    
  }
  useEffect(()=>{
    hoscode && _getDepartmentList()
  },[])
  useEffect(()=>{
    depcode && _getScheduleList()
  },[depcode,current,pageSize])
  useEffect(() => {
    workDate && _getDoctorList()
  },[workDate])
  return (
    <Card>
      <div>选择：{hosname} / {depname} / {workDate}</div>
      <Row className='mt' gutter={30}>
        <Col span={5}>
          <div
          style={{border:'1px solid #ddd',height , overflowY:'scroll'}}
          >
            <Tree
              // onSelect={onSelect}
              // onCheck={onCheck}
              expandedKeys={expandedKeys}
              selectedKeys={[depcode as string]}
              treeData={departmentList as []}
              fieldNames={{title:'depname',key:'depcode'}}
              onSelect={(selectKeys:any,info:any) => {
                setDepcode(info.node.depcode)
                setDepname(info.node.depname)
              }}
             />
          </div>
        </Col>

        <Col span={19}>
          {bookingScheduleList.map(item =>(
            <Tag color={item.workDate === workDate ? 'green' :''} key={item.workDate} onClick={() => setWorkDate(item.workDate)}>
            <div>{item.workDate} {item.dayOfWeek}</div>
            <div>{item.availableNumber} / {item.reservedNumber}</div>
          </Tag>
          )       
          )}
          
          <Pagination current={current} total={total} pageSize={pageSize} className='mt' onChange={(page:number,pageSize:number) => {
            setCurrent(page)
            setPageSize(pageSize)
          }}
          pageSizeOptions={[3,5,10]}
          />
          <Table
          className='mt'
          pagination={false}
          columns={columns}
          dataSource={doctorList}
          rowKey={'id'}
          ></Table>
          <Button className='mt' onClick={() => navigate(-1)}>返回</Button>
        </Col>
      </Row>

    </Card>
  )
}
