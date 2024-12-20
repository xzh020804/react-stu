export interface IHospitalSetItem {
  id: number,
  createTime: string,
  hosname: string,
  hoscode: string,
  apiUrl: string,
  signKey: string,
  contactsName: string,
  contactsPhone: string,
  status: number
}
export type IHospitalSetList = IHospitalSetItem[]

export interface IHospitalSetListResponse {
  records:IHospitalSetList;
  total:number
}

export interface IHospitalSetData {
  apiUrl: string,
  contactsName: string,
  contactsPhone: string,
  hoscode: string,
  hosname: string 
}

export interface IHospitalUpdateData extends IHospitalSetData {
  id: string
}