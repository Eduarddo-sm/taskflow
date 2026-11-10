#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/e39f1542d3d46af17349386f5201e649b5ad5a8923a4440e2f44e23b69bf4101/contract';
import endContract from '../../snapshots/e39f1542d3d46af17349386f5201e649b5ad5a8923a4440e2f44e23b69bf4101/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'board',
        columns: [
          col('boardId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('boardName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ownerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['boardId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'boardMember',
        columns: [
          col('boardId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('boardMemberId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('permission', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['boardMemberId']),
          checkExpression(
            'boardMember_permission_check_5795cfcf',
            "\"permission\" IN ('OWNER', 'EDITOR', 'VIEWER')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'column',
        columns: [
          col('boardId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('columnId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('columnName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['columnId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'task',
        columns: [
          col('columnId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('dueDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('priority', 'text', {
            notNull: true,
            default: lit('LOW'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('responsibleId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('taskId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['taskId']),
          checkExpression(
            'task_priority_check_759b7c5e',
            "\"priority\" IN ('LOW', 'MEDIUM', 'HIGH')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['userId'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'boardMember',
        constraint: 'boardMember_userId_boardId_key',
        columns: ['userId', 'boardId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'board',
        index: 'board_ownerId_idx_e2d0c1ef',
        columns: ['ownerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'boardMember',
        index: 'boardMember_boardId_idx_74a7b59d',
        columns: ['boardId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'boardMember',
        index: 'boardMember_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'column',
        index: 'column_boardId_idx_74a7b59d',
        columns: ['boardId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'task',
        index: 'task_columnId_idx_728f084b',
        columns: ['columnId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'task',
        index: 'task_responsibleId_idx_cc071067',
        columns: ['responsibleId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'board',
        foreignKey: {
          name: 'board_ownerId_fkey',
          columns: ['ownerId'],
          references: { schema: 'public', table: 'user', columns: ['userId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'boardMember',
        foreignKey: {
          name: 'boardMember_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['userId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'boardMember',
        foreignKey: {
          name: 'boardMember_boardId_fkey',
          columns: ['boardId'],
          references: { schema: 'public', table: 'board', columns: ['boardId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'column',
        foreignKey: {
          name: 'column_boardId_fkey',
          columns: ['boardId'],
          references: { schema: 'public', table: 'board', columns: ['boardId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'task',
        foreignKey: {
          name: 'task_columnId_fkey',
          columns: ['columnId'],
          references: { schema: 'public', table: 'column', columns: ['columnId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'task',
        foreignKey: {
          name: 'task_responsibleId_fkey',
          columns: ['responsibleId'],
          references: { schema: 'public', table: 'user', columns: ['userId'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
