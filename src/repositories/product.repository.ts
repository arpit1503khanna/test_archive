import {inject, Getter, Constructor} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {ProductDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuditRepositoryMixin, IAuditMixinOptions} from '@sourceloop/audit-log';
import {AuditLogRepository} from './audit-log.repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';


const productAuditOpts: IAuditMixinOptions = {
  actionKey: 'Products_Logs',
};

export class ProductRepository extends AuditRepositoryMixin<
 Product,
  typeof Product.prototype.id,
  ProductRelations,
  string,
  Constructor<
    DefaultCrudRepository<Product, typeof Product.prototype.id>
  >
>(DefaultCrudRepository, productAuditOpts) {

  constructor(
    @inject('datasources.product') dataSource: ProductDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,) {
    super(Product, dataSource);
  }
}
