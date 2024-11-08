import { getHospitalDetail } from '@/api/hospital/hospitalList'
import { IBookingRule, IHospitalItem } from '@/api/hospital/model/hospitalListTypes'
import { Card, Descriptions, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function HospitalDetail() {
  let {id} = useParams()
  let[bookingRule,setBookingRule] = useState<IBookingRule>()
  let[hospital,setHospital] = useState<IHospitalItem>()
  const _getHospitalDetail = async()=>{
    let {bookingRule,hospital}= await getHospitalDetail(id as string)
    setBookingRule(bookingRule)
    setHospital(hospital)
  }
  useEffect(()=>{
    id && _getHospitalDetail()
  },[])
  return (
    <Card>
      <Descriptions title="基本信息" bordered>
        <Descriptions.Item label="医院名称" span={1.5}>{hospital?.hosname}</Descriptions.Item>
        <Descriptions.Item label="医院logo" span={1.5}>{
          hospital?.logoData && <Image width={100} src={'data:image/jpg;base64,' + hospital.logoData}></Image>
          }</Descriptions.Item>
        <Descriptions.Item label="医院编码" span={1.5}>{hospital?.hoscode}</Descriptions.Item>
        <Descriptions.Item label="医院地址" span={1.5}>{hospital?.param.fullAddress}</Descriptions.Item>
        <Descriptions.Item label="坐车路线" span={3}>{hospital?.route}</Descriptions.Item>
        <Descriptions.Item label="医院简介" span={3}>{hospital?.intro}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="预约规则信息" bordered className='mt'>
        <Descriptions.Item label="预约周期" span={1.5}>{bookingRule?.cycle}</Descriptions.Item>
        <Descriptions.Item label="放号时间" span={1.5}>{bookingRule?.releaseTime}</Descriptions.Item>
        <Descriptions.Item label="停挂时间" span={1.5}>{bookingRule?.stopTime}</Descriptions.Item>
        <Descriptions.Item label="退号时间" span={1.5}>{bookingRule?.quitTime}</Descriptions.Item>
        <Descriptions.Item label="预约规则" span={3}>{
          bookingRule?.rule.map((item,index) => (
            <div key={index}>{item}</div>
          ))
          }</Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
