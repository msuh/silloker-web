export interface KeyValue {
  key: string;
  value: number;
}

// The returned object for a single tag entity
export interface TagEntity {
  id?: number;
  recordId?: number;
  recordType: string;
  tagName: string;
  tagContent: string;
}


// const BACKEND_ADDR = "http://localhost:8080";
const BACKEND_ADDR = "http://3.140.156.59:8080";

export {BACKEND_ADDR};