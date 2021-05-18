export default [
  {
    path: '/',
    redirect: '/work-bench',
  },
  {
    name: '就诊工作台',
    icon: 'appstore',
    path: '/work-bench',
    component: 'WorkBench/List',
  },
  {
    name: '患者管理',
    icon: 'user',
    path: '/patients',
    menu: {
      hideChildren: true,
    },
    routes: [
      {
        name: '患者管理',
        path: '/patients',
        component: 'Patients/List',
      },
      {
        name: '新增患者',
        path: '/patients/add-patients',
        component:
          'Patients/AddOrEditPatients',
      },
      {
        name: '编辑患者',
        path: '/patients/edit-patients',
        component:
          'Patients/AddOrEditPatients',
      }
    ],
  },
  {
    name: '收费管理',
    icon: 'dollar',
    path: '/charge',
    component: 'Charge/List',
  },
  {
    name: '员工管理',
    icon: 'dollar',
    path: '/doctor',
    menu: {
      hideChildren: true,
    },
    routes: [
      {
        name: '医生管理',
        path: '/doctor',
        component: 'SystemSettings/Employee/List',
      },
      {
        name: '新增医生',
        path: '/doctor/add-doctor',
        component:
          'SystemSettings/Employee/AddOrEditEmployee',
      },
      {
        name: '编辑医生',
        path: '/doctor/edit-doctor',
        component:
          'SystemSettings/Employee/AddOrEditEmployee',
      },
      {
        name: '新增科室',
        path: '/doctor/add-department',
        component:
          'SystemSettings/Employee/AddOrEditDepartment',
      },
      {
        name: '编辑科室',
        path: '/doctor/edit-department',
        component:
          'SystemSettings/Employee/AddOrEditDepartment',
      },
      {
        name: '新增角色',
        path: '/doctor/add-role',
        component:
          'SystemSettings/Employee/AddOrEditRole',
      },
      {
        name: '编辑角色',
        path: '/doctor/edit-role',
        component:
          'SystemSettings/Employee/AddOrEditRole',
      },
    ],
  },
  {
    name: '就诊病历管理',
    icon: 'dollar',
    path: '/system-settings/dictionary',
    component: 'SystemSettings/Dictionary',
  },
];
