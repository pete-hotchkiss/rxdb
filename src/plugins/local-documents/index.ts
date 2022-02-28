import type {
    RxPlugin
} from '../../types';
import { getLocal, getLocal$, insertLocal, upsertLocal } from './local-documents';
import { closeStateByParent, removeLocalDocumentsStorageInstance } from './local-documents-helper';

export * from './local-documents';
export * from './rx-local-document';






export const RxDBLocalDocumentsPlugin: RxPlugin = {
    name: 'local-documents',
    rxdb: true,
    prototypes: {
        RxCollection: (proto: any) => {
            proto.insertLocal = insertLocal;
            proto.upsertLocal = upsertLocal;
            proto.getLocal = getLocal;
            proto.getLocal$ = getLocal$;
        },
        RxDatabase: (proto: any) => {
            proto.insertLocal = insertLocal;
            proto.upsertLocal = upsertLocal;
            proto.getLocal = getLocal;
            proto.getLocal$ = getLocal$;
        }
    },
    hooks: {
        preDestroyRxDatabase: {
            after: db => {
                return closeStateByParent(db);
            }
        },
        postDestroyRxCollection: {
            after: collection => closeStateByParent(collection)
        },
        postRemoveRxDatabase: {
            after: args => {
                return removeLocalDocumentsStorageInstance(
                    args.storage,
                    args.databaseName,
                    ''
                );
            }
        },
        postRemoveRxCollection: {
            after: args => {
                return removeLocalDocumentsStorageInstance(
                    args.storage,
                    args.databaseName,
                    args.collectionName
                );
            }
        }
    },
    overwritable: {}
};