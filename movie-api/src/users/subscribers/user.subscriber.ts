import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  DataSource
} from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      event.entity.password = await bcrypt.hash(event.entity.password, 10);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    // Hash password if it's being updated
    if (event.entity && 'password' in event.entity) {
      event.entity.password = await bcrypt.hash(event.entity.password, 10);
    }
  }
}
