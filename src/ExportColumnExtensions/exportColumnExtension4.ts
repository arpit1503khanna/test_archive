import {injectable} from '@loopback/core';
import {
  AuditLog,
  asColumnExtension,
  IColumnHandler,
} from '@sourceloop/audit-service';

@injectable(asColumnExtension)
export class ExportColumnExtension4 implements IColumnHandler {
  // Export table column name to be given.
  columnName = 'action';

  // method to build the value of the Export Column
  columnValueBuilder(auditLog: AuditLog): string {
    let columnValue = '';
    // User to provide the field/ fields of the Audit-Log tables.
    columnValue = auditLog.action;

    // return value must be string.
    return JSON.stringify(columnValue);
  }
}
