import { Effect, Reducer, Subscription } from 'umi';
import { parse } from 'qs';
import { PatientsManagementState } from './data.d';
import { fetchPatientList, addPatient, updatePatient, fetchPatientDetail, deletePatient } from './service';

interface PatientsManagementModelType {
  namespace: string;
  state: PatientsManagementState;
  effects: {
    fetchPatientList: Effect;
    /** 新增患者 */
    addPatient: Effect;
    /** 删除患者 */
    deletePatient: Effect;
    /** 编辑患者 */
    updatePatient: Effect;
    /** 获取患者详情 */
    fetchPatientDetail: Effect;
  };
  reducers: {
    save: Reducer;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const PatientsManagementModel: PatientsManagementModelType = {
  namespace: 'patients',
  state: {
    patientList: [],
    total: 0,
    patientDetail: {}
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
    *addPatient({ payload, callback }, { call }) {
      console.log(payload,'payload')
      const res = yield call(addPatient, payload);
      const { code } = res;
      code === '1' && callback && callback();
    },
    *fetchPatientDetail({ payload }, { call, put }) {
      const response = yield call(fetchPatientDetail, payload);
      if (response.code === '1') {
        yield put({
          type: 'save',
          payload: {
            patientDetail: response.data,
          },
        });
      }
    },
    *updatePatient({ payload, callback }, { call }) {
      const res = yield call(updatePatient, payload);
      const { code } = res;
      code === '1' && callback && callback();
    },
    *deletePatient({ payload, callback }, { call }) {
      const res = yield call(deletePatient, payload);
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
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname, search }) => {
        const query = search ? parse(search.split('?')[1]) : {};
        if (pathname.includes('/patients/add-patients')) {
          // 改变新增与编辑共用页面的操作类型为add
          dispatch({
            type: 'common/save',
            payload: {
              operationType: 'add',
            },
          });
        } else if (pathname.includes('/patients/edit-patients')) {
          // 改变新增与编辑共用页面的操作类型为add
          dispatch({
            type: 'common/save',
            payload: {
              operationType: 'edit',
            },
          });
        }

        // 新增患者信息
        if (pathname === '/patients/add-patients') {
          // 获取自动填充的患者编号
          dispatch({
            type: 'common/fetchInitNumber',
            payload: {
              name: 'patients',
            },
          });
        } else if (pathname === '/patients/edit-patients') {
          // 编辑患者信息
          // 获取该患者信息
          dispatch({
            type: 'fetchPatientDetail',
            payload: {
              id: query.id,
            },
          });
        }
      });
    },
  },
};

export default PatientsManagementModel;
