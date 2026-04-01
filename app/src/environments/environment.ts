// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


//per non ricevere errori sul codice
export const environment = {
  production: false,
  baseUrl: 'http://192.168.90.115:8069/api',
  type: 'application/json',
  odooToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOnsidWlkIjo4LCJhdXRoX21ldGhvZCI6InBhc3N3b3JkIiwibWZhIjoiZGVmYXVsdCJ9LCJleHAiOjE3NzUwNTM5NTUsImlhdCI6MTc3NTA0Njc1NX0.n4y38rlxGPzoiVOOQ_12PA4zR0obVGPpys6hsBtL_JI',
  jsonrpc: "2.0",
  method: "call",
  id: 1
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
