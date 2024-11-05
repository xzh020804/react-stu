import { request } from "@utils/http"
import { IHospitalSetDate, IHospitalSetListResponse } from "./model/hospitalSetTypes"

export const getHospitalSetList = (page:number,limit:number,hosname?:string,hoscode?:string) => {
  return request.get<any,IHospitalSetListResponse>(`/admin/hosp/hospitalSet/${page}/${limit}`,
    {
      params:{
        hosname,
        hoscode
      }
    }
  )
}

export const addHospitalSet = (data:IHospitalSetDate) =>{
  return request.post('/admin/hosp/hospitalSet/save', data)
}

export const deleteHospitalSetById = (id:string) => {
  return request.delete(`/admin/hosp/hospitalSet/remove/${id}`)
}

export const removeBatch = (ids:React.Key[]) =>{
  return request.delete('/admin/hosp/hospitalSet/batchRemove',{
    data:ids
  })
}