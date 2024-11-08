import { request } from "@utils/http"
import { IHospitalSetData, IHospitalSetListResponse, IHospitalUpdateData } from "./model/hospitalSetTypes"

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

export const addHospitalSet = (data:IHospitalSetData) =>{
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

export const getHospitalSetById = (id:string) =>{
  return request.get<any,IHospitalSetData>('/admin/hosp/hospitalSet/get/' +id)
}

export const updateHospitalSet = (data:IHospitalUpdateData) =>{
  return request.put('/admin/hosp/hospitalSet/update', data)
}