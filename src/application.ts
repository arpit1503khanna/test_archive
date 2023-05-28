import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AuditExportServiceBindings, AuditServiceComponent, QueryArchivedLogServiceBindings} from '@sourceloop/audit-service';
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';
import {SaveExportAuditLogsProvider} from './providers/exportLogs.provider';
import {ExportColumnExtension1, ExportColumnExtension2, ExportColumnExtension3, ExportColumnExtension4, ExportColumnExtension5} from './ExportColumnExtensions';
// import { QueryLogProvider } from './services';
import { QueryLog, QueryLogProvider } from './services';

export {ApplicationConfig};

export class TestExportApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuditServiceComponent);
    this.component(AuthenticationServiceComponent);

    // this.bind(AuditExportServiceBindings.SAVE_EXPORT_LOGS.key).toProvider(SaveExportAuditLogsProvider)
    // this.bind(QueryArchivedLogServiceBindings.QUERY_ARCHIVED_LOGS.key).toProvider(QueryLogProvider)
    this.add(createBindingFromClass(ExportColumnExtension1))
    this.add(createBindingFromClass(ExportColumnExtension2))
    this.add(createBindingFromClass(ExportColumnExtension3))
    this.add(createBindingFromClass(ExportColumnExtension4))
    this.add(createBindingFromClass(ExportColumnExtension5))



    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
