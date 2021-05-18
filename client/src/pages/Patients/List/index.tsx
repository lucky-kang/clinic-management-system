import React, { useState, useEffect, useRef } from 'react';
import { connect, history, Dispatch } from 'umi';
import moment from 'moment'
import { Button, message } from 'antd'
import { PlusCircleFilled, ExportOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Store } from 'antd/lib/form/interface';

import { GlobalTable, DeleteConfirmModal } from '@/components'
import { GENDERS, VIPLEVELS } from '@/utils/dataDictionary'
import { ITableColumn } from '@/components/GlobalTable/data'
import { handleTrim, download } from '@/utils/util';
import { PatientsManagementState, PatientType } from '../data'
import styles from './index.less'

interface PatientsManagementProps {
  patients: PatientsManagementState;
  dispatch: Dispatch;
}
const PatientsManagement: React.FC<PatientsManagementProps> = props => {
  // props
  const { patients, dispatch } = props
  const { patientList, total } = patients
  /** 按钮组件 */
  const extra = <div>
    <Button
      style={{ marginRight: 20 }}
      type="primary"
      onClick={() => { history.push(`/patients/add-patients`) }}
      icon={<PlusCircleFilled />}
    >新增患者</Button>
    <Button
      ghost
      type="primary"
      icon={<ExportOutlined />}
      onClick={() => {
        console.log('导出')
        download(patientList, columns, '患者数据.xlsx')
      }}
    >导出</Button>
  </div>
  const columns: ITableColumn<AnyObject>[] = [
    {
      dataIndex: 'number',
      title: '患者编号',
      align: 'center'
    },
    {
      dataIndex: 'name',
      title: '患者姓名',
      align: 'center',
      searchType: 'input',
      searchOrder: 2
    },
    {
      dataIndex: 'gender',
      title: '患者性别',
      render: (gender: number) => <span>{GENDERS.find(item => item.value === gender)?.label}</span>,
      align: 'center'
    },
    {
      dataIndex: 'age',
      title: '患者年龄',
      align: 'center'
    },
    {
      dataIndex: 'phone',
      title: '手机号码',
      align: 'center',
      searchType: 'input',
      searchOrder: 3
    },
    {
      dataIndex: 'createdTime',
      title: '创建时间',
      render: (createdTime: string) => <span>{createdTime && moment(createdTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
      align: 'center',
      searchType: 'dateRange',
      searchOrder: 1
    },
    // {
    //   dataIndex: 'operator',
    //   title: '操作人员',
    //   align: 'center'
    // },
    {
      title: '操作',
      render: (record: PatientType) => <div className="table-operate">
        <Button type="link" onClick={() => { history.push(`/patients/edit-patients?id=${record.id}`) }}>编辑</Button>
        <Button type="link" onClick={() => { onRemove('patient', record.id) }}>删除</Button>
      </div>,
      align: 'center',
      fixed: 'right',
      width: 200
    }
  ]

  // useState
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false); // 确认删除弹出框的显隐
  const [timestamp, setTimestamp] = useState(0);
  // useState
  const [param] = useState({ pagination: { pageNum: 1, pageSize: 10 }, query: {} })
  // useRef
  const currentConfirmData = useRef({ type: '', id: 0, content: '' });// 当前删除数据的类型和确认删除框的内容
  /**
   * 处理查询表单参数
   * @param values 表单收集到的值
   */
   const doParseQueryValue = (values: Store) => {
    const { name = '' } = values;
    return {
      ...values,
      name: name.trim()
    }
  }
  useEffect(() => {
    // 改变当前选中的列表的数据
    const { pagination, query } = param;
    dispatch({
      type: 'patients/fetchPatientList',
      payload: { 
        query: doParseQueryValue(query),
        ...pagination
      }
    });
  },[param]);
  /**
   * 统一调用删除接口的处理
   */
  const doRemove = () => {
    console.log(currentConfirmData.current,'currentConfirmData.current')
    const { id } = currentConfirmData.current;
    let label = '患者';
    dispatch({
      type: 'patients/deletePatient',
      payload: { id },
      callback: () => {
        // 操作成功提示
        message.success(`${label}删除成功！`)
        // 删除确认框隐藏
        setDeleteConfirmModalVisible(false)
        setTimestamp(new Date().getTime());
      }
    });
  };
  /**
   * 统一的删除功能(开启确认删除弹出框并根据删除的数据类别设置不同的内容)
   * @param name 删除数据所属分类的名字
   * @param id 删除数据的ID
   */
  const onRemove = (name: string, id: number) => {
    setDeleteConfirmModalVisible(true);
    let content = '删除后无法恢复，确定要删除此患者信息吗？';
    currentConfirmData.current = { type: name, id, content };
  };
  const deleteConfirmModalProps = {
    visible: deleteConfirmModalVisible,
    content: currentConfirmData.current.content,
    onOk: doRemove,
    onCancel: () => { setDeleteConfirmModalVisible(false) }
  };

  const onTransformValues = (values: Store) => {
    console.log(values,'values')
    return handleTrim(['name', 'phone'], values);
  }

  return <PageHeaderWrapper extra={extra} >
    <div className="global-container">
      <GlobalTable
        rowKey="number"
        dispatchType="patients/fetchPatientList"
        columns={columns}
        dataSource={patientList}
        pagination={{ total }}
        scroll={{ x: 1300 }}
        searchConfig={{ onTransformValues }}
        timestamp={timestamp}
      />
    </div>
    <DeleteConfirmModal {...deleteConfirmModalProps} />
  </PageHeaderWrapper>
}

export default connect(({ patients }: {
  patients: PatientsManagementState
}) => ({ patients }))(PatientsManagement)