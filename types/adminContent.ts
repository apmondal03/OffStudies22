/**
 * The central admin system's core idea: a content module is described
 * ONCE as data (a field list + a mapping function), and one generic form,
 * one generic list page, and one set of CRUD Server Actions work for every
 * module registered this way — adding a new module to /admin means adding
 * one config object, not a new page set. Same "content is data, design is
 * reusable" principle the rest of the app is built on, applied to the
 * admin side too.
 */

export type AdminFieldType = "text" | "textarea" | "list" | "select" | "emoji";

export interface AdminFieldOption {
  value: string;
  label: string;
}

export interface AdminFieldDef {
  /** Key inside the entry's JSON data blob. */
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  /** For type "select". */
  options?: AdminFieldOption[];
  /** Shown under the field label. */
  help?: string;
  placeholder?: string;
}

export interface AdminModuleDef {
  id: string;
  label: string;
  /** Which public route shows this content, for the "view live" link. */
  publicListRoute: string;
  fields: AdminFieldDef[];
  /** Which field's value becomes the URL slug (usually the "name"/"title" field). */
  slugSourceField: string;
}
