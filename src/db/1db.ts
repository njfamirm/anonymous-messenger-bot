// from https://github.com/AliMD/1db

import { debounce } from "lodash";
import { log, readJsonFile, writeJsonFile, utcTimestamp } from "./util";

export interface DocumentStorage
  extends Record<string, DocumentRecord | string | undefined> {
  _latest?: string;
}

export interface DocumentRecord extends Record<string, unknown> {
  _id: string;
  _created: number;
  _modified: number;
}

export class OneDB {
  private _path: string;
  private _indexList?: string[];
  _storage: Promise<DocumentStorage>;

  /**
   * Open JSON file
   */
  constructor(storagePath: string) {
    log(`open ${storagePath}`);
    this._path = storagePath;
    this._storage = readJsonFile<DocumentStorage>(this._path, {});
    this._storage.catch((err) => {
      throw err;
    });
  }

  protected async _updateIndexList(id?: string) {
    if (id != undefined && this._indexList == undefined) {
      return;
    } // no index created yet and maybe not need at all

    const storage = await this._storage;

    if (this._indexList == undefined) {
      this._indexList = Object.keys(storage);
    }

    if (id != undefined && !(id in this._indexList)) {
      this._indexList.push(id);
    }
  }

  /**
   * Insert/Update a document record
   */
  async set<T extends Partial<DocumentRecord>>(
    id: string,
    data: T,
    replace = false
  ): Promise<T> {
    log(`set ${id}`);
    if (id === "_latest") {
      throw new Error("forbidden_key");
    }

    const storage = await this._storage;

    let oldData = storage[id];
    if (
      oldData !== undefined &&
      !(typeof oldData === "object" && "_id" in oldData)
    ) {
      oldData = undefined; // invalid data!
    }

    data._id = id;
    data._modified = oldData?._modified ?? utcTimestamp();
    data._created = oldData?._created ?? data._modified;

    if (data !== oldData && !replace) {
      data = {
        ...oldData,
        ...data,
      };
    }

    storage[id] = data as DocumentRecord;
    storage._latest = id;
    void this._updateIndexList(id);

    this.saveRequest();
    return data as T;
  }

  /**
   * Get a document record
   */
  async get<T extends DocumentRecord>(id: string): Promise<T | undefined> {
    log(`get ${id}`);
    if (!(id != null && typeof id === "string" && id.length > 0)) {
      return;
    }
    const storage = await this._storage;
    const data = storage[id];
    if (typeof data === "string") {
      return this.get(data);
    } else {
      return data as T;
    }
  }

  /**
   * Find single item
   */
  async find<T extends DocumentRecord>(
    predicate: (documentRecord: T) => boolean
  ): Promise<T | undefined> {
    log("find");
    await this._updateIndexList();
    const storage = await this._storage;
    for (const id of this._indexList!) {
      const documentRecord = storage[id];
      if (
        documentRecord != null &&
        typeof documentRecord === "object" &&
        predicate(documentRecord as T)
      ) {
        return documentRecord as T;
      }
    }
    return undefined;
  }

  /**
   * Find all item
   */
  async findAll<T extends DocumentRecord>(
    predicate: (documentRecord: T) => boolean
  ): Promise<Array<T>> {
    log("findAll");
    await this._updateIndexList();
    const storage = await this._storage;
    const result: Array<T> = [];
    for (const id of this._indexList!) {
      const documentRecord = storage[id];
      if (
        documentRecord != null &&
        typeof documentRecord === "object" &&
        predicate(documentRecord as T)
      ) {
        result.push(documentRecord as T);
      }
    }
    return result;
  }

  /**
   * For each for all items
   */
  async forEach<T extends DocumentRecord>(
    callbackfn: (
      documentRecord: T,
      documentId: string
    ) => false | void | Promise<void>
  ): Promise<void> {
    log("findAll");
    await this._updateIndexList();
    const storage = await this._storage;
    for (const documentId of this._indexList!) {
      const documentRecord = storage[documentId];
      if (documentRecord != null && typeof documentRecord === "object") {
        if (callbackfn(documentRecord as T, documentId) === false) {
          return;
        }
      }
    }
  }

  /**
   * delete items base in query
   */
  async delete(id: string): Promise<void> {
    log("delete", id);
    const storage = await this._storage;
    delete storage[id];
    delete this._indexList; // need to re-index
    this.saveRequest();
  }

  saveRequest = debounce(
    (): void => {
      log("Save db");
      this._storage.then((storage) => writeJsonFile(this._path, storage));
    },
    100,
    {
      leading: false,
      trailing: true,
      maxWait: 1000,
    }
  );
}
