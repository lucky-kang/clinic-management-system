import request from '@/utils/request';
import { AnyObject } from 'typings';
import { PatientListQueryType } from './data';

export async function fetchPatientList(params: PatientListQueryType) {
  return request('/getPatientList', {
    method: 'GET',
    params,
  });
}

export const addPatient = (data: AnyObject) =>
  request('/addPatient', {
    method: 'POST',
    data,
});

export const updatePatient = (data: { id: string }) =>
  request('/updatePatient', {
    method: 'POST',
    data,
});

export async function fetchPatientDetail(params: { id: number }) {
  return request('/getPatientDetail', {
    method: 'GET',
    params,
  });
}

export const deletePatient = (data: { id: string }) =>
  request('/deletePatient', {
    method: 'DELETE',
    data,
});