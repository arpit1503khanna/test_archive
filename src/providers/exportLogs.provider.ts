import {Provider, ValueOrPromise} from '@loopback/core';

export interface IExportLogsDestinationFn {
  saveLogs(destination: string): Promise<string>;
}

export class SaveExportAuditLogsProvider
  implements Provider<IExportLogsDestinationFn>
{
  constructor() {
    /* Do nothing */
  }

  value(): ValueOrPromise<IExportLogsDestinationFn> {
    return {
      saveLogs: async (destination: string) => {
        console.log('export files saved');
        return 'logs Saved';
      },
    };
  }
}
