export default class MockService {
  host: string;
  withDB: boolean;
  constructor(host: string, withDB?: boolean);
  get: (url: string) => {
    end: () => Promise<
      | {
          err: null;
          res: any;
        }
      | {
          err: any;
          res?: undefined;
        }
    >;
  };
  post: (
    url: string,
    data: any,
  ) => {
    end: () => Promise<
      | {
          err: null;
          res: any;
        }
      | {
          err: any;
          res?: undefined;
        }
    >;
  };
}
