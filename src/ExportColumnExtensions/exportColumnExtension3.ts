import {injectable} from '@loopback/core';
import {
  AuditLog,
  asColumnExtension,
  IColumnHandler,
} from '@sourceloop/audit-service';

@injectable(asColumnExtension)
export class ExportColumnExtension3 implements IColumnHandler {
  columnName = 'id';
  columnValueBuilder(auditLog: AuditLog): string {
    const columnValue = auditLog.id;
    return JSON.stringify(columnValue);
  }
}
