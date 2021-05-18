import React, { useEffect, useState } from 'react';
import { connect, history, Dispatch, Loading } from 'umi';
import { Card, Form, Row, Col, Input, Select, Cascader, Switch, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Store } from 'rc-field-form/lib/interface';
import _ from 'lodash';

import { StyleComponents } from '@/components';
import { AGE_UNITS, GENDERS } from '@/utils/dataDictionary';
import cities from '@/utils/city';
import { CommonState } from '@/models/common';
import { getLoginClinicName, getLoginUserName, validatePhoneFormat, validateIDNumberFormat, validatePasswordFormat } from '@/utils/util';
import { PatientsManagementState } from '../data';
import { AnyObject } from 'typings';

const { Option } = Select;
const { IconTitle, SaveAndGoBackButtons } = StyleComponents;

const colProps = {
  xs: 24,
  md: 12,
  lg: 6
};

interface AddOrEditPatientsProps {
  patients: PatientsManagementState;
  common: CommonState;
  location: {
    query: {
      [key: string]: any;
    }
  };
  dispatch: Dispatch;
  loading: Loading;
};

const AddOrEditPatients: React.FC<AddOrEditPatientsProps> = props => {
  // form
  const [form] = Form.useForm()
  const { setFieldsValue } = form

  // props
  const {
    patients:
    {
      patientDetail
    },
    common: { initNumber, operationType },
    location: {
      query = {}
    },
    dispatch,
    loading
  } = props;
  /** 新增患者时，自动填充患者编号 */
  useEffect(() => {
    console.log(initNumber,'initNumber')
    if (operationType === 'add') {
      setFieldsValue({ number: initNumber })
    }
  }, [operationType, initNumber]);

  /** 编辑患者时，患者信息的回显 */
  useEffect(() => {
    console.log(props.patients,'patientDetail',patientDetail)
    if (operationType === 'edit' && !_.isEmpty(patientDetail)) {
      setFieldsValue({
        ...patientDetail,
      });
    };
  }, [operationType, patientDetail]);

  /** 提交表单且数据验证成功后回调事件 */
  const onFinish = (values: Store) => {
    const data: AnyObject = {
      ...values,
      creator: getLoginUserName(),
      ownClinic: getLoginClinicName(),
    };
    let payload = data;
    if (operationType === 'edit') {
      payload.id = query.id;
    };
    console.log(operationType,'operationType')
    dispatch({
      type: operationType === 'add' ? 'patients/addPatient' : 'patients/updatePatient',
      payload,
      callback: () => {
        message.success('操作成功');
        history.goBack();
      }
    });
  };

  return <PageHeaderWrapper>
    <div className="global-container">
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          ageUnit: AGE_UNITS[0].value,
          gender: GENDERS[0].value,
          status: true
        }}
        onFinish={onFinish}
      >
        <Card
          className="card-no-border"
          title={<IconTitle title={`${query.detail == 1 ? '查看' : operationType === 'add' ? '新增' : '编辑'}患者信息`} />
          }
          extra={<SaveAndGoBackButtons hidden={query.detail == 1 ? true : false} loading={operationType === 'add' ? loading.effects['patients/addPatient'] : loading.effects['patients/updatePatient']} />}
        >
          <Row gutter={24}>
            <Col {...colProps}>
              <Form.Item label="患者编号" name="number">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item
                label="患者姓名"
                name="name"
                rules={[{ required: true, message: '请输入患者姓名！' }]}
              >
                <Input disabled={query.detail == 1 ? true : false}/>
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="患者年龄" required>
                <Input.Group compact>
                  <Form.Item
                    name="age"
                    noStyle
                    rules={[{ required: true, message: '请输入患者年龄！' },
                    () => ({
                      validator(rule, value) {
                        if (!value) {
                          return Promise.reject()
                        }
                        if (!isNaN(Number(value))) {
                          return Promise.resolve()
                        }
                        return Promise.reject('请输入数字！')
                      }
                    })]}
                  >
                    <Input disabled={query.detail == 1 ? true : false} style={{ width: 'calc(100% - 80px)' }} placeholder="请输入数字" />
                  </Form.Item>
                  <Form.Item
                    name="ageUnit"
                    noStyle
                  >
                    <Select style={{ width: 80 }} disabled={query.detail == 1 ? true : false}>
                      {AGE_UNITS.map(item =>
                        <Option key={item.value} value={item.value}>{item.label}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item
                label="性别"
                name="gender"
                rules={[{ required: true, message: '请输入患者性别！' }]}
              >
                <Select disabled={query.detail == 1 ? true : false}>
                  {GENDERS.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col {...colProps}>
              <Form.Item
                label="手机号码"
                name="phone"
                validateTrigger="onBlur"
                rules={[
                  () => ({
                    validator(rule, value) {
                      if (value) {
                        if (!validatePhoneFormat(value)) {
                          return Promise.reject('请输入正确的手机格式')
                        }
                      }
                      return Promise.resolve()
                    }
                  })
                ]}
              >
                <Input disabled={query.detail == 1 ? true : false} placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  </PageHeaderWrapper>
}

export default connect(({ patients, common, loading }: {
  patients: PatientsManagementState;
  common: CommonState;
  loading: Loading;
}) => ({ patients, common, loading }))(AddOrEditPatients)