import {ValueOrPromise} from '@loopback/context';
import {
  injectable,
  /* inject, */ BindingScope,
  Provider,
  inject,
  JSONObject,
} from '@loopback/core';
import { Where, repository } from '@loopback/repository';
import {
  CustomFilter,
  QueryArchivedLogServiceBindings,
  // TemporaryData,
  QueryArchivedLogProvider,MappingLog, AuditLog, 
  // TemporaryDataRepository
} from '@sourceloop/audit-service';
import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
// import {QueryArchivedLog} from '@sourceloop/audit-service'
/*
 * Fix the service type. Possible options can be:
 * - import {QueryArchivedLog} from 'your-module';
 * - export type QueryArchivedLog = string;
 * - export interface QueryArchivedLog {}
 */
export type QueryLog = unknown;
// export interface IQueryArchivedLogs {
//   querySelectedFiles(
//     fileName: string,
//     customFilter: CustomFilter,
//   ): Promise<TemporaryData[]>;
// }

@injectable({scope: BindingScope.TRANSIENT})
export class QueryLogProvider implements Provider<QueryLog> {
  constructor(
    // @inject(QueryArchivedLogServiceBindings.QUERY_ARCHIVED_LOGS.key)
    // public queryArchivedLogProvider: QueryArchivedLogProvider,
    // @repository(TemporaryDataRepository)
    // public temporaryDataRepository: TemporaryDataRepository,
  ) {}

  value(): {
    querySelectedFiles: (
      fileName: string,
      customFilter: CustomFilter,
    ) => Promise<AuditLog[]>;
  } {
    return {
      querySelectedFiles: async (
        fileName: string,
        customFilter: CustomFilter,
      ) => {
        return this.querySelectedFiles(fileName, customFilter);
      },
    };
  }
  async querySelectedFiles(fileName: string, customFilter: CustomFilter) {
    AWS.config = new AWS.Config({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: fileName,
    };

    const stream = s3.getObject(params).createReadStream();
    const csvParserOptions = {
      header: true,
      separator: ',', // or ';' depending on the CSV file format
      // mapHeaders: ({header}: {header: string}) => header.toLowerCase(), // Normalize the column names
    };
    let auditLogs: AuditLog[] = [];
    return new Promise<AuditLog[]>((resolve, reject) => {
      stream
        .pipe(csvParser(csvParserOptions))
        .on('data', async row => {
          const auditLogReceived = new AuditLog({
            action: row.action,
            actedAt: new Date(row.actedAt),
            actedOn: row.actedOn,
            actionKey: row.actionKey,
            entityId: row.entityId,
            actor: row.actor,
            before: JSON.parse(row.before),
            after: JSON.parse(row.after),
          });
          // console.log(auditLogReceived);
          // await this.temporaryDataRepository.create(auditLogReceived);
          auditLogs.push(auditLogReceived); // Push the entry into the array
          // console.log(csvLogs);
          // createPromises.push(
          //   this.temporaryDataRepository.create(auditLogReceived),
          // ); // Collect the create promises
        })
        .on('end', async () => {
          // await Promise.all(createPromises); // Wait for all create operations to complete

          // await this.temporaryDataRepository.createAll(csvLogs);
          // // const selectedAuditLogs = await this.temporaryDataRepository.find({
          // //   where,
          // // });
          // const selectedAuditLogs = await this.temporaryDataRepository.find({
          //   where,
          // });
          // await this.temporaryDataRepository.deleteAll();
          // console.log(csvLogs);
          auditLogs = auditLogs.filter(log => {
            // Check if actedAt is within the specified date range
            if (
              customFilter.date &&
              customFilter.date.fromDate &&
              customFilter.date.toDate
            ) {
              const fromDate = new Date(customFilter.date.fromDate);
              const toDate = new Date(customFilter.date.toDate);
              if (log.actedAt < fromDate || log.actedAt > toDate) {
                return false;
              }
            }

            // Check if deleted matches the specified value
            if (customFilter.deleted !== undefined) {
              // const regexp = new RegExp(
              //   `"{0,1}deleted{0,1}\\s*:\\s*${customFilter.deleted}`,
              // );
              // if (!regexp.test(JSON.stringify(log.after))) {
              //   return false;
              // }
              if (customFilter.deleted == false && !log.after) {
                return false;
              }
              if (
                log.after &&
                (log.after as JSONObject).deleted !== customFilter.deleted
              ) {
                return false;
              }
            }

            // Check if actedOn matches the specified value
            if (customFilter.actedOn && log.actedOn !== customFilter.actedOn) {
              return false;
            }

            // If all conditions pass, include the log in the result
            return true;
          });

          console.log('This is my application');
          // auditLogs = auditLogs.concat(selectedAuditLogs);
          resolve(auditLogs);
        });
    });
  }
}
