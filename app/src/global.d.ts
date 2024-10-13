declare global {
    var mongoose: {
      conn: any;
      promise: Promise<any> | null;
    };
  }
  
  // This is necessary for TypeScript to treat this file as a module.
  export {};
  