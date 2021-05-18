import { Effect, Reducer } from 'umi';

import { WorkBenchModalStateType } from './data';
import { fetchPatientList, updatePatient } from './service';

interface WorkBenchModalType {
  namespace: string;
  state: WorkBenchModalStateType;
  effects: {
    /** 获取患者列表 */
    fetchPatientList: Effect;
    /** 更新患者 */
    updatePatient: Effect;
  };
  reducers: {
    save: Reducer;
  };
}

const WorkBenchModal: WorkBenchModalType = {
  namespace: 'workBench',

  state: {
    patientList: [],
    total: 0,
  },

  effects: {
    *fetchPatientList({ payload }, { call, put }) {
      const response = yield call(fetchPatientList, payload);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            patientList: response.data.list,
            total: response.data.total,
          },
        });
      }
    },
    /** 更新患者 */
    *updatePatient({ payload, callback }, { call }) {
      const res = yield call(updatePatient, payload);
      const { code } = res;
      code === '1' && callback && callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default WorkBenchModal;
