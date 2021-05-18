// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCommon from '../../../app/service/common';
import ExportMedicalRecordTemplates from '../../../app/service/medicalRecordTemplates';
import ExportTest from '../../../app/service/Test';
import ExportUtils from '../../../app/service/utils';

declare module 'egg' {
  interface IService {
    common: AutoInstanceType<typeof ExportCommon>;
    medicalRecordTemplates: AutoInstanceType<typeof ExportMedicalRecordTemplates>;
    test: AutoInstanceType<typeof ExportTest>;
    utils: AutoInstanceType<typeof ExportUtils>;
  }
}
