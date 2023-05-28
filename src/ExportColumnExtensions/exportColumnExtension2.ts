import {injectable} from '@loopback/core';
import {
  AuditLog,
  asColumnExtension,
  IColumnHandler,
} from '@sourceloop/audit-service';
@injectable(asColumnExtension)
export class ExportColumnExtension2 implements IColumnHandler {
  columnName ='data_update';

  columnValueBuilder(auditLog: AuditLog): string{
    // in this we will be passing object which needs to be returned in string using JSON.stringify

    const columnValue = {
      before: auditLog.before,
      after: auditLog.after,
    };

    return JSON.stringify(columnValue);
  }
}
