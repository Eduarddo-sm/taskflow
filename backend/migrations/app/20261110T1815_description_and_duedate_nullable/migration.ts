#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/e39f1542d3d46af17349386f5201e649b5ad5a8923a4440e2f44e23b69bf4101/contract';
import startContract from '../../snapshots/e39f1542d3d46af17349386f5201e649b5ad5a8923a4440e2f44e23b69bf4101/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f60e9602cf9389ca7ce980a934df3ca9414a13a698968875f5224caff769b0ce/contract';
import endContract from '../../snapshots/f60e9602cf9389ca7ce980a934df3ca9414a13a698968875f5224caff769b0ce/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropNotNull({ schema: 'public', table: 'task', column: 'description' }),
      this.dropNotNull({ schema: 'public', table: 'task', column: 'dueDate' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
